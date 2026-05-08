import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/ui/Navbar'
import { AgentStatusPanel } from '../components/draft/AgentStatusPanel'
import { Button } from '../components/ui/Button'
import { useDraftStore } from '../store/draftStore'
import { useSSE } from '../hooks/useSSE'
import { generateDrafts } from '../lib/api'

const PLACEHOLDER = `Paste your article here...

Example:
"The future of artificial intelligence lies not in creating autonomous deities, but in building high-leverage tools for specific human workflows. The companies winning in AI are not those building AGI — they're building precise, domain-specific agents that slot into existing workflows and multiply human output by 10x..."`

export default function DraftApp() {
  const navigate = useNavigate()
  const { article, setArticle, threadId, setThreadId, setError, error, reset, setIsHistoryView } = useDraftStore()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleComplete = () => {
    navigate('/review')
  }

  useSSE(threadId, 0, handleComplete)

  const handleGenerate = async () => {
    if (!article.trim()) return
    reset()
    setIsHistoryView(false)
    setIsGenerating(true)

    try {
      const res = await generateDrafts(article)
      setThreadId(res.thread_id)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start generation')
      setIsGenerating(false)
    }
  }

  const hasThread = !!threadId

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-syne font-black text-3xl sm:text-4xl uppercase tracking-tight text-ink mb-2">
            DRAFT ENGINE
          </h1>
          <p className="font-mono text-sm text-ink/60">
            Paste your article. Hit generate. Watch the agents work.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Input area — takes 2 cols */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="border-2 border-ink rounded card-shadow bg-white overflow-hidden flex flex-col">
              <div className="border-b-2 border-ink px-4 py-2 bg-surface-dim flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink">
                  // RAW INPUT
                </span>
                <span className="text-xs font-mono text-ink/50">
                  {article.length > 0 ? `${article.length} chars` : 'AWAITING_INPUT'}
                </span>
              </div>

              <textarea
                value={article}
                onChange={(e) => setArticle(e.target.value)}
                placeholder={PLACEHOLDER}
                disabled={isGenerating}
                className="flex-1 min-h-[18rem] md:min-h-80 font-mono text-sm text-ink bg-transparent p-4 sm:p-5 resize-none focus:outline-none placeholder:text-ink/30 disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="border-2 border-red-500 rounded bg-red-50 px-4 py-3 font-mono text-sm text-red-700">
                ERROR: {error}
              </div>
            )}

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating || !article.trim()}
                className="w-full sm:flex-1 md:flex-none"
              >
                {isGenerating ? 'GENERATING...' : 'GENERATE DRAFTS →'}
              </Button>

              {hasThread && (
                <Button variant="ghost" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/review')}>
                  VIEW REVIEW →
                </Button>
              )}
            </div>
          </div>

          {/* Agent status panel — 1 col */}
          <div className="flex flex-col gap-4">
            <AgentStatusPanel />

            {/* Info card */}
            <div className="border-2 border-ink rounded bg-yellow p-4">
              <div className="font-mono font-bold text-xs uppercase tracking-widest text-ink/70 mb-2">
                PIPELINE
              </div>
              <div className="space-y-1">
                {['① Parser analyzes article', '② 3 agents run in parallel', '③ Critic scores all drafts', '④ You approve or regenerate'].map((step) => (
                  <div key={step} className="font-mono text-xs text-ink">{step}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
