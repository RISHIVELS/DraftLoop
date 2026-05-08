import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { CriticBadge } from './CriticBadge'
import { Button } from '../ui/Button'
import type { DraftContent, CriticFeedback } from '../../lib/types'

interface DraftCardProps {
  platform: 'twitter' | 'linkedin' | 'newsletter'
  draft?: DraftContent
  feedback?: CriticFeedback
  approved: boolean
  regenCount: number
  readOnly?: boolean
  revisionInput: string
  previousContent?: string | null
  onRevisionInputChange: (value: string) => void
  onApprove: () => void
  onRegenerate: () => void
  onToast?: (message: string) => void
  isRegenerating?: boolean
  isApproving?: boolean
}

const PLATFORM_CONFIG = {
  twitter: {
    label: 'Twitter Thread',
    icon: '𝕏',
    headerBg: 'bg-twitter-blue',
    headerText: 'text-white',
  },
  linkedin: {
    label: 'LinkedIn',
    icon: '💼',
    headerBg: 'bg-linkedin-blue',
    headerText: 'text-white',
  },
  newsletter: {
    label: 'Newsletter',
    icon: '✉',
    headerBg: 'bg-newsletter-teal',
    headerText: 'text-white',
  },
}

const MAX_REGENS = 3
const VIEW_MODES = ['rendered', 'preview', 'diff'] as const

type ViewMode = typeof VIEW_MODES[number]
type DiffLine = {
  type: 'added' | 'removed' | 'unchanged'
  text: string
}

function splitLines(content: string): string[] {
  return content.replace(/\r\n/g, '\n').split('\n')
}

