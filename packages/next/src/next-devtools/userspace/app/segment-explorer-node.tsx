'use client'
import type { ReactNode } from 'react'
import { Fragment, useMemo, useState, createContext, useContext } from 'react'
import { useEffect } from 'react'
import { dispatcher } from 'next/dist/compiled/next-devtools'
import { notFound } from '../../../api/navigation.react-server'

let currentPending: {
  promise: Promise<unknown>
  release: () => void
} | null = null
// Return the promise itself and a function to resolve it later
function createForeverPending() {
  let resolve: (value?: unknown) => void
  const promise = new Promise((res) => {
    resolve = res
  })
  return {
    promise,
    release: () => {
      console.log('Releasing forever pending promise', resolve)
      if (resolve) resolve()
    },
  }
}

function triggerBoundary(type: 'not-found' | 'error' | 'loading' | null) {
  if (type === 'not-found') {
    notFound()
  } else if (type === 'error') {
    throw new Error('__NEXT_DEVTOOLS_SEGMENT_ERROR__')
  } else if (type === 'loading') {
    const pending = createForeverPending()
    currentPending = pending
    throw pending.promise
  } else if (type === null) {
    console.log('currentPending', currentPending)
    if (currentPending) {
      currentPending.release()
      currentPending = null
    }
  }
}

export function SegmentViewNode({
  type,
  pagePath,
  children,
}: {
  type: string
  pagePath: string
  children?: ReactNode
}): React.ReactNode {
  const { boundaryType, setBoundaryType } = useSegmentState()
  const nodeState = useMemo(
    () => ({
      type,
      pagePath,
      boundaryType,
      setBoundaryType,
    }),
    [type, pagePath, boundaryType, setBoundaryType]
  )

  const isChildBoundary = type !== 'layout' && type !== 'template'
  const isNotMatchingBoundary = boundaryType && type !== boundaryType

  useEffect(() => {
    dispatcher.segmentExplorerNodeAdd(nodeState)
    return () => {
      dispatcher.segmentExplorerNodeRemove(nodeState)
    }
  }, [nodeState, boundaryType])

  useEffect(() => {
    if (isChildBoundary && isNotMatchingBoundary) {
      dispatcher.segmentExplorerNodeRemove(nodeState)
    }
  }, [nodeState, isChildBoundary, isNotMatchingBoundary])

  useEffect(() => {
    if (isChildBoundary && type !== boundaryType) {
      triggerBoundary(boundaryType)
    }
  }, [isChildBoundary, type, boundaryType])

  if (isChildBoundary && isNotMatchingBoundary) {
    return null
  }

  return <Fragment key={'segment-' + type}>{children}</Fragment>
}

const SegmentStateContext = createContext<{
  boundaryType: 'not-found' | 'error' | 'loading' | null
  setBoundaryType: (type: 'not-found' | 'error' | 'loading' | null) => void
}>({
  boundaryType: null,
  setBoundaryType: () => {},
})

export function SegmentStateProvider({ children }: { children: ReactNode }) {
  const [boundaryType, setBoundaryType] = useState<
    'not-found' | 'error' | 'loading' | null
  >(null)

  return (
    <SegmentStateContext.Provider value={{ boundaryType, setBoundaryType }}>
      {children}
    </SegmentStateContext.Provider>
  )
}

export function useSegmentState() {
  return useContext(SegmentStateContext)
}
