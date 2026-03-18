/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import TaskList from './TaskList'
import type { Task } from '../../types/task.types'

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Buy books',
    description: 'Buy books for school',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Clean home',
    description: 'Need to clean the bedroom',
    completed: false,
    createdAt: new Date().toISOString(),
  },
]

describe('TaskList', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render loading skeletons when loading is true', () => {
    render(<TaskList tasks={[]} loading={true} onComplete={vi.fn()} />)
    const skeletons = document.querySelectorAll('.skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should not render tasks when loading is true', () => {
    render(<TaskList tasks={mockTasks} loading={true} onComplete={vi.fn()} />)
    expect(screen.queryByText('Buy books')).toBeNull()
  })

  it('should render empty state when tasks list is empty', () => {
    render(<TaskList tasks={[]} loading={false} onComplete={vi.fn()} />)
    expect(screen.getByText(/all caught up/i)).toBeDefined()
  })

  it('should render empty state message when no tasks', () => {
    render(<TaskList tasks={[]} loading={false} onComplete={vi.fn()} />)
    expect(screen.getByText(/add a new task to get started/i)).toBeDefined()
  })

  it('should render all tasks', () => {
    render(<TaskList tasks={mockTasks} loading={false} onComplete={vi.fn()} />)
    expect(screen.getByText('Buy books')).toBeDefined()
    expect(screen.getByText('Clean home')).toBeDefined()
  })

  it('should render correct number of task cards', () => {
    render(<TaskList tasks={mockTasks} loading={false} onComplete={vi.fn()} />)
    const buttons = screen.getAllByRole('button', { name: /done/i })
    expect(buttons.length).toBe(2)
  })

  it('should call onComplete when Done is clicked', () => {
    const onComplete = vi.fn()
    render(<TaskList tasks={mockTasks} loading={false} onComplete={onComplete} />)
    fireEvent.click(screen.getAllByRole('button', { name: /done/i })[0])
    expect(onComplete).toHaveBeenCalledWith(1)
  })

  it('should render single task correctly', () => {
    render(<TaskList tasks={[mockTasks[0]]} loading={false} onComplete={vi.fn()} />)
    expect(screen.getByText('Buy books')).toBeDefined()
    expect(screen.queryByText('Clean home')).toBeNull()
  })
})