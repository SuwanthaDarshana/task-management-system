import { useState } from 'react'
import type { CreateTaskRequest } from '../../types/task.types'

interface AddTaskFormProps {
  onSubmit: (request: CreateTaskRequest) => Promise<void>
  submitting: boolean
}

function AddTaskForm({ onSubmit, submitting }: AddTaskFormProps) {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({})
  const [focused, setFocused] = useState<string | null>(null)

  const validate = (): boolean => {
    const newErrors: { title?: string; description?: string } = {}
    if (!title.trim()) newErrors.title = 'Title is required'
    if (!description.trim()) newErrors.description = 'Description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await onSubmit({ title: title.trim(), description: description.trim() })
    setTitle('')
    setDescription('')
    setErrors({})
  }

  const charLimit = 200
  const descLength = description.length

  return (
    <div className="glass rounded-3xl h-full flex flex-col" style={{ padding: '48px 48px' }}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-text-primary font-bold text-lg flex items-center justify-center">
          New Task
        </h2>
        
        <div className="h-3" aria-hidden="true" />
        
        <p className="text-text-muted text-xs flex items-center justify-center">
          What will you accomplish today?
        </p>
      </div>

      <div className="h-6" aria-hidden="true" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10 flex-1">
        {/* Title Field */}
        <div className="flex flex-col gap-4">
          <label
            htmlFor="task-title"
            className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 ${focused === 'title' ? 'text-accent' : 'text-text-muted'
              }`}
          >
            Title
          </label>
          <input
            id="task-title"
            type="text"
            placeholder="e.g. Design landing page"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setFocused('title')}
            onBlur={() => setFocused(null)}
            disabled={submitting}
            maxLength={100}
            className={`input-glass ${errors.title ? 'error' : ''}`}
          />
          {errors.title && (
            <p className="text-danger text-xs flex items-center gap-1.5 ml-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.title}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="task-description"
              className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 ${focused === 'description' ? 'text-accent' : 'text-text-muted'
                }`}
            >
              Description
            </label>
            <span className={`text-[11px] tabular-nums transition-colors duration-200 ${descLength > charLimit * 0.9 ? 'text-danger' : 'text-text-muted'
              }`}>
              {descLength}/{charLimit}
            </span>
          </div>
          <textarea
            id="task-description"
            placeholder="What needs to be done?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setFocused('description')}
            onBlur={() => setFocused(null)}
            disabled={submitting}
            rows={5}
            maxLength={charLimit}
            className={`input-glass ${errors.description ? 'error' : ''}`}
          />
          {errors.description && (
            <p className="text-danger text-xs flex items-center gap-1.5 ml-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.description}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary mt-auto"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2.5">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating Task...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Task
            </span>
          )}
        </button>
      </form>
    </div>
  )
}

export default AddTaskForm