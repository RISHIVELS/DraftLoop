import type { HistoryRun } from '../../lib/types'
import { Badge } from '../ui/Badge'

interface HistoryTableProps {
  runs: HistoryRun[]
  onView: (run: HistoryRun) => void
}

const PLATFORM_LABELS: Record<string, string> = {
  twitter: 'X THREAD',
  linkedin: 'LINKEDIN',
  newsletter: 'NEWSLETTER',
}

export function HistoryTable({ runs, onView }: HistoryTableProps) {
  if (runs.length === 0) {
    return (
      <div className="border-2 border-ink rounded card-shadow bg-white p-12 text-center">
        <div className="text-4xl mb-4">📭</div>
        <div className="font-mono text-sm text-ink/50">No runs yet. Generate your first draft!</div>
      </div>
    )
  }

  return (
    <div className="border-2 border-ink rounded card-shadow bg-white overflow-hidden">
      <div className="hidden md:grid grid-cols-[2fr_1fr_2fr_1fr] border-b-2 border-ink bg-surface-dim">
        {['ORIGINAL TITLE', 'CREATED DATE', 'PLATFORMS GENERATED', 'ACTIONS'].map((h) => (
          <div key={h} className="px-6 py-4 font-mono font-bold text-xs uppercase tracking-widest text-ink">
            {h}
          </div>
        ))}
      </div>

      {runs.map((run, i) => (
        <div
          key={run.id}
          className={`border-b border-ink/20 hover:bg-cream/50 transition-colors ${i === runs.length - 1 ? 'border-b-0' : ''} md:grid md:grid-cols-[2fr_1fr_2fr_1fr]`}
        >
          <div className="px-4 py-4 md:px-6 md:py-5">
            <div className="font-mono font-bold text-sm text-ink break-words md:truncate md:max-w-xs">
              {run.title}
            </div>
            <div className="font-mono text-xs text-ink/40 mt-1">Source: Direct Input</div>
          </div>

          <div className="px-4 pb-3 md:px-6 md:py-5 font-mono text-sm text-ink/70 flex items-center">
            {new Date(run.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </div>

          <div className="px-4 pb-4 md:px-6 md:py-5 flex items-center flex-wrap gap-2">
            {run.platforms.map((p) => (
              <Badge key={p} variant={p as 'twitter' | 'linkedin' | 'newsletter'}>
                {PLATFORM_LABELS[p] ?? p.toUpperCase()}
              </Badge>
            ))}
          </div>

          <div className="px-4 pb-5 md:px-6 md:py-5 flex items-center">
            <button
              onClick={() => onView(run)}
              className="btn-press bg-yellow text-ink font-mono font-bold text-xs uppercase tracking-wide px-4 py-2 border-2 border-ink rounded flex items-center gap-1 w-full justify-center md:w-auto"
            >
              👁 VIEW
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
