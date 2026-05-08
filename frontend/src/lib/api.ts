import type { StateSnapshot } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`${res.status}: ${err}`)
  }
  return res.json()
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`)
  return res.json()
}

export interface GenerateResponse {
  thread_id: string
  status: string
}

export function generateDrafts(article: string): Promise<GenerateResponse> {
  return post('/api/generate', { article })
}

export function approveDrafts(
  thread_id: string,
  approvals: Record<string, boolean>
): Promise<{ status: string }> {
  return post('/api/approve', { thread_id, approvals })
}

export function regenerateDrafts(
  thread_id: string,
  platforms: string[],
  instructions?: Record<string, string>
): Promise<{ status: string }> {
  return post('/api/regenerate', { thread_id, platforms, instructions })
}

export function getRun(thread_id: string): Promise<StateSnapshot> {
  return get(`/api/runs/${thread_id}`)
}

export function getStatusUrl(thread_id: string): string {
  return `${API_URL}/api/status/${thread_id}`
}
