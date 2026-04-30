'use client'

import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useBoardStore } from '@/store/boardStore'
import type { Column } from '@/lib/data'
import { KanbanCard } from './Card'

export function KanbanColumn({ column }: { column: Column }) {
  const { renameColumn, deleteColumn, addCard } = useBoardStore()

  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(column.title)
  const [addingCard, setAddingCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')

  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  function saveTitle() {
    const trimmed = titleDraft.trim()
    if (trimmed) {
      renameColumn(column.id, trimmed)
    } else {
      setTitleDraft(column.title)
    }
    setEditingTitle(false)
  }

  function handleAddCard() {
    if (newCardTitle.trim()) {
      addCard(column.id, newCardTitle.trim())
      setNewCardTitle('')
      setAddingCard(false)
    }
  }

  return (
    <div className="flex flex-col w-72 flex-shrink-0 bg-slate-800 rounded-xl p-3 gap-2">
      {/* Header */}
      <div className="flex items-center justify-between px-1 mb-1">
        {editingTitle ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveTitle()
              if (e.key === 'Escape') {
                setTitleDraft(column.title)
                setEditingTitle(false)
              }
            }}
            className="flex-1 px-1 py-0.5 text-sm font-semibold bg-slate-700 text-slate-100 rounded border border-blue-500 outline-none"
          />
        ) : (
          <h2
            className="text-sm font-semibold text-slate-200 cursor-pointer hover:text-white"
            onClick={() => {
              setTitleDraft(column.title)
              setEditingTitle(true)
            }}
          >
            {column.title}
          </h2>
        )}
        <div className="flex items-center gap-1 ml-2">
          <span className="text-xs text-slate-400 bg-slate-700 rounded-full px-2 py-0.5">
            {column.cards.length}
          </span>
          <button
            onClick={() => deleteColumn(column.id)}
            className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
            title="Delete column"
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
      </div>

      {/* Cards — droppable area */}
      <SortableContext
        items={column.cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`flex flex-col gap-2 min-h-8 rounded-lg transition-colors ${
            isOver && column.cards.length === 0 ? 'bg-slate-700/50' : ''
          }`}
        >
          {column.cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>

      {/* Add card */}
      {addingCard ? (
        <div className="flex flex-col gap-2 mt-1">
          <textarea
            autoFocus
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Card title"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleAddCard()
              }
              if (e.key === 'Escape') {
                setNewCardTitle('')
                setAddingCard(false)
              }
            }}
            className="px-2 py-1.5 text-sm bg-slate-700 text-slate-100 rounded border border-blue-500 outline-none placeholder:text-slate-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddCard}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
            >
              Add card
            </button>
            <button
              onClick={() => {
                setNewCardTitle('')
                setAddingCard(false)
              }}
              className="px-3 py-1 text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingCard(true)}
          className="mt-1 p-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors text-left"
        >
          + Add card
        </button>
      )}
    </div>
  )
}
