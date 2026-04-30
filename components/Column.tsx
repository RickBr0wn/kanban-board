import type { Column } from '@/lib/data'
import { KanbanCard } from './Card'

export function KanbanColumn({ column }: { column: Column }) {
  return (
    <div className="flex flex-col w-72 flex-shrink-0 bg-slate-800 rounded-xl p-3 gap-2">
      <div className="flex items-center justify-between px-1 mb-1">
        <h2 className="text-sm font-semibold text-slate-200">{column.title}</h2>
        <span className="text-xs text-slate-400 bg-slate-700 rounded-full px-2 py-0.5">
          {column.cards.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {column.cards.map((card) => (
          <KanbanCard key={card.id} title={card.title} description={card.description} />
        ))}
      </div>
    </div>
  )
}
