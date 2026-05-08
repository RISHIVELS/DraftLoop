import type { AgentStatus } from '../../lib/types'
import { useAgentPhrase } from '../../hooks/useAgentPhrase'

interface StatusDotProps {
  agent: string
  label: string
  status: AgentStatus
}

export function StatusDot({ agent, label, status }: StatusDotProps) {
  const isRunning = status === 'running'
  const isDone = status === 'done'
  const phrase = useAgentPhrase(agent, isRunning)

  const dotColor = isRunning
    ? 'bg-orange-400 animate-blink border-orange-600'
    : isDone
    ? 'bg-green-500 border-green-700'
    : 'bg-surface-dim border-ink'

  return (
    <div className="flex items-start gap-3">
      <div className={`w-3 h-3 mt-1 rounded-sm border-2 flex-shrink-0 ${dotColor}`} />
      <div className="min-w-0">
        <div className="text-xs font-mono font-bold uppercase tracking-widest text-ink">
          {label}
        </div>
        <div className="text-xs font-mono h-4">
          {isRunning && (
            <span className="text-orange-600 font-bold">
              {phrase}<span className="animate-blink">▊</span>
            </span>
          )}
          {isDone && (
            <span className="text-green-600 font-bold">COMPLETE ✓</span>
          )}
          {status === 'idle' && (
            <span className="text-ink opacity-40">WAITING</span>
          )}
        </div>
      </div>
    </div>
  )
}
