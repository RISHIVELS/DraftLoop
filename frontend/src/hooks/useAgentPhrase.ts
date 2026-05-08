import { useState, useEffect, useRef } from 'react'

const PHRASES: Record<string, string[]> = {
  parser: ['READING...', 'EXTRACTING...', 'DISSECTING...', 'MAPPING STRUCTURE...', 'SUMMARIZING...'],
  twitter: ['COOKING...', 'HOOKING...', 'THREADING...', 'PUNCHING UP...', 'GOING VIRAL...'],
  linkedin: ['SCRIPTING...', 'PROFESSIONALIZING...', 'THOUGHT LEADERING...', 'NETWORKING...', 'OPTIMIZING...'],
  newsletter: ['BREWING...', 'DRAFTING...', 'DISTILLING...', 'PACKAGING...', 'SEALING ENVELOPE...'],
  critic: ['JUDGING...', 'SCRUTINIZING...', 'GRADING...', 'NITPICKING...', 'SCORING...'],
}

export function useAgentPhrase(agent: string, isRunning: boolean): string {
  const phrases = PHRASES[agent] ?? ['PROCESSING...']
  const [index, setIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setIndex(0)
      return
    }

    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length)
    }, 800)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, phrases.length])

  return phrases[index]
}
