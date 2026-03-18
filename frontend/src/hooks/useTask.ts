import { toast } from 'react-hot-toast'
import { useCallback, useEffect, useState } from 'react'
import type { CreateTaskRequest, Task } from '../types/task.types'
import taskService from '../services/taskService'

interface UseTaskReturn {
  tasks: Task[]
  loading: boolean
  submitting: boolean
  createTask: (request: CreateTaskRequest) => Promise<void>
  completeTask: (id: number) => Promise<void>
}

const useTask = (): UseTaskReturn => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)   // true initially
  const [submitting, setSubmitting] = useState<boolean>(false)

  // showLoader = true only on first load, false on background re-fetches
  const fetchTasks = useCallback(async (showLoader = false): Promise<void> => {
    if (showLoader) setLoading(true)
    try {
      const response = await taskService.getRecentTasks()
      setTasks(response.data)
    } catch {
      toast.error('Failed to load tasks. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const createTask = useCallback(async (request: CreateTaskRequest): Promise<void> => {
    setSubmitting(true)
    try {
      await taskService.createTask(request)
      await fetchTasks()                      // silent re-fetch (no skeleton)
      toast.success('Task created successfully!')
    } catch {
      toast.error('Failed to create task. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }, [fetchTasks])

  const completeTask = useCallback(async (id: number): Promise<void> => {
    try {
      // Optimistically remove the task from UI immediately
      setTasks((prev) => prev.filter((t) => t.id !== id))

      await taskService.completeTask(id)
      await fetchTasks()                      // re-fetch to get next incomplete task
      toast.success('Task completed! Great job! 🎉')
    } catch {
      // If it fails, re-fetch to restore the correct state
      await fetchTasks()
      toast.error('Failed to complete task. Please try again.')
    }
  }, [fetchTasks])

  // Initial load
  useEffect(() => {
    fetchTasks(true)                          // show skeleton on first load only
  }, [fetchTasks])

  return {
    tasks,
    loading,
    submitting,
    createTask,
    completeTask,
  }
}

export default useTask