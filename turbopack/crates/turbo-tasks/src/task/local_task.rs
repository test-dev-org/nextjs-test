use std::{borrow::Cow, fmt, sync::Arc};

use anyhow::{Result, anyhow};

use crate::{
    MagicAny, OutputContent, RawVc, TaskPersistence, TraitMethod, TurboTasksBackendApi,
    ValueTypeId,
    backend::{Backend, TaskExecutionSpec, TypedCellContent},
    event::Event,
    macro_helpers::NativeFunction,
    registry,
};

/// A potentially in-flight local task stored in `CurrentGlobalTaskState::local_tasks`.
pub enum LocalTask {
    Scheduled { done_event: Event },
    Done { output: OutputContent },
}

pub fn get_local_task_execution_spec<'a>(
    turbo_tasks: &'_ dyn TurboTasksBackendApi<impl Backend + 'static>,
    ty: &'a LocalTaskType,
    // if this is a `LocalTaskType::Resolve*`, we'll spawn another task with this persistence, if
    // this is a `LocalTaskType::Native`, this refers to the parent non-local task.
    persistence: TaskPersistence,
) -> TaskExecutionSpec<'a> {
    match ty {
        LocalTaskType::Native {
            native_fn,
            this,
            arg,
        } => {
            let span = native_fn.span(TaskPersistence::Local);
            let entered = span.enter();
            let future = native_fn.execute(*this, &**arg);
            drop(entered);
            TaskExecutionSpec { future, span }
        }
        LocalTaskType::ResolveNative {
            native_fn,
            this,
            arg,
        } => {
            let span = native_fn.resolve_span(TaskPersistence::Local);
            let entered = span.enter();
            let future = Box::pin(LocalTaskType::run_resolve_native(
                native_fn,
                *this,
                &**arg,
                persistence,
                turbo_tasks.pin(),
            ));
            drop(entered);
            TaskExecutionSpec { future, span }
        }
        LocalTaskType::ResolveTrait {
            trait_method,
            this,
            arg,
        } => {
            let span = trait_method.resolve_span();
            let entered = span.enter();
            let future = Box::pin(LocalTaskType::run_resolve_trait(
                trait_method,
                *this,
                &**arg,
                persistence,
                turbo_tasks.pin(),
            ));
            drop(entered);
            TaskExecutionSpec { future, span }
        }
    }
}

pub enum LocalTaskType {
    /// A normal task execution a native (rust) function
    Native {
        native_fn: &'static NativeFunction,
        this: Option<RawVc>,
        arg: Box<dyn MagicAny>,
    },

    /// A resolve task, which resolves arguments and calls the function with resolve arguments. The
    /// inner function call will be a `PersistentTaskType` or `LocalTaskType::Native`.
    ResolveNative {
        native_fn: &'static NativeFunction,
        this: Option<RawVc>,
        arg: Box<dyn MagicAny>,
    },

    /// A trait method resolve task. It resolves the first (`self`) argument and looks up the trait
    /// method on that value. Then it calls that method. The method call will do a cache lookup and
    /// might resolve arguments before.
    ResolveTrait {
        trait_method: &'static TraitMethod,
        this: RawVc,
        arg: Box<dyn MagicAny>,
    },
}

impl fmt::Display for LocalTaskType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            LocalTaskType::Native {
                native_fn,
                this: _,
                arg: _,
            } => f.write_str(native_fn.name),
            LocalTaskType::ResolveNative {
                native_fn,
                this: _,
                arg: _,
            } => write!(f, "*{}", native_fn.name),
            LocalTaskType::ResolveTrait {
                trait_method,
                this: _,
                arg: _,
            } => write!(
                f,
                "*{}::{}",
                trait_method.trait_name, trait_method.method_name
            ),
        }
    }
}

impl LocalTaskType {
    /// Returns the name of the function in the code. Trait methods are
    /// formatted as `TraitName::method_name`.
    ///
    /// Equivalent to [`ToString::to_string`], but potentially more efficient as
    /// it can return a `&'static str` in many cases.
    pub fn get_name(&self) -> Cow<'static, str> {
        match self {
            Self::Native {
                native_fn,
                this: _,
                arg: _,
            } => Cow::Borrowed(native_fn.name),
            Self::ResolveNative {
                native_fn,
                this: _,
                arg: _,
            } => format!("*{}", native_fn.name).into(),
            Self::ResolveTrait {
                trait_method,
                this: _,
                arg: _,
            } => format!("*{}::{}", trait_method.trait_name, trait_method.method_name).into(),
        }
    }

    /// Implementation of the LocalTaskType::ResolveNative task.
    /// Resolves all the task inputs and then calls the given function.
    async fn run_resolve_native<B: Backend + 'static>(
        native_fn: &'static NativeFunction,
        mut this: Option<RawVc>,
        arg: &dyn MagicAny,
        persistence: TaskPersistence,
        turbo_tasks: Arc<dyn TurboTasksBackendApi<B>>,
    ) -> Result<RawVc> {
        if let Some(this) = this.as_mut() {
            *this = this.resolve().await?;
        }
        let arg = native_fn.arg_meta.resolve(arg).await?;
        Ok(turbo_tasks.native_call(native_fn, this, arg, persistence))
    }
    /// Implementation of the LocalTaskType::ResolveTrait task.
    async fn run_resolve_trait<B: Backend + 'static>(
        trait_method: &'static TraitMethod,
        this: RawVc,
        arg: &dyn MagicAny,
        persistence: TaskPersistence,
        turbo_tasks: Arc<dyn TurboTasksBackendApi<B>>,
    ) -> Result<RawVc> {
        let this = this.resolve().await?;
        let TypedCellContent(this_ty, _) = this.into_read().await?;

        let native_fn = Self::resolve_trait_method_from_value(trait_method, this_ty)?;
        let arg = native_fn.arg_meta.filter_and_resolve(arg).await?;
        Ok(turbo_tasks.native_call(native_fn, Some(this), arg, persistence))
    }

    fn resolve_trait_method_from_value(
        trait_method: &'static TraitMethod,
        value_type: ValueTypeId,
    ) -> Result<&'static NativeFunction> {
        match registry::get_value_type(value_type).get_trait_method(trait_method) {
            Some(native_fn) => Ok(native_fn),
            None => Err(anyhow!(
                "{} doesn't implement the trait for {:?}, the compiler should have flagged this",
                registry::get_value_type(value_type),
                trait_method
            )),
        }
    }
}

#[cfg(test)]
pub(crate) mod tests {
    use super::*;
    use crate::{self as turbo_tasks, TaskId, Vc};

    #[turbo_tasks::function]
    fn mock_func_task() -> Vc<()> {
        Vc::cell(())
    }

    #[turbo_tasks::value_trait]
    trait MockTrait {
        #[turbo_tasks::function]
        fn mock_method_task() -> Vc<()>;
    }

    #[test]
    fn test_get_name() {
        crate::register();
        assert_eq!(
            LocalTaskType::Native {
                native_fn: &MOCK_FUNC_TASK_FUNCTION,
                this: None,
                arg: Box::new(()),
            }
            .get_name(),
            "mock_func_task",
        );
        assert_eq!(
            LocalTaskType::ResolveTrait {
                trait_method: MOCKTRAIT_TRAIT_TYPE.get("mock_method_task"),
                this: RawVc::TaskOutput(unsafe { TaskId::new_unchecked(1) }),
                arg: Box::new(()),
            }
            .get_name(),
            "*MockTrait::mock_method_task",
        );
    }
}
