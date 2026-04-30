'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useBoardStore } from '@/store/boardStore'
import { KanbanColumn } from './Column'

export function KanbanBoard() {
  const { boards, activeBoardId, setActiveBoard, addBoard, renameBoard, deleteBoard, addColumn, moveCard } =
    useBoardStore()

  const [renamingBoardId, setRenamingBoardId] = useState<string | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const [addingColumn, setAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [activeCardId, setActiveCardId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const activeBoard = boards.find((b) => b.id === activeBoardId)
  const activeCard = activeBoard?.columns
    .flatMap((c) => c.cards)
    .find((card) => card.id === activeCardId)

  function handleAddBoard() {
    const newId = addBoard('New Board')
    setRenamingBoardId(newId)
    setRenameDraft('New Board')
  }

  function saveRenameBoard() {
    if (renamingBoardId && renameDraft.trim()) {
      renameBoard(renamingBoardId, renameDraft.trim())
    }
    setRenamingBoardId(null)
    setRenameDraft('')
  }

  function handleAddColumn() {
    if (activeBoard && newColumnTitle.trim()) {
      addColumn(activeBoard.id, newColumnTitle.trim())
      setNewColumnTitle('')
      setAddingColumn(false)
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveCardId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveCardId(null)

    if (!over || !activeBoard || active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    const sourceColumn = activeBoard.columns.find((c) =>
      c.cards.some((card) => card.id === activeId)
    )
    if (!sourceColumn) return

    // Dropped directly onto a column (e.g. empty column)
    const targetColumnDirect = activeBoard.columns.find((c) => c.id === overId)
    if (targetColumnDirect) {
      if (targetColumnDirect.id !== sourceColumn.id) {
        moveCard(activeId, targetColumnDirect.id, targetColumnDirect.cards.length)
      }
      return
    }

    // Dropped onto a card
    const targetColumn = activeBoard.columns.find((c) =>
      c.cards.some((card) => card.id === overId)
    )
    if (!targetColumn) return

    const overIndex = targetColumn.cards.findIndex((card) => card.id === overId)
    moveCard(activeId, targetColumn.id, overIndex)
  }

  if (boards.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-900 min-h-screen">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No boards yet</p>
          <button
            onClick={handleAddBoard}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm"
          >
            Create your first board
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 bg-slate-900 min-h-screen">
      {/* Board tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-700 overflow-x-auto">
        {boards.map((board) => (
          <div key={board.id} className="group relative flex-shrink-0">
            {renamingBoardId === board.id ? (
              <input
                autoFocus
                value={renameDraft}
                onChange={(e) => setRenameDraft(e.target.value)}
                onBlur={saveRenameBoard}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveRenameBoard()
                  if (e.key === 'Escape') {
                    setRenamingBoardId(null)
                    setRenameDraft('')
                  }
                }}
                className="px-3 py-1.5 text-sm bg-slate-700 text-slate-100 rounded-md border border-blue-500 outline-none w-36"
              />
            ) : (
              <button
                onClick={() => setActiveBoard(board.id)}
                onDoubleClick={() => {
                  setRenamingBoardId(board.id)
                  setRenameDraft(board.title)
                }}
                className={`pl-3 pr-7 py-1.5 text-sm rounded-md transition-colors ${
                  board.id === activeBoardId
                    ? 'bg-slate-700 text-slate-100 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {board.title}
              </button>
            )}
            <button
              onClick={() => deleteBoard(board.id)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-500 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete board"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
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
        ))}
        <button
          onClick={handleAddBoard}
          className="flex-shrink-0 px-3 py-1.5 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
        >
          + New Board
        </button>
      </div>

      {/* Columns */}
      {activeBoard && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <main className="flex flex-1 gap-4 p-6 overflow-x-auto items-start">
            {activeBoard.columns.map((column) => (
              <KanbanColumn key={column.id} column={column} />
            ))}

            {addingColumn ? (
              <div className="flex flex-col w-72 flex-shrink-0 bg-slate-800 rounded-xl p-3 gap-2">
                <input
                  autoFocus
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Column title"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddColumn()
                    if (e.key === 'Escape') {
                      setNewColumnTitle('')
                      setAddingColumn(false)
                    }
                  }}
                  className="px-2 py-1.5 text-sm bg-slate-700 text-slate-100 rounded border border-blue-500 outline-none placeholder:text-slate-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddColumn}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                  >
                    Add column
                  </button>
                  <button
                    onClick={() => {
                      setNewColumnTitle('')
                      setAddingColumn(false)
                    }}
                    className="px-3 py-1 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingColumn(true)}
                className="flex-shrink-0 w-72 p-3 text-sm text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 rounded-xl border-2 border-dashed border-slate-700 hover:border-slate-600 transition-colors"
              >
                + Add column
              </button>
            )}
          </main>

          <DragOverlay>
            {activeCard && (
              <div className="bg-slate-700 rounded-lg p-3 shadow-2xl rotate-1 opacity-95 w-72">
                <p className="text-sm font-medium text-slate-100">{activeCard.title}</p>
                {activeCard.description && (
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    {activeCard.description}
                  </p>
                )}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  )
}
