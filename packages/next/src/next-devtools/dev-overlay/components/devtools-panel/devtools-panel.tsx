import type { OverlayDispatch, OverlayState } from '../../shared'

import { Dialog, DialogContent, DialogHeader, DialogBody } from '../dialog'
import { Overlay } from '../overlay/overlay'
import {
  ACTION_DEVTOOLS_PANEL_CLOSE,
  ACTION_DEVTOOLS_POSITION,
  STORAGE_KEY_POSITION,
} from '../../shared'
import { css } from '../../utils/css'
import { OverlayBackdrop } from '../overlay'
import { Draggable } from '../errors/dev-tools-indicator/draggable'
import { INDICATOR_PADDING } from '../devtools-indicator/devtools-indicator'

export function DevToolsPanel({
  state,
  dispatch,
}: {
  state: OverlayState
  dispatch: OverlayDispatch
}) {
  const [vertical, horizontal] = state.devToolsPosition.split('-', 2)

  const onClose = () => {
    dispatch({ type: ACTION_DEVTOOLS_PANEL_CLOSE })
  }

  return (
    <Overlay
      data-nextjs-devtools-panel-overlay
      style={{
        [vertical]: `${INDICATOR_PADDING}px`,
        [horizontal]: `${INDICATOR_PADDING}px`,
        [vertical === 'top' ? 'bottom' : 'top']: 'auto',
        [horizontal === 'left' ? 'right' : 'left']: 'auto',
      }}
    >
      {/* TODO: Investigate why onClose on Dialog doesn't close when clicked outside. */}
      <OverlayBackdrop
        data-nextjs-devtools-panel-overlay-backdrop
        onClick={onClose}
      />
      <Draggable
        padding={INDICATOR_PADDING}
        onDragStart={() => {}}
        position={state.devToolsPosition}
        setPosition={(p) => {
          localStorage.setItem(STORAGE_KEY_POSITION, p)
          dispatch({
            type: ACTION_DEVTOOLS_POSITION,
            devToolsPosition: p,
          })
        }}
      >
        <Dialog
          data-nextjs-devtools-panel-dialog
          aria-labelledby="nextjs__container_dev_tools_panel_label"
          aria-describedby="nextjs__container_dev_tools_panel_desc"
          onClose={onClose}
        >
          <DialogContent>
            <DialogHeader></DialogHeader>
            <DialogBody></DialogBody>
          </DialogContent>
        </Dialog>
      </Draggable>
    </Overlay>
  )
}

export const DEVTOOLS_PANEL_STYLES = css`
  [data-nextjs-devtools-panel-overlay] {
    padding: initial;
    margin: auto;
    /* TODO: This is for fullscreen mode. */
    /* top: 10vh; */
  }

  [data-nextjs-devtools-panel-overlay-backdrop] {
    /* TODO: Blur on fullscreen mode. */
    opacity: 0;
  }

  [data-nextjs-devtools-panel-dialog] {
    -webkit-font-smoothing: antialiased;
    display: flex;
    flex-direction: column;
    background: var(--color-background-100);
    background-clip: padding-box;
    border: 1px solid var(--color-gray-400);
    border-radius: var(--rounded-xl);
    box-shadow: var(--shadow-lg);
    position: relative;
    overflow-y: auto;

    /* TODO: Remove once the content is filled. */
    min-width: 800px;
    min-height: 500px;

    /* This is handled from dialog/styles.ts */
    max-width: var(--next-dialog-max-width);
  }
`
