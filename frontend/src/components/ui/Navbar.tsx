import { Link } from 'react-router-dom'
import logo from '../../assets/logo.svg'

export function Navbar() {

  const navLinks = [
    { href: '/#how-it-works', label: 'How it Works' },
    { href: '/#platforms', label: 'Platforms' },
    { href: '/history', label: 'History' },
  ]

  return (
    <nav className="border-b-2 border-ink bg-cream sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 min-h-14 py-2 flex items-center justify-between gap-3">
        <Link to="/">
          <img src={logo} alt="DraftLoop" className="h-9 sm:h-10 md:h-12 w-auto" style={{ filter: 'brightness(0)' }} />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-mono text-ink/70 hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Link to="/app">
          <button className="btn-press bg-yellow text-ink font-mono font-bold text-[11px] sm:text-sm uppercase tracking-wide px-3 sm:px-4 py-2 border-2 border-ink rounded whitespace-nowrap">
            Launch App
          </button>
        </Link>
      </div>
    </nav>
  )
}
