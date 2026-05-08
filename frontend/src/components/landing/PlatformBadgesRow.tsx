export function PlatformBadgesRow() {
  const platforms = [
    { label: 'Twitter/X Threads', color: 'bg-twitter-blue', icon: '𝕏' },
    { label: 'LinkedIn Posts', color: 'bg-linkedin-blue', icon: '💼' },
    { label: 'Newsletters', color: 'bg-newsletter-teal', icon: '✉' },
  ]

  return (
    <section id="platforms" className="border-b-2 border-ink bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 sm:py-10 md:px-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {platforms.map((p) => (
          <div
            key={p.label}
            className={`${p.color} text-white font-mono font-bold text-xs sm:text-sm uppercase tracking-wider px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-ink rounded flex items-center gap-2 text-center`}
          >
            <span>{p.icon}</span>
            {p.label}
          </div>
        ))}
      </div>
    </section>
  )
}
