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
    isLoading,
    errorCode,
    errorType,
    hydrationWarning,
    activeError,
    activeIdx,
    setActiveIndex,
    notes,
    errorDetails,
  } = useActiveRuntimeError({ runtimeErrors, getSquashedHydrationErrorDetails })

  if (isLoading) {
    // TODO: better loading state
    return null
  }

  if (!activeError) {
    return null
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
`