function buildLineDiff(previous: string, current: string): DiffLine[] {
  const prevLines = splitLines(previous)
  const nextLines = splitLines(current)
  const dp = Array.from({ length: prevLines.length + 1 }, () =>
    Array(nextLines.length + 1).fill(0),
  )

  for (let i = prevLines.length - 1; i >= 0; i -= 1) {
    for (let j = nextLines.length - 1; j >= 0; j -= 1) {
      dp[i][j] =
        prevLines[i] === nextLines[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const diff: DiffLine[] = []
  let i = 0
  let j = 0

  while (i < prevLines.length && j < nextLines.length) {
    if (prevLines[i] === nextLines[j]) {
      diff.push({ type: 'unchanged', text: nextLines[j] })
      i += 1
      j += 1
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      diff.push({ type: 'removed', text: prevLines[i] })
      i += 1
    } else {
      diff.push({ type: 'added', text: nextLines[j] })
      j += 1
    }
  }

  while (i < prevLines.length) {
    diff.push({ type: 'removed', text: prevLines[i] })
    i += 1
  }

  while (j < nextLines.length) {
    diff.push({ type: 'added', text: nextLines[j] })
    j += 1
  }

  return diff
}

function renderMarkdown(content: string) {
  return (
    <div className="draft-markdown whitespace-pre-wrap break-words font-mono text-sm text-ink leading-relaxed">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0 whitespace-pre-wrap">{children}</p>,
          strong: ({ children }) => <strong className="font-bold text-ink">{children}</strong>,
          em: ({ children }) => <em className="italic text-ink/80">{children}</em>,
          h1: ({ children }) => <h1 className="font-syne font-black text-lg mb-2 mt-1">{children}</h1>,
          h2: ({ children }) => <h2 className="font-syne font-bold text-base mb-2 mt-3 border-b border-ink/20 pb-1">{children}</h2>,
          h3: ({ children }) => <h3 className="font-bold text-sm mb-1 mt-2">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-sm leading-snug">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-ink/40 pl-3 my-2 text-ink/70 italic">{children}</blockquote>
          ),
          hr: () => <hr className="border-ink/20 my-3" />,
          code: ({ children }) => (
            <code className="bg-ink/5 border border-ink/10 rounded px-1 text-xs">{children}</code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

function PlatformPreview({
  platform,
  content,
}: {
  platform: DraftCardProps['platform']
  content: string
}) {
  if (platform === 'twitter') {
    const tweets = splitLines(content).filter((line) => line.trim())

    return (
      <div className="rounded border-2 border-ink bg-white p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-syne text-sm font-bold text-cream">
            DL
          </div>
          <div>
            <div className="font-syne text-sm font-bold text-ink">DraftLoop</div>
            <div className="font-mono text-xs text-ink/50">@draftloop</div>
          </div>
        </div>
        <div className="space-y-3">
          {tweets.map((tweet, index) => (
            <div key={`${tweet}-${index}`} className="rounded border border-ink/15 bg-[#f7fbff] p-3">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-twitter-blue">
                Tweet {index + 1}
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink">{tweet}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (platform === 'linkedin') {
    return (
      <div className="rounded border-2 border-ink bg-white p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-linkedin-blue font-syne text-sm font-bold text-white">
            in
          </div>
          <div>
            <div className="font-syne text-sm font-bold text-ink">DraftLoop Team</div>
            <div className="font-mono text-xs text-ink/50">Agent-assisted workflow design</div>
          </div>
        </div>
        <div className="text-sm leading-7 text-ink">{renderMarkdown(content)}</div>
      </div>
    )
  }

  return (
    <div className="rounded border-2 border-ink bg-white">
      <div className="border-b-2 border-ink bg-newsletter-teal px-4 py-3 text-white">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/75">Inbox Preview</div>
        <div className="font-syne text-lg font-bold">DraftLoop Weekly</div>
      </div>
      <div className="p-4">
        <div className="mb-4 rounded border border-ink/15 bg-cream px-3 py-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">Subject</div>
          <div className="font-syne text-base font-bold text-ink">Your newsletter digest is ready</div>
        </div>
        <div className="text-sm leading-7 text-ink">{renderMarkdown(content)}</div>
      </div>
    </div>
  )
}

export function DraftCard({
  platform,
  draft,
  feedback,
  approved,
  regenCount,
  readOnly = false,
  revisionInput,
  previousContent,
  onRevisionInputChange,
  onApprove,
  onRegenerate,
  onToast,
  isRegenerating = false,
  isApproving = false,
}: DraftCardProps) {
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('rendered')
  const config = PLATFORM_CONFIG[platform]
  const canRegen = regenCount < MAX_REGENS && !approved && !readOnly
  const currentContent = draft?.content ?? ''
  const hasDiff =
    !!previousContent &&
    !!currentContent &&
    previousContent !== currentContent
  const diffLines = hasDiff ? buildLineDiff(previousContent, currentContent) : []

  const handleCopy = () => {
    if (draft?.content) {
      navigator.clipboard.writeText(draft.content)
      setCopied(true)
      onToast?.(`${config.label} copied to clipboard.`)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className={`border-2 border-ink rounded card-shadow bg-white flex flex-col overflow-hidden ${approved ? 'outline outline-2 outline-green-500 outline-offset-2' : ''}`}>
      {/* Platform header */}
      <div className={`${config.headerBg} border-b-2 border-ink px-4 py-2.5 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className={`${config.headerText} font-syne font-bold text-sm uppercase tracking-wide`}>
            {config.icon} {config.label}
          </span>
          {approved && (
            <span className="bg-green-400 text-white font-mono text-xs font-bold uppercase px-2 py-0.5 rounded border border-white/60">
              APPROVED ✓
            </span>
          )}
        </div>
        {feedback && <CriticBadge score={feedback.score} />}
      </div>

      {/* Draft content — tall scrollable area with markdown rendering */}
      <div className="h-80 md:h-96 overflow-y-auto p-4 md:p-5 scanline-bg">
        {isRegenerating ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-orange-500 font-bold font-mono text-sm animate-blink mb-2">
                REGENERATING▊
              </div>
              <div className="text-ink/40 font-mono text-xs">Agent is rewriting...</div>
            </div>
          </div>
        ) : draft ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {VIEW_MODES.map((mode) => {
                if (mode === 'diff' && !hasDiff) return null

                const isActive = viewMode === mode
                const label = mode === 'rendered' ? 'Editorial' : mode === 'preview' ? 'Preview' : 'Live Diff'

                return (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`rounded border px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wide ${
                      isActive ? 'border-ink bg-yellow text-ink' : 'border-ink/20 bg-white text-ink/55'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {viewMode === 'preview' ? (
              <PlatformPreview platform={platform} content={draft.content} />
            ) : viewMode === 'diff' && hasDiff ? (
              <div className="rounded border-2 border-ink bg-white">
                <div className="border-b border-ink/15 bg-surface-dim px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wide text-ink/65">
                  Last regenerate changes
                </div>
                <div className="space-y-1 p-3">
                  {diffLines.map((line, index) => (
                    <div
                      key={`${line.type}-${index}-${line.text}`}
                      className={`rounded px-2 py-1.5 font-mono text-xs leading-relaxed ${
                        line.type === 'added'
                          ? 'bg-green-100 text-green-900'
                          : line.type === 'removed'
                            ? 'bg-red-100 text-red-800 line-through'
                            : 'bg-white text-ink/70'
                      }`}
                    >
                      <span className="mr-2 inline-block w-4 font-bold">
                        {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                      </span>
                      <span className="whitespace-pre-wrap">{line.text || ' '}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              renderMarkdown(draft.content)
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="text-ink/30 font-mono text-sm">AWAITING GENERATION...</span>
          </div>
        )}
      </div>

      {/* Critic suggestion */}
      {feedback && !isRegenerating && (
        <div className="border-t border-ink/20 px-5 py-2.5 bg-surface-dim/50 flex items-start gap-2">
          <span className="text-ink/40 mt-0.5 flex-shrink-0">💬</span>
          <span className="text-xs font-mono text-ink/65 leading-snug">{feedback.suggestion}</span>
        </div>
      )}

      {/* Revision input */}
      <div className="border-t border-ink/20 bg-white px-4 py-3">
        <div className="mb-2 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink/60">
              Regeneration Prompt
            </div>
            <div className="font-mono text-[11px] text-ink/45">
              Edit the critic note or add a sharper rewrite instruction.
            </div>
          </div>
          {hasDiff && (
            <button
              onClick={() => setViewMode('diff')}
              className="rounded border border-ink/20 bg-surface-dim px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-ink/65"
            >
              View latest diff
            </button>
          )}
        </div>
        <textarea
          value={revisionInput}
          onChange={(e) => onRevisionInputChange(e.target.value)}
          disabled={approved || isRegenerating || readOnly}
          placeholder="Example: Make the hook more contrarian and trim the middle section."
          className="min-h-[88px] w-full resize-none rounded border-2 border-ink bg-cream px-3 py-2 font-mono text-xs text-ink placeholder:text-ink/35 focus:outline-none disabled:opacity-50"
        />
        {regenCount >= MAX_REGENS && !approved && !readOnly && (
          <div className="mt-2 rounded border border-red-300 bg-red-50 px-3 py-2 font-mono text-[11px] leading-relaxed text-red-700">
            Regeneration limit reached for this platform. Approve this version or start a new run for more iterations.
          </div>
        )}
        {readOnly && (
          <div className="mt-2 rounded border border-ink/15 bg-surface-dim/35 px-3 py-2 font-mono text-[11px] leading-relaxed text-ink/55">
            Saved history view. Regeneration controls are disabled here.
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t-2 border-ink px-4 py-3 flex flex-col items-stretch justify-between gap-3 bg-white sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRegenerate}
            disabled={!canRegen || isRegenerating || isApproving || !draft}
            className="flex-1 sm:flex-none"
          >
            {regenCount >= MAX_REGENS && !approved ? 'Limit Reached' : isRegenerating ? 'Regenerating...' : '↺ Regenerate'}
          </Button>
          {regenCount > 0 && (
            <span className="text-xs font-mono text-ink/40">
              {regenCount}/{MAX_REGENS}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {draft && !isRegenerating && (
            <button
              onClick={handleCopy}
              className="text-xs font-mono text-ink/50 hover:text-ink uppercase tracking-wide border border-ink/20 rounded px-2 py-1 transition-colors"
            >
            {copied ? 'COPIED!' : '⎘ COPY'}
          </button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={onApprove}
            disabled={approved || isRegenerating || isApproving || !draft || readOnly}
            className="flex-1 sm:flex-none"
          >
            {approved ? '✓ Approved' : isApproving ? 'Approving...' : '✓ Approve'}
          </Button>
        </div>
      </div>
    </div>
  )
}
