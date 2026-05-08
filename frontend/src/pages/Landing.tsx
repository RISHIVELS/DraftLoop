import { Navbar } from '../components/ui/Navbar'
import { Hero } from '../components/landing/Hero'
import { PlatformBadgesRow } from '../components/landing/PlatformBadgesRow'
import { HowItWorks } from '../components/landing/HowItWorks'
import { DemoSection } from '../components/landing/DemoSection'

export default function Landing() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Hero />
      <PlatformBadgesRow />
      <HowItWorks />
      <DemoSection />

      {/* Footer */}
      <footer className="border-t-2 border-ink bg-cream">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 md:px-8 flex items-center justify-center text-center">
          <span className="font-mono text-xs sm:text-sm text-ink/60 uppercase tracking-widest">
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
