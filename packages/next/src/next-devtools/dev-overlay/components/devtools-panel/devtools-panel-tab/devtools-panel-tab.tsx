import type { DevToolsPanelTabType } from '../devtools-panel'
import type { Corners, OverlayState } from '../../../shared'
import type { DebugInfo } from '../../../../shared/types'
import type { ReadyRuntimeError } from '../../../utils/get-error-by-type'
import type { HydrationErrorState } from '../../../../shared/hydration-error'

import { SettingsTab } from './settings-tab'
import { IssuesTab } from './issues-tab/issues-tab'

export function DevToolsPanelTab({
  activeTab,
  devToolsPosition,
  scale,
  handlePositionChange,
  handleScaleChange,
  debugInfo,
  runtimeErrors,
  getSquashedHydrationErrorDetails,
  buildError,
}: {
  activeTab: DevToolsPanelTabType
  devToolsPosition: Corners
  scale: number
  handlePositionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  handleScaleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  debugInfo: DebugInfo
  runtimeErrors: ReadyRuntimeError[]
  getSquashedHydrationErrorDetails: (error: Error) => HydrationErrorState | null
  buildError: OverlayState['buildError']
}) {
  switch (activeTab) {
    case 'settings':
      return (
        <SettingsTab
          devToolsPosition={devToolsPosition}
          scale={scale}
          handlePositionChange={handlePositionChange}
          handleScaleChange={handleScaleChange}
        />
      )
    case 'route':
      return <div>Route</div>
    case 'issues':
      return (
        <IssuesTab
          debugInfo={debugInfo}
          runtimeErrors={runtimeErrors}
          getSquashedHydrationErrorDetails={getSquashedHydrationErrorDetails}
          buildError={buildError}
        />
      )
    default:
      return null
  }
}
