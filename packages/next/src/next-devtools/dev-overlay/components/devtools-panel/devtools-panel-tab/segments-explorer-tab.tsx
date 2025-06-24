import { useSegmentTree } from '../../../segment-explorer'
import { PageSegmentTree } from '../../overview/segment-explorer'

function SegmentsExplorer({
  routerType,
}: React.HTMLProps<HTMLDivElement> & {
  routerType: 'app' | 'pages'
}) {
  const tree = useSegmentTree()
  const isAppRouter = routerType === 'app'
  return <PageSegmentTree tree={tree} isAppRouter={isAppRouter} />
}

export function SegmentsExplorerTab({
  routerType,
}: {
  routerType: 'app' | 'pages'
}) {
  return (
    <div data-nextjs-devtools-panel-segments-explorer>
      <SegmentsExplorer routerType={routerType} />
    </div>
  )
}

export const SEGMENTS_EXPLORER_TAB_STYLES = `
  [data-nextjs-devtools-panel-segments-explorer] {
    padding: 0 8px;
  }
`
