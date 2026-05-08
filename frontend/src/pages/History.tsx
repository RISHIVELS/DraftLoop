import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/ui/Navbar'
import { HistoryTable } from '../components/history/HistoryTable'
import { listRuns } from '../lib/db'
import { useDraftStore } from '../store/draftStore'
import type { HistoryRun } from '../lib/types'
import { Input } from '../components/ui/Input'

export default function History() {
  const navigate = useNavigate()
  const { setThreadId, setArticle, setSnapshot, setIsHistoryView } = useDraftStore()
  const [runs, setRuns] = useState<HistoryRun[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listRuns().then((data) => {
      setRuns(data)
      setLoading(false)
    })
  }, [])

  const filtered = search.trim()
    ? runs.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
    : runs

  const handleView = (run: HistoryRun) => {
    setIsHistoryView(true)
    setThreadId(run.id)
    setArticle(run.snapshot.parsed_summary?.main_topic ?? run.title)
    setSnapshot(run.snapshot)
    navigate('/review')
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 mb-8 sm:mb-10 md:flex-row">
          <div>
            <h1 className="font-syne font-black text-3xl sm:text-4xl uppercase tracking-tight text-ink mb-2">
              HISTORY
            </h1>
            <p className="font-mono text-sm text-ink/60">
              Archive of previously generated multi-platform drafts.
            </p>
          </div>

          <div className="w-full md:w-72">
            <Input
              placeholder="Search by title or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="font-mono text-sm text-ink/40 text-center py-20">
            LOADING_HISTORY<span className="animate-blink">▊</span>
          </div>
        ) : (
          <HistoryTable runs={filtered} onView={handleView} />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-ink bg-cream mt-20">
        <div className="max-w-6xl mx-auto px-8 py-8 flex items-center justify-center">
          <span className="font-mono text-sm text-ink/60 uppercase tracking-widest">
            BUILT BY{' '}
            <span className="footer-glitch font-syne font-black text-base tracking-tight">
              RISHIVEL S
            </span>
            {' '}© 2026
          </span>
        </div>
      </footer>
    </div>
  )
}
