import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { arrayMove } from '@dnd-kit/sortable'
import { type Board, type Column, type Card, type Priority, type LabelColor, SAMPLE_BOARD } from '@/lib/data'

type BoardStore = {
  boards: Board[]
  activeBoardId: string | null
  setActiveBoard: (id: string) => void
  addBoard: (title: string) => string
  renameBoard: (id: string, title: string) => void
  deleteBoard: (id: string) => void
  addColumn: (boardId: string, title: string) => void
  renameColumn: (columnId: string, title: string) => void
  deleteColumn: (columnId: string) => void
  addCard: (columnId: string, details: { title: string; description?: string; dueDate?: string; priority?: Priority; labels?: LabelColor[] }) => void
  updateCard: (cardId: string, updates: Partial<Pick<Card, 'title' | 'description' | 'dueDate' | 'priority' | 'labels'>>) => void
  deleteCard: (cardId: string) => void
  moveCard: (cardId: string, toColumnId: string, toIndex: number) => void
  moveColumn: (boardId: string, columnId: string, toIndex: number) => void
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set) => ({
      boards: [SAMPLE_BOARD],
      activeBoardId: SAMPLE_BOARD.id,

      setActiveBoard: (id) => set({ activeBoardId: id }),

      addBoard: (title) => {
        const id = crypto.randomUUID()
        set((state) => ({
          boards: [
            ...state.boards,
            { id, title, createdAt: new Date().toISOString(), columns: [] },
          ],
          activeBoardId: id,
        }))
        return id
      },

      renameBoard: (id, title) =>
        set((state) => ({
          boards: state.boards.map((b) => (b.id === id ? { ...b, title } : b)),
        })),

      deleteBoard: (id) =>
        set((state) => {
          const remaining = state.boards.filter((b) => b.id !== id)
          return {
            boards: remaining,
            activeBoardId: remaining.length > 0 ? remaining[remaining.length - 1].id : null,
          }
        }),

      addColumn: (boardId, title) =>
        set((state) => ({
          boards: state.boards.map((b) => {
            if (b.id !== boardId) return b
            const newColumn: Column = {
              id: crypto.randomUUID(),
              boardId,
              title,
              order: b.columns.length,
              cards: [],
            }
            return { ...b, columns: [...b.columns, newColumn] }
          }),
        })),

      renameColumn: (columnId, title) =>
        set((state) => ({
          boards: state.boards.map((b) => ({
            ...b,
            columns: b.columns.map((c) => (c.id === columnId ? { ...c, title } : c)),
          })),
        })),

      deleteColumn: (columnId) =>
        set((state) => ({
          boards: state.boards.map((b) => ({
            ...b,
            columns: b.columns.filter((c) => c.id !== columnId),
          })),
        })),

      addCard: (columnId, details) =>
        set((state) => ({
          boards: state.boards.map((b) => ({
            ...b,
            columns: b.columns.map((c) => {
              if (c.id !== columnId) return c
              const newCard: Card = {
                id: crypto.randomUUID(),
                columnId,
                order: c.cards.length,
                createdAt: new Date().toISOString(),
                ...details,
              }
              return { ...c, cards: [...c.cards, newCard] }
            }),
          })),
        })),

      updateCard: (cardId, updates) =>
        set((state) => ({
          boards: state.boards.map((b) => ({
            ...b,
            columns: b.columns.map((c) => ({
              ...c,
              cards: c.cards.map((card) => (card.id === cardId ? { ...card, ...updates } : card)),
            })),
          })),
        })),

      deleteCard: (cardId) =>
        set((state) => ({
          boards: state.boards.map((b) => ({
            ...b,
            columns: b.columns.map((c) => ({
              ...c,
              cards: c.cards.filter((card) => card.id !== cardId),
            })),
          })),
        })),

      moveCard: (cardId, toColumnId, toIndex) =>
        set((state) => {
          let movedCard: Card | undefined

          const boardsWithoutCard = state.boards.map((b) => ({
            ...b,
            columns: b.columns.map((c) => {
              const idx = c.cards.findIndex((card) => card.id === cardId)
              if (idx === -1) return c
              movedCard = c.cards[idx]
              return { ...c, cards: c.cards.filter((card) => card.id !== cardId) }
            }),
          }))

          if (!movedCard) return state

          const updatedCard = { ...movedCard, columnId: toColumnId }

          return {
            boards: boardsWithoutCard.map((b) => ({
              ...b,
              columns: b.columns.map((c) => {
                if (c.id !== toColumnId) return c
                const cards = [...c.cards]
                cards.splice(toIndex, 0, updatedCard)
                return { ...c, cards }
              }),
            })),
          }
        }),

      moveColumn: (boardId, columnId, toIndex) =>
        set((state) => ({
          boards: state.boards.map((b) => {
            if (b.id !== boardId) return b
            const fromIndex = b.columns.findIndex((c) => c.id === columnId)
            if (fromIndex === -1 || fromIndex === toIndex) return b
            return { ...b, columns: arrayMove(b.columns, fromIndex, toIndex) }
          }),
        })),
    }),
    {
      name: 'kanban-board-storage',
      skipHydration: true,
    }
  )
)
