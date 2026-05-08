const steps = [
  {
    num: '1',
    icon: '📋',
    title: 'PASTE ARTICLE',
    desc: 'Drop your raw, unedited markdown or plain text into the engine. No formatting required.',
    tag: 'INPUT_REQ',
  },
  {
    num: '2',
    icon: '⚙',
    title: 'AI AGENTS WORK',
    desc: 'Our specialized agents dissect, summarize, and restructure the narrative for specific platform algorithms.',
    tag: 'PROCESSING...',
  },
  {
    num: '3',
    icon: '▶',
    title: 'REVIEW & EXPORT',
    desc: 'Approve the drafts in our side-by-side editor. Hit export to copy directly to your clipboard.',
    tag: 'OUTPUT_RDY',
  },
]

const workflowMoments = [
  {
    label: 'Input Locked',
    detail: 'Article enters the graph and gets normalized into shared state.',
    accent: 'bg-yellow',
    delay: '0ms',
  },
  {
    label: 'Parser Fires',
    detail: 'Topic, tone, and key points are extracted before any channel draft begins.',
    accent: 'bg-white',
    delay: '700ms',
  },
  {
    label: 'Agents Fan Out',
    detail: 'Twitter, LinkedIn, and Newsletter specialists run in parallel at full speed.',
    accent: 'bg-twitter-blue',
    delay: '1400ms',
  },
  {
    label: 'Critic Scores',
    detail: 'A separate reviewer grades fit, clarity, and improvement opportunities.',
    accent: 'bg-linkedin-blue',
    delay: '2100ms',
  },
  {
    label: 'Human Approves',
    detail: 'You export the winners or send one draft back for a sharper second pass.',
    accent: 'bg-newsletter-teal',
    delay: '2800ms',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b-2 border-ink bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-8 sm:py-20">
        <div className="flex items-center gap-3 mb-10 sm:mb-12">
          <div className="w-8 h-8 border-2 border-ink rounded flex items-center justify-center text-sm">⚙</div>
          <h2 className="font-syne font-black text-2xl sm:text-3xl uppercase tracking-tight text-ink">
            PIPELINE ARCHITECTURE
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="border-2 border-ink rounded card-shadow bg-white p-6 relative">
              {/* Number badge */}
              <div className="absolute -top-3 -right-3 w-7 h-7 bg-yellow border-2 border-ink rounded flex items-center justify-center font-syne font-black text-sm">
                {step.num}
              </div>

              <div className="text-2xl mb-4">{step.icon}</div>
              <h3 className="font-syne font-bold text-lg uppercase tracking-wide text-ink mb-3">
                {step.title}
              </h3>
              <p className="font-mono text-sm text-ink/70 leading-relaxed mb-6">
                {step.desc}
              </p>

              <div className="border-t-2 border-ink border-dashed pt-3">
                <span className="text-xs font-mono font-bold bg-surface-dim border border-ink/30 rounded px-2 py-0.5 text-ink/60">
                  {step.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 border-2 border-ink rounded card-shadow-lg bg-ink text-cream overflow-hidden">
          <div className="border-b-2 border-cream/20 px-4 py-3 flex flex-col items-start justify-between gap-3 sm:px-5 md:flex-row md:items-center md:gap-4">
            <div>
              <div className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight">
                Workflow Simulation
              </div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-cream/60">
                Live feel of a single run moving through the system
              </div>
            </div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-yellow animate-blink">
              RUNNING NOW
            </div>
          </div>

          <div className="relative px-4 py-5 sm:px-5 sm:py-6 md:px-6">
            <div className="workflow-scan absolute left-0 top-0 h-full w-full" />
            <div className="relative mb-5 h-2 rounded-full border border-cream/25 bg-white/10 overflow-hidden">
              <div className="workflow-signal h-full w-1/3 bg-yellow" />
            </div>

            <div className="workflow-mobile-rail grid gap-4 md:grid-cols-5">
              {workflowMoments.map((moment) => (
                <div
                  key={moment.label}
                  className="workflow-card workflow-mobile-card rounded border-2 border-cream/30 bg-white/10 p-4 backdrop-blur-sm"
                  style={{ animationDelay: moment.delay }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full border border-ink ${moment.accent}`} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/65">
                      ACTIVE STEP
                    </span>
                  </div>
                  <h3 className="font-syne text-lg font-bold uppercase tracking-wide text-cream mb-2">
                    {moment.label}
                  </h3>
                  <p className="font-mono text-xs leading-relaxed text-cream/70">
                    {moment.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
