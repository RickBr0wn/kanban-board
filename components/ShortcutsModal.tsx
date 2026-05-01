'use client'

const SHORTCUTS = [
  { key: 'N',   description: 'Add card to first column' },
  { key: 'C',   description: 'Add column' },
  { key: 'B',   description: 'New board' },
  { key: '/',   description: 'Focus search' },
  { key: '?',   description: 'Show shortcuts' },
  { key: 'Esc', description: 'Close dialog' },
]

export function ShortcutsModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onPointerDown={onClose}
    >
      <div
        className="bg-slate-50 dark:bg-slate-800 rounded-xl w-full max-w-xs shadow-2xl"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Keyboard shortcuts</h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {SHORTCUTS.map(({ key, description }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-300">{description}</span>
              <kbd className="px-2 py-0.5 text-xs font-mono bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-600">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
