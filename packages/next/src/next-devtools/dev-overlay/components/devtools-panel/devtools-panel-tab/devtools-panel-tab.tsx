import type { DevToolsPanelTabType } from '../devtools-panel'

import { Settings } from './settings'

export function DevToolsPanelTab({
  activeTab,
}: {
  activeTab: DevToolsPanelTabType
}) {
  switch (activeTab) {
    case 'settings':
      return <Settings />
    case 'route':
      return <div>Route</div>
    case 'issues':
      return <div>Issues</div>
    default:
      return null
  }
}
