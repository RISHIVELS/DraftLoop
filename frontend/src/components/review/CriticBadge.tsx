interface CriticBadgeProps {
  score: number
}

export function CriticBadge({ score }: CriticBadgeProps) {
  const color =
    score >= 8
      ? 'bg-yellow border-ink text-ink'
      : score >= 6
      ? 'bg-white border-ink text-ink'
      : 'bg-red-100 border-red-500 text-red-700'

  return (
    <div className={`border-2 rounded px-2 py-1 flex items-center gap-1 ${color}`}>
      <span className="text-xs font-mono font-bold uppercase tracking-wide">Critic Score:</span>
      <span className="text-sm font-mono font-black">{score}/10</span>
    </div>
  )
}
