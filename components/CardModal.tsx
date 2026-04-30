'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useBoardStore } from '@/store/boardStore'
import type { Card, Priority, LabelColor } from '@/lib/data'

type PriorityOption = { value: Priority; label: string; classes: string }

const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'low',      label: 'Low',      classes: 'text-slate-300 bg-slate-700' },
  { value: 'medium',   label: 'Medium',   classes: 'text-sky-400 bg-sky-900/40' },
  { value: 'high',     label: 'High',     classes: 'text-orange-400 bg-orange-900/40' },
  { value: 'critical', label: 'Critical', classes: 'text-red-400 bg-red-900/40' },
]

const LABEL_OPTIONS: { value: LabelColor; bg: string }[] = [
  { value: 'red',    bg: 'bg-red-500' },
  { value: 'orange', bg: 'bg-orange-500' },
  { value: 'yellow', bg: 'bg-yellow-400' },
  { value: 'green',  bg: 'bg-green-500' },
  { value: 'blue',   bg: 'bg-blue-500' },
  { value: 'purple', bg: 'bg-purple-500' },
]

function formatDateForInput(iso: string): string {
  return iso.slice(0, 10)
}

type CardModalProps =
  | { mode: 'edit'; card: Card; onClose: () => void }
  | { mode: 'create'; columnId: string; onClose: () => void }

export function CardModal(props: CardModalProps) {
  const { updateCard, addCard } = useBoardStore()

  const isEdit = props.mode === 'edit'
  const [title, setTitle] = useState(isEdit ? props.card.title : '')
  const [description, setDescription] = useState(isEdit ? (props.card.description ?? '') : '')
  const [dueDate, setDueDate] = useState(isEdit && props.card.dueDate ? formatDateForInput(props.card.dueDate) : '')
  const [priority, setPriority] = useState<Priority | undefined>(isEdit ? props.card.priority : undefined)
  const [labels, setLabels] = useState<LabelColor[]>(isEdit ? (props.card.labels ?? []) : [])
  const [preview, setPreview] = useState(false)

  const { onClose } = props

  function save() {
    const details = {
      title: title.trim() || (isEdit ? props.card.title : 'New Card'),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      priority,
      labels: labels.length > 0 ? labels : undefined,
    }
    if (isEdit) {
      updateCard(props.card.id, details)
    } else {
      addCard(props.columnId, details)
    }
    onClose()
  }

  function toggleLabel(color: LabelColor) {
    setLabels((prev) =>
      prev.includes(color) ? prev.filter((l) => l !== color) : [...prev, color]
    )
  }

  function togglePriority(value: Priority) {
    setPriority((prev) => (prev === value ? undefined : value))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onPointerDown={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div className="flex items-start gap-3 p-5 border-b border-slate-700">
          <textarea
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title"
            rows={1}
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
            className="flex-1 text-base font-semibold bg-transparent text-slate-100 resize-none outline-none leading-snug placeholder:text-slate-500 placeholder:font-normal"
          />
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 space-y-5">
          {/* Labels */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Labels</p>
            <div className="flex gap-2">
              {LABEL_OPTIONS.map(({ value, bg }) => (
                <button
                  key={value}
                  onClick={() => toggleLabel(value)}
                  className={`h-7 w-12 rounded ${bg} transition-all ${
                    labels.includes(value)
                      ? 'opacity-100 ring-2 ring-white ring-offset-2 ring-offset-slate-800'
                      : 'opacity-40 hover:opacity-70'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Priority</p>
            <div className="flex flex-wrap gap-2">
              {PRIORITY_OPTIONS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => togglePriority(p.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${p.classes} ${
                    priority === p.value
                      ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-800'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due date */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Due date</p>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-3 py-1.5 text-sm bg-slate-700 text-slate-100 rounded-lg border border-slate-600 outline-none focus:border-blue-500 [color-scheme:dark]"
              />
              {dueDate && (
                <button
                  onClick={() => setDueDate('')}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</p>
              <button
                onClick={() => setPreview((p) => !p)}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                {preview ? 'Edit' : 'Preview'}
              </button>
            </div>
            {preview ? (
              <div className="min-h-24 p-3 bg-slate-700/50 rounded-lg">
                {description.trim() ? (
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown>{description}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No description</p>
                )}
              </div>
            ) : (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description… (supports markdown)"
                rows={4}
                className="w-full px-3 py-2 text-sm bg-slate-700 text-slate-100 rounded-lg border border-slate-600 outline-none focus:border-blue-500 placeholder:text-slate-500 resize-none"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
