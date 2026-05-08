export function DemoSection() {
  const sampleInput = `"The future of artificial intelligence lies not in creating autonomous deities, but in building high-leverage tools for specific human workflows..."`;

  const sampleOutput = [
    "Stop thinking about AI as an autonomous deity.",
    "The real alpha? High-leverage tools for specific workflows.",
    "Here's how we are building agents that actually work: 🛠",
  ];

  return (
    <section className="border-b-2 border-ink bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 sm:py-18 md:px-8 md:py-20">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Demo interface */}
          <div className="border-2 border-ink rounded card-shadow bg-white overflow-hidden">
            <div className="border-b-2 border-ink px-4 py-2 bg-surface-dim flex justify-end">
              <span className="text-xs font-mono text-ink/60 uppercase tracking-widest">
                DEMO_INTERFACE
              </span>
            </div>
            <div className="p-4 sm:p-6">
              <h2 className="font-syne font-bold text-lg sm:text-xl leading-tight text-ink mb-5 sm:mb-6">
                A drafting experience built
                <br />
                for terminal velocity.
              </h2>

              <div className="border-2 border-ink rounded bg-cream/50 p-4">
                <div className="text-xs font-mono text-ink/50 mb-2">
                  // RAW INPUT
                </div>
                <p className="font-mono text-sm text-ink/80 leading-relaxed">
                  {sampleInput}
                </p>

                <div className="border-t-2 border-dashed border-ink/30 my-4" />

                <div className="text-xs font-mono text-ink/50 mb-2">
                  // THREAD OUTPUT (1/5)
                </div>
                {sampleOutput.map((line, i) => (
                  <p
                    key={i}
                    className="font-mono text-sm text-ink leading-relaxed"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-6">
            <div className="border-2 border-ink rounded card-shadow bg-yellow p-6 sm:p-8 flex flex-col items-center justify-center flex-1">
              <div className="font-syne font-black text-4xl sm:text-5xl md:text-6xl text-ink mb-1">
                10X
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm uppercase tracking-widest text-ink/70 text-center">
                CONTENT VELOCITY
              </div>
            </div>

            <div className="border-2 border-ink rounded card-shadow bg-white p-5 sm:p-6 flex items-center gap-4">
              <span className="text-2xl">⚡</span>
              <div className="font-mono font-bold text-xs sm:text-sm uppercase tracking-wider text-ink">
                NO CONTEXT SWITCHING
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
