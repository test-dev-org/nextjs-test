import type { DevToolsPanelTabType } from '../devtools-panel'
import type { Corners } from '../../../shared'

import { SettingsTab } from './settings-tab'

export function DevToolsPanelTab({
  activeTab,
  devToolsPosition,
  scale,
  handlePositionChange,
  handleScaleChange,
}: {
  activeTab: DevToolsPanelTabType
  devToolsPosition: Corners
  scale: number
  handlePositionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  handleScaleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
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
      return <div>Issues</div>
    default:
      return null
  }
}
