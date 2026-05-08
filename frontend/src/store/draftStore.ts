import { create } from 'zustand'
import type { AgentStatus, Platform, StateSnapshot } from '../lib/types'

interface DraftStore {
  threadId: string | null
  article: string
  agentStatus: Record<string, AgentStatus>
  snapshot: StateSnapshot | null
  error: string | null
  isHistoryView: boolean

  setThreadId: (id: string) => void
  setArticle: (text: string) => void
  setAgentStatus: (agent: string, status: AgentStatus) => void
  setSnapshot: (snapshot: StateSnapshot) => void
  setError: (err: string | null) => void
  setIsHistoryView: (value: boolean) => void
  approveLocal: (platform: Platform) => void
  reset: () => void
}

const initialAgentStatus: Record<string, AgentStatus> = {
  parser: 'idle',
  twitter: 'idle',
  linkedin: 'idle',
  newsletter: 'idle',
  critic: 'idle',
}

export const useDraftStore = create<DraftStore>((set) => ({
  threadId: null,
  article: '',
  agentStatus: { ...initialAgentStatus },
  snapshot: null,
  error: null,
  isHistoryView: false,

  setThreadId: (id) => set({ threadId: id }),
  setArticle: (text) => set({ article: text }),
  setAgentStatus: (agent, status) =>
    set((state) => ({
      agentStatus: { ...state.agentStatus, [agent]: status },
    })),
  setSnapshot: (snapshot) => set({ snapshot }),
  setError: (err) => set({ error: err }),
  setIsHistoryView: (value) => set({ isHistoryView: value }),
  approveLocal: (platform) =>
    set((state) => {
      if (!state.snapshot) return state
      return {
        snapshot: {
          ...state.snapshot,
          [`${platform}_approved`]: true,
        },
      }
    }),
  reset: () =>
    set((state) => ({
      threadId: null,
      article: state.article,
      agentStatus: { ...initialAgentStatus },
      snapshot: null,
      error: null,
      isHistoryView: false,
    })),
}))
