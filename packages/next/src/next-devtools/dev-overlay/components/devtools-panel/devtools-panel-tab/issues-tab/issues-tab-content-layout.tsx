import type { DebugInfo } from '../../../../../shared/types'
import type { ReadyRuntimeError } from '../../../../utils/get-error-by-type'
import type { ErrorType } from '../../../errors/error-type-label/error-type-label'

import {
  GenericErrorDescription,
  HydrationErrorDescription,
} from '../../../../container/errors'
import { EnvironmentNameLabel } from '../../../errors/environment-name-label/environment-name-label'
import { ErrorMessage } from '../../../errors/error-message/error-message'
import { ErrorOverlayToolbar } from '../../../errors/error-overlay-toolbar/error-overlay-toolbar'
import { ErrorTypeLabel } from '../../../errors/error-type-label/error-type-label'
import { IssueFeedbackButton } from '../../../errors/error-overlay-toolbar/issue-feedback-button'
import { css } from '../../../../utils/css'

// This behaves like the ErrorOverlayLayout.
export function IssuesTabContentLayout({
  hydrationWarning,
  activeError,
  errorCode,
  errorType,
  debugInfo,
  children,
}: {
  hydrationWarning: string | null
  activeError: ReadyRuntimeError
  errorCode: string | undefined
  errorType: ErrorType
  debugInfo: DebugInfo
  children: React.ReactNode
}) {
  const errorMessage = hydrationWarning ? (
    <HydrationErrorDescription message={hydrationWarning} />
  ) : (
    <GenericErrorDescription error={activeError.error} />
  )

  return (
    <div data-nextjs-devtools-panel-tab-issues-content-layout>
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
      {children}
    </div>
  )
}

// The components in this file shares the style with the Error Overlay.
export const DEVTOOLS_PANEL_TAB_ISSUES_CONTENT_LAYOUT_STYLES = css`
  [data-nextjs-devtools-panel-tab-issues-content-layout] {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    min-height: 0;
    padding: 14px;
  }
`
