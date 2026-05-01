'use client'

import type { LabelColor, Priority } from '@/lib/data'

const LABEL_COLORS: LabelColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']

const LABEL_BG: Record<LabelColor, string> = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-400',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
}

const PRIORITY_OPTIONS: { value: Priority; label: string; light: string; dark: string }[] = [
  { value: 'low',      label: 'Low',      light: 'text-slate-600 bg-slate-200',    dark: 'dark:text-slate-300 dark:bg-slate-700' },
  { value: 'medium',   label: 'Medium',   light: 'text-sky-700 bg-sky-100',        dark: 'dark:text-sky-400 dark:bg-sky-900/40' },
  { value: 'high',     label: 'High',     light: 'text-orange-700 bg-orange-100',  dark: 'dark:text-orange-400 dark:bg-orange-900/40' },
  { value: 'critical', label: 'Critical', light: 'text-red-700 bg-red-100',        dark: 'dark:text-red-400 dark:bg-red-900/40' },
]

type Props = {
  searchQuery: string
  onSearchChange: (q: string) => void
  filterLabels: LabelColor[]
  onToggleLabel: (l: LabelColor) => void
  filterPriorities: Priority[]
  onTogglePriority: (p: Priority) => void
  onClear: () => void
  hasFilters: boolean
}

export function SearchBar({
  searchQuery, onSearchChange,
  filterLabels, onToggleLabel,
  filterPriorities, onTogglePriority,
  onClear, hasFilters,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50">
      {/* Text search */}
      <div className="relative">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search cards…"
          className="pl-8 pr-3 py-1.5 text-sm w-44 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none placeholder:text-slate-400 transition-colors"
        />
      </div>

      {/* Label filters */}
      <div className="flex items-center gap-1.5">
        {LABEL_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onToggleLabel(color)}
            title={color}
            className={`h-5 w-5 rounded-full ${LABEL_BG[color]} transition-all ${
              filterLabels.includes(color)
                ? 'opacity-100 ring-2 ring-offset-1 ring-white dark:ring-slate-900 scale-110'
                : 'opacity-35 hover:opacity-65'
            }`}
          />
        ))}
      </div>

      {/* Priority filters */}
      <div className="flex items-center gap-1.5">
        {PRIORITY_OPTIONS.map((p) => (
          <button
            key={p.value}
            onClick={() => onTogglePriority(p.value)}
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${p.light} ${p.dark} transition-all ${
              filterPriorities.includes(p.value)
                ? 'opacity-100 ring-1 ring-current'
                : 'opacity-45 hover:opacity-75'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {hasFilters && (
        <button
          onClick={onClear}
          className="ml-auto text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  )
}
