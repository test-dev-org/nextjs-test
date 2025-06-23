import type { OverlayState } from '../../../../shared'
import type { DebugInfo } from '../../../../../shared/types'
import type { ReadyRuntimeError } from '../../../../utils/get-error-by-type'
import type { HydrationErrorState } from '../../../../../shared/hydration-error'

import { IssuesTabSidebar } from './issues-tab-sidebar'
import { IssuesTabContent } from './issues-tab-content'
import { css } from '../../../../utils/css'
import { useActiveRuntimeError } from '../../../../hooks/use-active-runtime-error'
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

  return (
    <div data-nextjs-devtools-panel-tab-issues>
      <IssuesTabSidebar
        runtimeErrors={runtimeErrors}
        errorType={errorType}
        activeIdx={activeIdx}
        setActiveIndex={setActiveIndex}
      />

      {/* This is the copy of the Error Overlay content. */}
      <IssuesTabContent
        buildError={buildError}
        notes={notes}
        hydrationWarning={hydrationWarning}
        errorDetails={errorDetails}
        activeError={activeError}
        debugInfo={debugInfo}
        errorCode={errorCode}
        errorType={errorType}
      />
    </div>
  )
}

export const DEVTOOLS_PANEL_TAB_ISSUES_STYLES = css`
  [data-nextjs-devtools-panel-tab-issues] {
    display: flex;
    flex: 1;
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
