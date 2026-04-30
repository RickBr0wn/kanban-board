import type { Card } from '@/lib/data'

export function KanbanCard({ title, description }: Pick<Card, 'title' | 'description'>) {
  return (
    <div className="bg-slate-700 rounded-lg p-3 shadow-sm hover:bg-slate-600 transition-colors cursor-pointer">
      <p className="text-sm font-medium text-slate-100">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-slate-400 leading-relaxed">{description}</p>
      )}
    </div>
  )
}
