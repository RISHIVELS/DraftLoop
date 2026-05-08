import { StatusDot } from '../ui/StatusDot'
import { useDraftStore } from '../../store/draftStore'
import type { AgentStatus } from '../../lib/types'

const AGENTS: { key: string; label: string }[] = [
  { key: 'parser', label: 'Parser Agent' },
  { key: 'twitter', label: 'Twitter Agent' },
  { key: 'linkedin', label: 'LinkedIn Agent' },
  { key: 'newsletter', label: 'Newsletter Agent' },
  { key: 'critic', label: 'Critic Agent' },
]

export function AgentStatusPanel() {
  const agentStatus = useDraftStore((s) => s.agentStatus)

  const allDone = AGENTS.every((a) => agentStatus[a.key] === 'done')
  const anyRunning = AGENTS.some((a) => agentStatus[a.key] === 'running')

  return (
    <div className="border-2 border-ink rounded card-shadow bg-white overflow-hidden">
      <div className="border-b-2 border-ink px-4 py-2 bg-surface-dim flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink">
          AGENT_PIPELINE
        </span>
        <div className="flex items-center gap-2">
          {anyRunning && (
            <span className="text-xs font-mono text-orange-500 font-bold animate-blink">● RUNNING</span>
          )}
          {allDone && (
            <span className="text-xs font-mono text-green-600 font-bold">● ALL DONE</span>
          )}
          {!anyRunning && !allDone && (
            <span className="text-xs font-mono text-ink/40">● STANDBY</span>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
        {AGENTS.map((agent) => (
          <StatusDot
            key={agent.key}
            agent={agent.key}
            label={agent.label}
            status={(agentStatus[agent.key] ?? 'idle') as AgentStatus}
          />
        ))}
      </div>
    </div>
  )
}
