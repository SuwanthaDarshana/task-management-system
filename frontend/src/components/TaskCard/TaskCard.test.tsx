/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import TaskCard from './TaskCard'
import type { Task } from '../../types/task.types'

const mockTask: Task = {
  id: 1,
  title: 'Buy books',
  description: 'Buy books for school',
  completed: false,
  createdAt: new Date().toISOString(),
}

describe('TaskCard', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render task title', () => {
    render(<TaskCard task={mockTask} onComplete={vi.fn()} />)
    expect(screen.getByText('Buy books')).toBeDefined()
  })

  it('should render task description', () => {
    render(<TaskCard task={mockTask} onComplete={vi.fn()} />)
    expect(screen.getByText('Buy books for school')).toBeDefined()
  })

  it('should render Done button', () => {
    render(<TaskCard task={mockTask} onComplete={vi.fn()} />)
    expect(screen.getByRole('button', { name: /done/i })).toBeDefined()
  })

  it('should render time ago when createdAt is provided', () => {
    render(<TaskCard task={mockTask} onComplete={vi.fn()} />)
    expect(screen.getByText(/just now/i)).toBeDefined()
  })

  it('should not render time when createdAt is empty', () => {
    const taskWithoutDate: Task = { ...mockTask, createdAt: '' }
    render(<TaskCard task={taskWithoutDate} onComplete={vi.fn()} />)
    expect(screen.queryByText(/ago/i)).toBeNull()
  })

  it('should call onComplete with task id when Done is clicked', () => {
    const onComplete = vi.fn()
    render(<TaskCard task={mockTask} onComplete={onComplete} />)
    fireEvent.click(screen.getByRole('button', { name: /done/i }))
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(1)
  })
})