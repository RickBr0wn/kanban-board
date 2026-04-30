export type Card = {
  id: string
  columnId: string
  title: string
  description?: string
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
          order: 0,
          createdAt: '2026-04-30T00:00:00.000Z',
        },
        {
          id: 'card-2',
          columnId: 'col-1',
          title: 'Design data model',
          description: 'Define Board, Column, and Card types',
          order: 1,
          createdAt: '2026-04-30T00:00:00.000Z',
        },
        {
          id: 'card-3',
          columnId: 'col-1',
          title: 'Write unit tests',
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
          order: 0,
          createdAt: '2026-04-30T00:00:00.000Z',
        },
        {
          id: 'card-5',
          columnId: 'col-2',
          title: 'Configure Tailwind CSS',
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
          order: 0,
          createdAt: '2026-04-30T00:00:00.000Z',
        },
        {
          id: 'card-7',
          columnId: 'col-3',
          title: 'Install dependencies',
          description: 'dnd-kit, Zustand, Tailwind',
          order: 1,
          createdAt: '2026-04-30T00:00:00.000Z',
        },
      ],
    },
  ],
}
