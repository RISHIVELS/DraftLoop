import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/ui/Navbar'
import { DraftCard } from '../components/review/DraftCard'
import { ExportPack } from '../components/review/ExportPack'
import { useDraftStore } from '../store/draftStore'
import { useSSE } from '../hooks/useSSE'
import { approveDrafts, regenerateDrafts } from '../lib/api'
import { saveRun } from '../lib/db'
import type { Platform, StateSnapshot } from '../lib/types'

const PLATFORMS: Platform[] = ['twitter', 'linkedin', 'newsletter']

const EMPTY_NOTES: Record<Platform, string> = {
  twitter: '',
  linkedin: '',
  newsletter: '',
}

export default function Review() {
  const navigate = useNavigate()
  const { threadId, snapshot, article, setSnapshot, setAgentStatus, setError, approveLocal, error, isHistoryView } = useDraftStore()
  const [regeneratingPlatforms, setRegeneratingPlatforms] = useState<Set<Platform>>(new Set())
  const [approvingPlatforms, setApprovingPlatforms] = useState<Set<Platform>>(new Set())
  const [revisionInputs, setRevisionInputs] = useState<Record<Platform, string>>(EMPTY_NOTES)
  const [previousDrafts, setPreviousDrafts] = useState<Record<Platform, string | null>>({
    twitter: null,
    linkedin: null,
    newsletter: null,
  })
  const [toast, setToast] = useState<string | null>(null)
  // Increment to force SSE reconnection after approve/regenerate
  const [sseKey, setSseKey] = useState(1)

  useSSE(isHistoryView ? null : threadId, sseKey, (snap) => {
    setSnapshot(snap)
    setRegeneratingPlatforms(new Set())
  })

  useEffect(() => {
    if (!snapshot) return

    setRevisionInputs((current) => {
      const next = { ...current }
      let changed = false

      for (const platform of PLATFORMS) {
        const revisionRequest = snapshot[`${platform}_revision_request`]
        const feedbackSuggestion = snapshot[`${platform}_feedback`]?.suggestion ?? ''
        const preferredValue = revisionRequest || feedbackSuggestion

        if (!current[platform] && preferredValue) {
          next[platform] = preferredValue
          changed = true
        }
      }

      return changed ? next : current
    })
  }, [snapshot])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const handleApprove = async (platform: Platform) => {
    if (!threadId || !snapshot) return
    setApprovingPlatforms((prev) => new Set([...prev, platform]))
    approveLocal(platform)

    const approvals: Record<string, boolean> = {
      twitter: snapshot.twitter_approved || platform === 'twitter',
      linkedin: snapshot.linkedin_approved || platform === 'linkedin',
      newsletter: snapshot.newsletter_approved || platform === 'newsletter',
    }

    try {
      await approveDrafts(threadId, approvals)

      const allApproved = Object.values(approvals).every(Boolean)
      if (allApproved) {
        const updatedSnap: StateSnapshot = { ...snapshot, [`${platform}_approved`]: true }
        await saveRun({
          id: threadId,
          title: snapshot?.parsed_summary?.main_topic || article.slice(0, 80) || 'Untitled',
          createdAt: Date.now(),
          platforms: PLATFORMS,
          snapshot: updatedSnap,
        })
        setToast('All drafts approved and saved to history.')
      } else {
        setToast(`${formatPlatform(platform)} approved.`)
        // Resume graph (routing will go to END since no regens flagged)
        setSseKey((k) => k + 1)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to approve draft')
    } finally {
      setApprovingPlatforms((prev) => {
        const next = new Set(prev)
        next.delete(platform)
        return next
      })
    }
  }

  const handleRegenerate = async (platform: Platform) => {
    if (!threadId || !snapshot) return

    const currentDraft = snapshot[`${platform}_draft`]?.content ?? null
    const instruction = revisionInputs[platform].trim()

    setPreviousDrafts((prev) => ({
      ...prev,
      [platform]: currentDraft,
    }))
    setRegeneratingPlatforms((prev) => new Set([...prev, platform]))
    // Reset the platform's agent status so loading animation replays
    setAgentStatus(platform, 'idle')
    setAgentStatus('critic', 'idle')
    try {
      await regenerateDrafts(threadId, [platform], { [platform]: instruction })
      setToast(`${formatPlatform(platform)} is regenerating with your guidance.`)
      // Reconnect SSE — this resumes the graph from checkpoint with regen flags set
      setSseKey((k) => k + 1)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to regenerate draft')
      setRegeneratingPlatforms((prev) => {
        const next = new Set(prev)
        next.delete(platform)
        return next
      })
    }
  }

  const handleRevisionInputChange = (platform: Platform, value: string) => {
    setRevisionInputs((current) => ({
      ...current,
      [platform]: value,
    }))
  }

  if (!threadId) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="max-w-6xl mx-auto px-8 py-20 text-center">
          <div className="font-mono text-ink/50 mb-4">No active session found.</div>
          <button
            onClick={() => navigate('/app')}
            className="btn-press bg-yellow text-ink font-mono font-bold uppercase px-6 py-3 border-2 border-ink rounded"
          >
            ← Start New Draft
          </button>
        </div>
      </div>
    )
  }

  const allApproved =
    snapshot?.twitter_approved &&
    snapshot?.linkedin_approved &&
    snapshot?.newsletter_approved

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="w-full px-4 py-8 max-w-[1600px] mx-auto sm:px-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 mb-8 border-b-2 border-ink pb-6 lg:flex-row lg:items-center">
          <div>
            <h1 className="font-syne font-black text-2xl sm:text-3xl uppercase tracking-tight text-ink mb-1">
              Review Outputs
            </h1>
            <p className="font-mono text-sm text-ink/60">
              {isHistoryView
                ? 'Viewing a saved run from local history.'
                : 'Agentic drafting complete. 3 artifacts ready for approval.'}
            </p>
          </div>
          <div className={`border-2 border-ink rounded px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide flex items-center gap-2 ${
            isHistoryView
              ? 'bg-white text-ink'
              : allApproved
                ? 'bg-green-400 text-white border-green-600'
                : 'bg-surface-dim text-ink'
          }`}>
            <span className={isHistoryView || allApproved ? '' : 'animate-blink'}>◉</span>
            {isHistoryView ? 'HISTORY SNAPSHOT' : allApproved ? 'ALL APPROVED' : 'STATUS: AWAITING APPROVAL'}
          </div>
        </div>

        {isHistoryView && (
          <div className="mb-6 rounded border-2 border-ink bg-white px-4 py-3 font-mono text-sm text-ink/70">
            This view is read-only. Open the app and generate a new run if you want to regenerate or approve drafts.
          </div>
        )}

        {error && (
          <div className="border-2 border-red-500 rounded bg-red-50 px-4 py-3 font-mono text-sm text-red-700 mb-6">
            ERROR: {error}
          </div>
        )}

        {allApproved && snapshot && (
          <ExportPack snapshot={snapshot} isHistoryView={isHistoryView} onToast={setToast} />
        )}

        {/* 3 draft cards — equal width, equal height */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
          {PLATFORMS.map((platform) => {
            const draft = snapshot?.[`${platform}_draft`]
            const feedback = snapshot?.[`${platform}_feedback`]
            const approved = snapshot?.[`${platform}_approved`] ?? false
            const regenCount = snapshot?.[`${platform}_regen_count`] ?? 0

            return (
              <DraftCard
                key={platform}
                platform={platform}
                draft={draft}
                feedback={feedback}
                approved={approved}
                regenCount={regenCount}
                isRegenerating={regeneratingPlatforms.has(platform)}
                isApproving={approvingPlatforms.has(platform)}
                readOnly={isHistoryView}
                revisionInput={revisionInputs[platform]}
                previousContent={previousDrafts[platform]}
                onToast={setToast}
                onRevisionInputChange={(value) => handleRevisionInputChange(platform, value)}
                onApprove={() => handleApprove(platform)}
                onRegenerate={() => handleRegenerate(platform)}
              />
            )
          })}
        </div>

        {allApproved && (
          <div className="border-2 border-green-500 rounded card-shadow bg-green-50 px-4 py-4 flex flex-col items-start justify-between gap-4 sm:px-6 sm:flex-row sm:items-center">
            <div>
              <div className="font-syne font-bold text-lg text-green-800 mb-1">All drafts approved!</div>
              <div className="font-mono text-sm text-green-700">Run saved to your local history.</div>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="btn-press bg-yellow text-ink font-mono font-bold uppercase text-sm px-6 py-3 border-2 border-ink rounded"
            >
              VIEW HISTORY →
            </button>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)] rounded border-2 border-ink bg-yellow px-4 py-3 font-mono text-sm text-ink card-shadow">
          {toast}
        </div>
      )}
    </div>
  )
}

function formatPlatform(platform: Platform): string {
  switch (platform) {
    case 'twitter':
      return 'Twitter / X draft'
    case 'linkedin':
      return 'LinkedIn draft'
    case 'newsletter':
      return 'Newsletter draft'
  }
}
