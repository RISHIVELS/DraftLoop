import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="border-b-2 border-ink bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-28">
        {/* Terminal header bar */}
        <div className="border-2 border-ink rounded card-shadow bg-white overflow-hidden">
          <div className="border-b-2 border-ink px-4 py-2 flex items-center justify-between bg-surface-dim">
            <span className="text-xs font-mono text-ink/60 uppercase tracking-widest">SYS_INIT</span>
            <span className="text-xs font-mono text-ink/60 uppercase tracking-widest">LOG</span>
          </div>

          <div className="px-4 py-10 text-center sm:px-6 sm:py-12 md:px-8 md:py-16">
            <h1 className="font-syne font-black text-3xl sm:text-4xl md:text-7xl leading-none uppercase tracking-tight text-ink mb-2">
              ONE ARTICLE.
            </h1>
            <h1 className="font-syne font-black text-3xl sm:text-4xl md:text-7xl leading-none uppercase tracking-tight text-ink mb-2">
              THREE CHANNELS.
            </h1>
            <div className="inline-block bg-yellow border-2 border-ink px-3 py-1 mb-6 sm:px-4 sm:mb-8 card-shadow">
              <h1 className="font-syne font-black text-3xl sm:text-4xl md:text-7xl leading-none uppercase tracking-tight text-ink">
                60 SECONDS.
              </h1>
            </div>

            <p className="font-mono text-sm sm:text-base md:text-lg text-ink/70 max-w-xl mx-auto leading-relaxed mb-8 sm:mb-10">
              Automatically repurpose your long-form content into platform-ready
              threads, posts, and newsletters. Built for speed, precision, and
              heavy lifting.
            </p>

            <Link to="/app">
              <button className="btn-press bg-yellow text-ink font-mono font-bold text-sm sm:text-base uppercase tracking-wide px-6 sm:px-10 py-3 sm:py-4 border-2 border-ink rounded inline-flex items-center gap-2">
                Get Started →
              </button>
            </Link>
          </div>

          <div className="border-t-2 border-ink px-4 py-2 flex items-center justify-between bg-surface-dim">
            <span className="text-xs font-mono text-ink/60 uppercase tracking-widest">◦ AWAITING_INPUT</span>
          </div>
        </div>
      </div>
    </section>
  )
}
