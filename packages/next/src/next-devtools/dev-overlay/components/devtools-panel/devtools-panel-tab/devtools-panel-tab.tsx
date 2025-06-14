import type { DevToolsPanelTabType } from '../devtools-panel'
import type { OverlayDispatch, OverlayState } from '../../../shared'

import { SettingsTab } from './settings-tab'

export function DevToolsPanelTab({
  activeTab,
  state,
  dispatch,
}: {
  activeTab: DevToolsPanelTabType
  state: OverlayState
  dispatch: OverlayDispatch
}) {
  switch (activeTab) {
    case 'settings':
      return <SettingsTab state={state} dispatch={dispatch} />
    case 'route':
      return <div>Route</div>
    case 'issues':
      return <div>Issues</div>
    default:
      return null
  }
}
