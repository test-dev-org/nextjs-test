import type { OverlayState } from '../../../../shared'
import type { DebugInfo } from '../../../../../shared/types'
import type { ReadyRuntimeError } from '../../../../utils/get-error-by-type'
import type { HydrationErrorState } from '../../../../../shared/hydration-error'

import { IssuesTabSidebar } from './issues-tab-sidebar'
import { IssuesTabContent } from './issues-tab-content'
import {
  GenericErrorDescription,
  HydrationErrorDescription,
} from '../../../../container/errors'
import { EnvironmentNameLabel } from '../../../errors/environment-name-label/environment-name-label'
import { ErrorMessage } from '../../../errors/error-message/error-message'
import { ErrorOverlayToolbar } from '../../../errors/error-overlay-toolbar/error-overlay-toolbar'
import { ErrorTypeLabel } from '../../../errors/error-type-label/error-type-label'
import { css } from '../../../../utils/css'
import { useActiveRuntimeError } from '../../../../hooks/use-active-runtime-error'
import { IssueFeedbackButton } from '../../../errors/error-overlay-toolbar/issue-feedback-button'
import { Warning } from '../../../../icons/warning'

export function IssuesTab({
  debugInfo,
  runtimeErrors,
  getSquashedHydrationErrorDetails,
  buildError,
}: {
  debugInfo: DebugInfo
  runtimeErrors: ReadyRuntimeError[]
  getSquashedHydrationErrorDetails: (error: Error) => HydrationErrorState | null
  buildError: OverlayState['buildError']
}) {
  const {
    errorCode,
    errorType,
    hydrationWarning,
    activeError,
    activeIdx,
    setActiveIndex,
    notes,
    errorDetails,
  } = useActiveRuntimeError({ runtimeErrors, getSquashedHydrationErrorDetails })

  console.log({ activeError })

  if (!activeError) {
    return (
      <div data-nextjs-devtools-panel-tab-issues-empty>
        <div data-nextjs-devtools-panel-tab-issues-empty-content>
          <div data-nextjs-devtools-panel-tab-issues-empty-icon>
            <Warning width={16} height={16} />
          </div>
          <h3 data-nextjs-devtools-panel-tab-issues-empty-title>
            No Issues Found
          </h3>
          <p data-nextjs-devtools-panel-tab-issues-empty-subtitle>
            Issues will appear here when they occur.
          </p>
        </div>
      </div>
    )
  }

  const errorMessage = hydrationWarning ? (
    <HydrationErrorDescription message={hydrationWarning} />
  ) : (
    <GenericErrorDescription error={activeError.error} />
  )

  return (
    <div data-nextjs-devtools-panel-tab-issues>
      <IssuesTabSidebar
        runtimeErrors={runtimeErrors}
        errorType={errorType}
        activeIdx={activeIdx}
        setActiveIndex={setActiveIndex}
      />
      <div data-nextjs-devtools-panel-tab-issues-content>
        <div className="nextjs-container-errors-header">
          <div
            className="nextjs__container_errors__error_title"
            // allow assertion in tests before error rating is implemented
            data-nextjs-error-code={errorCode}
          >
            <span data-nextjs-error-label-group>
              <ErrorTypeLabel errorType={errorType} />
              {activeError.error.environmentName && (
                <EnvironmentNameLabel
                  environmentName={activeError.error.environmentName}
                />
              )}
            </span>
            <ErrorOverlayToolbar
              error={activeError.error}
              debugInfo={debugInfo}
              // TODO: Move the button inside and remove the feedback on the footer of the error overlay.
              feedbackButton={
                errorCode && <IssueFeedbackButton errorCode={errorCode} />
              }
            />
          </div>
          <ErrorMessage errorMessage={errorMessage} />
        </div>
        <IssuesTabContent
          buildError={buildError}
          notes={notes}
          hydrationWarning={hydrationWarning}
          errorDetails={errorDetails}
          activeError={activeError}
        />
      </div>
    </div>
  )
}

export const DEVTOOLS_PANEL_TAB_ISSUES_STYLES = css`
  [data-nextjs-devtools-panel-tab-issues] {
    display: flex;
    flex: 1;
    min-height: 0;
  }

  [data-nextjs-devtools-panel-tab-issues-content] {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    min-height: 0;
  }

  [data-nextjs-devtools-panel-tab-issues-empty] {
    display: flex;
    flex: 1;
    padding: 12px;
    min-height: 0;
  }

  [data-nextjs-devtools-panel-tab-issues-empty-content] {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    border: 1px dashed var(--color-gray-alpha-500);
    border-radius: 4px;
  }

  [data-nextjs-devtools-panel-tab-issues-empty-icon] {
    margin-bottom: 16px;
    padding: 8px;
    border: 1px solid var(--color-gray-alpha-400);
    border-radius: 6px;

    background-color: var(--color-background-100);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  [data-nextjs-devtools-panel-tab-issues-empty-title] {
    color: var(--color-gray-1000);
    font-size: 16px;
    font-weight: 500;
    line-height: var(--line-height-20);
  }

  [data-nextjs-devtools-panel-tab-issues-empty-subtitle] {
    color: var(--color-gray-900);
    font-size: 14px;
    line-height: var(--line-height-21);
  }
`
