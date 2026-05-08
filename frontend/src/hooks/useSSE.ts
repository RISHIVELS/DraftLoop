import { useEffect, useRef } from 'react'
import { getStatusUrl } from '../lib/api'
import { useDraftStore } from '../store/draftStore'
import type { StateSnapshot } from '../lib/types'

/**
 * sseKey: increment this to force a reconnection (e.g. after approve/regenerate).
 * Each new connection drives a fresh graph execution or resume from checkpoint.
 */
export function useSSE(
  threadId: string | null,
  sseKey: number,
  onComplete?: (snapshot: StateSnapshot) => void,
) {
  const setAgentStatus = useDraftStore((s) => s.setAgentStatus)
  const setSnapshot = useDraftStore((s) => s.setSnapshot)
  const setError = useDraftStore((s) => s.setError)
  const esRef = useRef<EventSource | null>(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (!threadId) return

    // Close any previous connection before opening a new one
    if (esRef.current) {
      esRef.current.close()
      esRef.current = null
    }

    const es = new EventSource(getStatusUrl(threadId))
    esRef.current = es

    es.addEventListener('agent_status', (e: MessageEvent) => {
      const data = JSON.parse(e.data)
      setAgentStatus(data.agent, data.status as 'running' | 'done')
      if (data.state) {
        setSnapshot(data.state as StateSnapshot)
      }
    })

    es.addEventListener('complete', (e: MessageEvent) => {
      const data = JSON.parse(e.data)
      if (data.state) {
        setSnapshot(data.state as StateSnapshot)
        onCompleteRef.current?.(data.state as StateSnapshot)
      }
      es.close()
      esRef.current = null
    })

    es.addEventListener('error', (e: MessageEvent) => {
      try {
        const data = JSON.parse((e as MessageEvent).data)
        setError(data.message ?? 'Unknown error')
      } catch {
        // parse error — ignore
      }
      es.close()
      esRef.current = null
    })

    // Don't auto-reconnect on network drop — we control reconnection via sseKey
    es.onerror = () => {
      es.close()
      esRef.current = null
    }

    return () => {
      es.close()
      esRef.current = null
    }
  }, [threadId, sseKey, setAgentStatus, setError, setSnapshot])
}
