import { useState } from 'react'
import { Button } from '../ui/Button'
import { buildExportContent, downloadExport, type ExportFormat } from '../../lib/exportPack'
import type { StateSnapshot } from '../../lib/types'

interface ExportPackProps {
  snapshot: StateSnapshot
  isHistoryView: boolean
  onToast?: (message: string) => void
}

const EXPORT_OPTIONS: Array<{
  format: ExportFormat
  label: string
  detail: string
  action: 'download' | 'copy'
}> = [
  {
    format: 'markdown',
    label: 'Markdown Pack',
    detail: 'Download a polished markdown bundle with summary, scores, and all approved drafts.',
    action: 'download',
  },
  {
    format: 'notion',
    label: 'Notion-Ready',
    detail: 'Download a clean markdown file that pastes neatly into Notion sections.',
    action: 'download',
  },
  {
    format: 'copy-bundle',
    label: 'Copy Bundle',
    detail: 'Copy all three drafts into one clipboard-friendly block for fast posting.',
    action: 'copy',
  },
  {
    format: 'social-kit',
    label: 'Social Posting Kit',
    detail: 'Download a practical posting pack with sequence notes and critic reminders.',
    action: 'download',
  },
]

export function ExportPack({ snapshot, isHistoryView, onToast }: ExportPackProps) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat | null>(null)
  const [copySuccess, setCopySuccess] = useState<ExportFormat | null>(null)

  const handleExport = async (format: ExportFormat, action: 'download' | 'copy') => {
    setActiveFormat(format)

    try {
      if (action === 'copy') {
        await navigator.clipboard.writeText(buildExportContent(snapshot, format))
        setCopySuccess(format)
        onToast?.('Copy bundle added to clipboard.')
        window.setTimeout(() => setCopySuccess(null), 1500)
      } else {
        downloadExport(snapshot, format)
        onToast?.(`${optionLabel(format)} downloaded.`)
      }
    } finally {
      setActiveFormat(null)
    }
  }

  return (
    <div className="mb-8 rounded border-2 border-ink bg-white card-shadow overflow-hidden">
      <div className="border-b-2 border-ink bg-yellow px-4 py-4 md:px-5 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center md:gap-4">
        <div>
          <div className="font-syne text-xl md:text-2xl font-black uppercase tracking-tight text-ink">
            Export Pack
          </div>
          <div className="font-mono text-xs text-ink/70">
            One-click handoff for your approved multi-channel draft set.
          </div>
        </div>
        <div className="rounded border-2 border-ink bg-white px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wide text-ink/70">
          {isHistoryView ? 'READY FROM HISTORY' : 'READY TO SHIP'}
        </div>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-2 md:p-5">
        {EXPORT_OPTIONS.map((option) => {
          const isCopySuccess = copySuccess === option.format
          const isBusy = activeFormat === option.format

          return (
            <div key={option.format} className="rounded border-2 border-ink bg-cream p-4">
              <div className="mb-2 font-syne text-lg font-bold text-ink">{option.label}</div>
              <div className="mb-4 font-mono text-xs leading-relaxed text-ink/65">
                {option.detail}
              </div>
              <Button
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => handleExport(option.format, option.action)}
                disabled={isBusy}
              >
                {isBusy
                  ? option.action === 'copy'
                    ? 'COPYING...'
                    : 'EXPORTING...'
                  : isCopySuccess
                    ? 'COPIED!'
                    : option.action === 'copy'
                      ? 'COPY NOW'
                      : 'DOWNLOAD →'}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function optionLabel(format: ExportFormat): string {
  switch (format) {
    case 'markdown':
      return 'Markdown pack'
    case 'notion':
      return 'Notion-ready export'
    case 'copy-bundle':
      return 'Copy bundle'
    case 'social-kit':
      return 'Social posting kit'
  }
}
