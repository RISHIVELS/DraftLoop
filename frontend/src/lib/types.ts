export interface ParsedSummary {
  main_topic: string
  tone: string
  key_points: string[]
}

export interface DraftContent {
  content: string
  platform: string
}

export interface CriticFeedback {
  score: number
  suggestion: string
}

export type Platform = 'twitter' | 'linkedin' | 'newsletter'

export interface DraftResult {
  platform: string
  content: string
  score: number
  suggestion: string
  approved: boolean
  regen_count: number
}

export interface StateSnapshot {
  thread_id: string
  parsed_summary?: ParsedSummary
  twitter_draft?: DraftContent
  linkedin_draft?: DraftContent
  newsletter_draft?: DraftContent
  twitter_feedback?: CriticFeedback
  linkedin_feedback?: CriticFeedback
  newsletter_feedback?: CriticFeedback
  twitter_revision_request: string
  linkedin_revision_request: string
  newsletter_revision_request: string
  twitter_approved: boolean
  linkedin_approved: boolean
  newsletter_approved: boolean
  twitter_regen_count: number
  linkedin_regen_count: number
  newsletter_regen_count: number
}

export interface HistoryRun {
  id: string          // thread_id
  title: string       // first 80 chars of article
  createdAt: number   // Date.now()
  platforms: string[]
  snapshot: StateSnapshot
}

export type AgentName = 'parser' | Platform | 'critic'
export type AgentStatus = 'idle' | 'running' | 'done'
