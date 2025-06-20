import type { DevToolsPanelTabType } from '../devtools-panel'

export function DevToolsPanelTab({
  activeTab,
}: {
  activeTab: DevToolsPanelTabType
}) {
  switch (activeTab) {
    case 'settings':
      return <div>Settings</div>
    case 'route':
      return <div>Route</div>
    case 'issues':
      return <div>Issues</div>
    default:
      return null
  }
}
