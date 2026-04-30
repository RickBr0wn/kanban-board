'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useBoardStore } from '@/store/boardStore'
import type { Card } from '@/lib/data'

export function KanbanCard({ card }: { card: Card }) {
  const { editCard, deleteCard } = useBoardStore()

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(card.title)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { type: 'card' },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  function saveEdit() {
    const trimmed = draft.trim()
    if (trimmed) editCard(card.id, trimmed)
    else setDraft(card.title)
    setEditing(false)
  }

  if (editing) {
    return (
      <div ref={setNodeRef} style={style} className="bg-slate-700 rounded-lg p-3 shadow-sm">
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              saveEdit()
            }
            if (e.key === 'Escape') {
              setDraft(card.title)
              setEditing(false)
            }
          }}
          rows={2}
          className="w-full text-sm bg-slate-600 text-slate-100 rounded p-1 outline-none border border-blue-500 resize-none"
        />
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-slate-700 rounded-lg p-3 shadow-sm transition-colors ${
        isDragging ? 'opacity-30' : 'hover:bg-slate-600'
      }`}
      {...attributes}
      {...listeners}
    >
      <p
        className="text-sm font-medium text-slate-100 pr-6"
        onClick={() => {
          setDraft(card.title)
          setEditing(true)
        }}
      >
        {card.title}
      </p>
      {card.description && (
        <p className="mt-1 text-xs text-slate-400 leading-relaxed">{card.description}</p>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation()
          deleteCard(card.id)
        }}
        className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete card"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
