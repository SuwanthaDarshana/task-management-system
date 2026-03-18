import type { Task } from '../../types/task.types'

interface TaskCardProps {
  task: Task
  onComplete: (id: number) => void
}

function TaskCard({ task, onComplete }: TaskCardProps) {
  // Format relative time
  const getTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMin = Math.floor(diffMs / 60000)
      const diffHr = Math.floor(diffMin / 60)
      const diffDay = Math.floor(diffHr / 24)

      if (diffMin < 1) return 'Just now'
      if (diffMin < 60) return `${diffMin}m ago`
      if (diffHr < 24) return `${diffHr}h ago`
      if (diffDay < 7) return `${diffDay}d ago`
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch {
      return ''
    }
  }

  return (
    <div className="group glass rounded-2xl p-6 flex items-center gap-5 transition-all duration-200">
      {/* Accent Line */}
      <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-accent to-accent/20 flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-text-primary font-semibold text-sm leading-snug mb-1">
          {task.title}
        </h3>
        <p className="text-text-muted text-xs leading-relaxed line-clamp-2">
          {task.description}
        </p>

        {/* Metadata */}
        {task.createdAt && (
          <div className="flex items-center gap-1.5 mt-3">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-text-muted">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-text-muted text-[11px] font-medium">
              {getTimeAgo(task.createdAt)}
            </span>
          </div>
        )}
      </div>

      {/* Complete Button */}
      <button
        onClick={() => onComplete(task.id)}
        className="btn-complete opacity-60 group-hover:opacity-100 transition-all duration-200 flex-shrink-0"
        title="Mark as complete"
      >
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Done
        </span>
      </button>
    </div>
  )
}

export default TaskCard