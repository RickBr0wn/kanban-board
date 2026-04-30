import { KanbanBoard } from '@/components/Board'
import { SAMPLE_BOARD } from '@/lib/data'

export default function Page() {
  return <KanbanBoard board={SAMPLE_BOARD} />
}
