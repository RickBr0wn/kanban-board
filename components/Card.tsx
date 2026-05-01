'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useBoardStore } from '@/store/boardStore'
import type { Card, LabelColor, Priority } from '@/lib/data'
import { CardModal } from './CardModal'

const LABEL_BG: Record<LabelColor, string> = {
  red:    'bg-red-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-400',
  green:  'bg-green-500',
  blue:   'bg-blue-500',
  purple: 'bg-purple-500',
}

const PRIORITY_BADGE: Record<Priority, string> = {
  low:      'text-slate-400 bg-slate-700',
  medium:   'text-sky-400 bg-sky-900/40',
  high:     'text-orange-400 bg-orange-900/40',
  critical: 'text-red-400 bg-red-900/40',
}

function getDueDateStyle(dueDate: string): { label: string; classes: string } {
  const [y, m, d] = dueDate.split('-').map(Number)
  const due = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / 86_400_000)
  const label = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(due)
  if (diffDays < 0)  return { label: `${label} · Overdue`, classes: 'text-red-400 bg-red-900/30' }
  if (diffDays === 0) return { label: `${label} · Today`,   classes: 'text-yellow-400 bg-yellow-900/30' }
  if (diffDays <= 3)  return { label,                        classes: 'text-orange-400 bg-orange-900/30' }
  return               { label,                              classes: 'text-slate-400 bg-slate-700' }
}

export function KanbanCard({ card }: { card: Card }) {
  const { deleteCard } = useBoardStore()
  const [modalOpen, setModalOpen] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { type: 'card' },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const dueDateStyle = card.dueDate ? getDueDateStyle(card.dueDate) : null
  const descSnippet = card.description?.split('\n')[0].slice(0, 80)

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group relative bg-white dark:bg-slate-700 rounded-lg shadow-sm transition-colors ${
          isDragging ? 'opacity-30' : 'hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer'
        }`}
        {...attributes}
        {...listeners}
        onClick={() => setModalOpen(true)}
      >
        {/* Label bars */}
        {card.labels && card.labels.length > 0 && (
          <div className="flex gap-1 px-3 pt-2.5">
            {card.labels.map((label) => (
              <div key={label} className={`h-1.5 w-8 rounded-full ${LABEL_BG[label]}`} />
            ))}
          </div>
        )}

        <div className="px-3 py-2.5">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 pr-6 leading-snug">{card.title}</p>

          {descSnippet && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-1">{descSnippet}</p>
          )}

          {(card.priority || dueDateStyle) && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {card.priority && (
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${PRIORITY_BADGE[card.priority]}`}>
                  {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
                </span>
              )}
              {dueDateStyle && (
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${dueDateStyle.classes}`}>
                  {dueDateStyle.label}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); deleteCard(card.id) }}
          className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {modalOpen && <CardModal mode="edit" card={card} onClose={() => setModalOpen(false)} />}
    </>
  )
}
