import type { Task } from '../../types/task.types'
import TaskCard from '../TaskCard'

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  onComplete: (id: number) => void
}

function TaskList({ tasks, loading, onComplete }: TaskListProps) {

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl p-4 flex items-start gap-3.5">
            <div className="w-1 h-12 rounded-full skeleton" />
            <div className="flex-1 space-y-2.5">
              <div className="h-4 w-3/4 rounded-lg skeleton" />
              <div className="h-3 w-1/2 rounded-lg skeleton" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center animate-float">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent/60">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-text-primary font-semibold text-sm mb-1">
            All caught up!
          </p>
          <p className="text-text-muted text-xs leading-relaxed">
            Add a new task to get started
          </p>
        </div>
      </div>
    )
  }

  // Task list with stagger animation
  return (
    <div className="flex flex-col gap-6 stagger">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onComplete}
        />
      ))}
    </div>
  )
}

export default TaskList