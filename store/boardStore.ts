import { create } from 'zustand'
import { arrayMove } from '@dnd-kit/sortable'
import { createClient } from '@/lib/supabase/client'
import type { Board, Column, Card, Priority, LabelColor } from '@/lib/data'

type BoardStore = {
  boards: Board[]
  activeBoardId: string | null
  isLoading: boolean
  userId: string | null
  setActiveBoard: (id: string) => void
  loadUserData: () => Promise<void>
  signOut: () => Promise<void>
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

function db() {
  return createClient()
}

export const useBoardStore = create<BoardStore>()((set, get) => ({
  boards: [],
  activeBoardId: null,
  isLoading: true,
  userId: null,

  setActiveBoard: (id) => set({ activeBoardId: id }),

  loadUserData: async () => {
    set({ isLoading: true })
    const supabase = db()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      set({ isLoading: false })
      return
    }
    set({ userId: user.id })

    const { data: boardsData, error: boardsError } = await supabase
      .from('boards')
      .select('id, title, created_at')
      .order('created_at', { ascending: true })

    if (boardsError || !boardsData) {
      set({ isLoading: false })
      return
    }

    const boardIds = boardsData.map((b) => b.id)
    let columnsData: any[] = []
    let cardsData: any[] = []

    if (boardIds.length > 0) {
      const { data: cols, error: colsError } = await supabase
        .from('columns')
        .select('id, board_id, title, order')
        .in('board_id', boardIds)
        .order('order', { ascending: true })
      if (!colsError) columnsData = cols ?? []

      const columnIds = columnsData.map((c) => c.id)
      if (columnIds.length > 0) {
        const { data: cards } = await supabase
          .from('cards')
          .select('id, column_id, title, description, due_date, priority, labels, order, created_at')
          .in('column_id', columnIds)
          .order('order', { ascending: true })
        cardsData = cards ?? []
      }
    }

    const boards: Board[] = boardsData.map((b) => ({
      id: b.id,
      title: b.title,
      createdAt: b.created_at,
      columns: columnsData
        .filter((c) => c.board_id === b.id)
        .map((c) => ({
          id: c.id,
          boardId: c.board_id,
          title: c.title,
          order: c.order,
          cards: cardsData
            .filter((card) => card.column_id === c.id)
            .map((card) => ({
              id: card.id,
              columnId: card.column_id,
              title: card.title,
              description: card.description ?? undefined,
              dueDate: card.due_date ?? undefined,
              priority: (card.priority as Priority) ?? undefined,
              labels: (card.labels as LabelColor[]) ?? undefined,
              order: card.order,
              createdAt: card.created_at,
            })),
        })),
    }))

    set({
      boards,
      activeBoardId: boards.length > 0 ? boards[0].id : null,
      isLoading: false,
    })
  },

  signOut: async () => {
    await db().auth.signOut()
    set({ boards: [], activeBoardId: null })
  },

  addBoard: (title) => {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const userId = get().userId
    set((state) => ({
      boards: [...state.boards, { id, title, createdAt, columns: [] }],
      activeBoardId: id,
    }))
    db().from('boards').insert({ id, title, created_at: createdAt, user_id: userId }).then()
    return id
  },

  renameBoard: (id, title) => {
    set((state) => ({
      boards: state.boards.map((b) => (b.id === id ? { ...b, title } : b)),
    }))
    db().from('boards').update({ title }).eq('id', id).then()
  },

  deleteBoard: (id) => {
    set((state) => {
      const remaining = state.boards.filter((b) => b.id !== id)
      return {
        boards: remaining,
        activeBoardId: remaining.length > 0 ? remaining[remaining.length - 1].id : null,
      }
    })
    db().from('boards').delete().eq('id', id).then()
  },

  addColumn: (boardId, title) => {
    const id = crypto.randomUUID()
    set((state) => {
      const board = state.boards.find((b) => b.id === boardId)
      const order = board?.columns.length ?? 0
      const newColumn: Column = { id, boardId, title, order, cards: [] }
      db().from('columns').insert({ id, board_id: boardId, title, order }).then()
      return {
        boards: state.boards.map((b) =>
          b.id === boardId ? { ...b, columns: [...b.columns, newColumn] } : b
        ),
      }
    })
  },

  renameColumn: (columnId, title) => {
    set((state) => ({
      boards: state.boards.map((b) => ({
        ...b,
        columns: b.columns.map((c) => (c.id === columnId ? { ...c, title } : c)),
      })),
    }))
    db().from('columns').update({ title }).eq('id', columnId).then()
  },

  deleteColumn: (columnId) => {
    set((state) => ({
      boards: state.boards.map((b) => ({
        ...b,
        columns: b.columns.filter((c) => c.id !== columnId),
      })),
    }))
    db().from('columns').delete().eq('id', columnId).then()
  },

  addCard: (columnId, details) => {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    set((state) => ({
      boards: state.boards.map((b) => ({
        ...b,
        columns: b.columns.map((c) => {
          if (c.id !== columnId) return c
          const newCard: Card = { id, columnId, order: c.cards.length, createdAt, ...details }
          db().from('cards').insert({
            id,
            column_id: columnId,
            title: details.title,
            description: details.description ?? null,
            due_date: details.dueDate ?? null,
            priority: details.priority ?? null,
            labels: details.labels ?? [],
            order: c.cards.length,
            created_at: createdAt,
          }).then()
          return { ...c, cards: [...c.cards, newCard] }
        }),
      })),
    }))
  },

  updateCard: (cardId, updates) => {
    set((state) => ({
      boards: state.boards.map((b) => ({
        ...b,
        columns: b.columns.map((c) => ({
          ...c,
          cards: c.cards.map((card) => (card.id === cardId ? { ...card, ...updates } : card)),
        })),
      })),
    }))
    db().from('cards').update({
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.description !== undefined && { description: updates.description ?? null }),
      ...(updates.dueDate !== undefined && { due_date: updates.dueDate ?? null }),
      ...(updates.priority !== undefined && { priority: updates.priority ?? null }),
      ...(updates.labels !== undefined && { labels: updates.labels ?? [] }),
    }).eq('id', cardId).then()
  },

  deleteCard: (cardId) => {
    set((state) => ({
      boards: state.boards.map((b) => ({
        ...b,
        columns: b.columns.map((c) => ({
          ...c,
          cards: c.cards.filter((card) => card.id !== cardId),
        })),
      })),
    }))
    db().from('cards').delete().eq('id', cardId).then()
  },

  moveCard: (cardId, toColumnId, toIndex) => {
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
      const newState = {
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

      // Sync: update moved card's column, then re-order both affected columns
      const supabase = db()
      supabase.from('cards').update({ column_id: toColumnId }).eq('id', cardId).then()

      newState.boards.forEach((b) => {
        b.columns.forEach((c) => {
          if (c.id === toColumnId || c.id === movedCard!.columnId) {
            const updates = c.cards.map((card, i) => ({
              id: card.id,
              column_id: card.columnId,
              order: i,
              title: card.title,
              created_at: card.createdAt,
            }))
            supabase.from('cards').upsert(updates).then()
          }
        })
      })

      return newState
    })
  },

  moveColumn: (boardId, columnId, toIndex) => {
    set((state) => {
      const newBoards = state.boards.map((b) => {
        if (b.id !== boardId) return b
        const fromIndex = b.columns.findIndex((c) => c.id === columnId)
        if (fromIndex === -1 || fromIndex === toIndex) return b
        const reordered = arrayMove(b.columns, fromIndex, toIndex)

        // Sync orders
        const supabase = db()
        reordered.forEach((col, i) => {
          supabase.from('columns').update({ order: i }).eq('id', col.id).then()
        })

        return { ...b, columns: reordered }
      })
      return { boards: newBoards }
    })
  },
}))
