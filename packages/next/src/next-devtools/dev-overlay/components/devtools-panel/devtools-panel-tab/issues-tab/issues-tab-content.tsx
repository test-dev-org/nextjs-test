import type { OverlayState } from '../../../../shared'
import type { DebugInfo } from '../../../../../shared/types'
import type { ReadyRuntimeError } from '../../../../utils/get-error-by-type'
import type { ErrorType } from '../../../errors/error-type-label/error-type-label'

import { Suspense, useMemo, useState } from 'react'

import {
  GenericErrorDescription,
  HydrationErrorDescription,
} from '../../../../container/errors'
import { EnvironmentNameLabel } from '../../../errors/environment-name-label/environment-name-label'
import { ErrorMessage } from '../../../errors/error-message/error-message'
import { ErrorOverlayToolbar } from '../../../errors/error-overlay-toolbar/error-overlay-toolbar'
import { ErrorTypeLabel } from '../../../errors/error-type-label/error-type-label'
import { IssueFeedbackButton } from '../../../errors/error-overlay-toolbar/issue-feedback-button'
import { Terminal } from '../../../terminal'
import { HotlinkedText } from '../../../hot-linked-text'
import { PseudoHtmlDiff } from '../../../../container/runtime-error/component-stack-pseudo-html'
import { useFrames } from '../../../../utils/get-error-by-type'
import { CodeFrame } from '../../../code-frame/code-frame'
import { CallStack } from '../../../call-stack/call-stack'
import { NEXTJS_HYDRATION_ERROR_LINK } from '../../../../../shared/react-19-hydration-error'
import { ErrorContentSkeleton } from '../../../../container/runtime-error/error-content-skeleton'
import { css } from '../../../../utils/css'

export function IssuesTabContent({
  notes,
  buildError,
  hydrationWarning,
  errorDetails,
  activeError,
  errorCode,
  errorType,
  debugInfo,
}: {
  notes: string | null
  buildError: OverlayState['buildError']
  hydrationWarning: string | null
  errorDetails: {
    hydrationWarning: string | null
    notes: string | null
    reactOutputComponentDiff: string | null
  }
  activeError: ReadyRuntimeError
  errorCode: string | undefined
  errorType: ErrorType
  debugInfo: DebugInfo
}) {
  if (buildError) {
    return <Terminal content={buildError} />
  }

  const errorMessage = hydrationWarning ? (
    <HydrationErrorDescription message={hydrationWarning} />
  ) : (
    <GenericErrorDescription error={activeError.error} />
  )

  return (
    <div data-nextjs-devtools-panel-tab-issues-content-container>
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
      <div className="error-overlay-notes-container">
        {notes ? (
          <>
            <p
              id="nextjs__container_errors__notes"
              className="nextjs__container_errors__notes"
            >
              {notes}
            </p>
          </>
        ) : null}
        {hydrationWarning ? (
          <p
            id="nextjs__container_errors__link"
            className="nextjs__container_errors__link"
          >
            <HotlinkedText
              text={`See more info here: ${NEXTJS_HYDRATION_ERROR_LINK}`}
            />
          </p>
        ) : null}
      </div>
      {errorDetails.reactOutputComponentDiff ? (
        <PseudoHtmlDiff
          reactOutputComponentDiff={errorDetails.reactOutputComponentDiff || ''}
        />
      ) : null}
      <Suspense fallback={<ErrorContentSkeleton />}>
        <RuntimeError key={activeError.id.toString()} error={activeError} />
      </Suspense>
    </div>
  )
}

/* Ported the content from container/runtime-error/index.tsx */
function RuntimeError({ error }: { error: ReadyRuntimeError }) {
  const [isIgnoreListOpen, setIsIgnoreListOpen] = useState(false)
  const frames = useFrames(error)

  const ignoredFramesTally = useMemo(() => {
    return frames.reduce((tally, frame) => tally + (frame.ignored ? 1 : 0), 0)
  }, [frames])

  const firstFrame = useMemo(() => {
    const firstFirstPartyFrameIndex = frames.findIndex(
      (entry) =>
        !entry.ignored &&
        Boolean(entry.originalCodeFrame) &&
        Boolean(entry.originalStackFrame)
    )

    return frames[firstFirstPartyFrameIndex] ?? null
  }, [frames])

  return (
    <>
      {firstFrame &&
        firstFrame.originalStackFrame &&
        firstFrame.originalCodeFrame && (
          <CodeFrame
            stackFrame={firstFrame.originalStackFrame}
            codeFrame={firstFrame.originalCodeFrame}
          />
        )}

      {frames.length > 0 && (
        <CallStack
          frames={frames}
          isIgnoreListOpen={isIgnoreListOpen}
          onToggleIgnoreList={() => setIsIgnoreListOpen(!isIgnoreListOpen)}
          ignoredFramesTally={ignoredFramesTally}
        />
      )}
    </>
  )
}

// The components in this file shares the style with the Error Overlay.
export const DEVTOOLS_PANEL_TAB_ISSUES_CONTENT_STYLES = css`
  [data-nextjs-devtools-panel-tab-issues-content-container] {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    min-height: 0;
    padding: 14px;
  }
`
