import { useCallback, useEffect, useState } from "react";
import type { CreateTaskRequest, Task } from "../types/task.types";
import taskService from "../services/taskService";



interface UseTaskReturn {
  tasks: Task[]
  loading: boolean
  submitting: boolean
  error: string | null
  createTask: (request: CreateTaskRequest) => Promise<void>
  completeTask: (id: number) => Promise<void>
}

const useTask = (): UseTaskReturn => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch recent tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await taskService.getRecentTasks()
      setTasks(response.data)
    } catch (err) {
      setError('Failed to load tasks. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Create a new task
  const createTask = async (request: CreateTaskRequest): Promise<void> => {
    setSubmitting(true)
    setError(null)
    try {
      await taskService.createTask(request)
      await fetchTasks() // Refresh list after creating
    } catch (err) {
      setError('Failed to create task. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Mark task as completed
  const completeTask = async (id: number): Promise<void> => {
    setError(null)
    try {
      await taskService.completeTask(id)
      
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)) // Remove completed task from list
    } catch (err) {
      setError('Failed to complete task. Please try again.')
    }
  }

  // Load tasks when app starts
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks,
    loading,
    submitting,
    error,
    createTask,
    completeTask,
  }
}

export default useTask