import { useEffect, useRef, type RefObject } from 'react'
import { logQueue } from '../term-logs/client'

export const useForwardConsoleLog = (socket: WebSocket | null) => {
  useEffect(() => {
    if (!socket) {
      return
    }

    const onOpen = () => {

      logQueue.onSocketReady(socket)
    }
    socket.addEventListener('open', onOpen)

    return () => {
      socket.removeEventListener('open', onOpen)
    }
  }, [socket])
}
