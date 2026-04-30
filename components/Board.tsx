import type { Board } from '@/lib/data'
import { KanbanColumn } from './Column'

export function KanbanBoard({ board }: { board: Board }) {
  return (
    <div className="flex flex-col flex-1 bg-slate-900 min-h-screen">
      <header className="px-6 py-4 border-b border-slate-700">
        <h1 className="text-xl font-bold text-slate-100">{board.title}</h1>
      </header>
      <main className="flex flex-1 gap-4 p-6 overflow-x-auto">
        {board.columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </main>
    </div>
  )
}
