export type Priority = 'low' | 'medium' | 'high' | 'critical'
export type LabelColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple'

export type Card = {
  id: string
  columnId: string
  title: string
  description?: string
  dueDate?: string
  priority?: Priority
  labels?: LabelColor[]
  order: number
  createdAt: string
}

export type Column = {
  id: string
  boardId: string
  title: string
  order: number
  cards: Card[]
}

export type Board = {
  id: string
  title: string
  createdAt: string
  columns: Column[]
}

export const SAMPLE_BOARD: Board = {
  id: 'board-1',
  title: 'My Kanban Board',
  createdAt: '2026-04-30T00:00:00.000Z',
  columns: [
    {
      id: 'col-1',
      boardId: 'board-1',
      title: 'To Do',
      order: 0,
      cards: [
        {
          id: 'card-1',
          columnId: 'col-1',
          title: 'Set up project structure',
          priority: 'high',
          labels: ['blue'],
          order: 0,
          createdAt: '2026-04-30T00:00:00.000Z',
        },
        {
          id: 'card-2',
          columnId: 'col-1',
          title: 'Design data model',
          description: 'Define `Board`, `Column`, and `Card` types.\n\n- Board has many columns\n- Column has many cards\n- Cards are sortable',
          priority: 'medium',
          labels: ['purple', 'blue'],
          dueDate: '2026-05-10',
          order: 1,
          createdAt: '2026-04-30T00:00:00.000Z',
        },
        {
          id: 'card-3',
          columnId: 'col-1',
          title: 'Write unit tests',
          priority: 'low',
          order: 2,
          createdAt: '2026-04-30T00:00:00.000Z',
        },
      ],
    },
    {
      id: 'col-2',
      boardId: 'board-1',
      title: 'In Progress',
      order: 1,
      cards: [
        {
          id: 'card-4',
          columnId: 'col-2',
          title: 'Build static board layout',
          description: 'Hardcoded columns and cards, no state yet',
          priority: 'critical',
          labels: ['orange'],
          dueDate: '2026-05-01',
          order: 0,
          createdAt: '2026-04-30T00:00:00.000Z',
        },
        {
          id: 'card-5',
          columnId: 'col-2',
          title: 'Configure Tailwind CSS',
          labels: ['green'],
          order: 1,
          createdAt: '2026-04-30T00:00:00.000Z',
        },
      ],
    },
    {
      id: 'col-3',
      boardId: 'board-1',
      title: 'Done',
      order: 2,
      cards: [
        {
          id: 'card-6',
          columnId: 'col-3',
          title: 'Scaffold Next.js app',
          labels: ['green'],
          order: 0,
          createdAt: '2026-04-30T00:00:00.000Z',
        },
        {
          id: 'card-7',
          columnId: 'col-3',
          title: 'Install dependencies',
          description: 'dnd-kit, Zustand, Tailwind',
          labels: ['green'],
          order: 1,
          createdAt: '2026-04-30T00:00:00.000Z',
        },
      ],
    },
  ],
}
