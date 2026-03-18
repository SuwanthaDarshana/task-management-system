
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import AddTaskForm from './AddTaskForm'

describe('AddTaskForm', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render title input', () => {
    render(<AddTaskForm onSubmit={vi.fn()} submitting={false} />)
    expect(screen.getByPlaceholderText(/design landing page/i)).toBeDefined()
  })

  it('should render description textarea', () => {
    render(<AddTaskForm onSubmit={vi.fn()} submitting={false} />)
    expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeDefined()
  })

  it('should render Add Task button', () => {
    render(<AddTaskForm onSubmit={vi.fn()} submitting={false} />)
    expect(screen.getByRole('button', { name: /add task/i })).toBeDefined()
  })

  it('should render Creating Task when submitting is true', () => {
    render(<AddTaskForm onSubmit={vi.fn()} submitting={true} />)
    expect(screen.getByText(/creating task/i)).toBeDefined()
  })

  it('should disable button when submitting', () => {
    render(<AddTaskForm onSubmit={vi.fn()} submitting={true} />)
    const button = screen.getByRole('button')
    expect((button as HTMLButtonElement).disabled).toBe(true)
  })

  it('should show error when title is empty on submit', async () => {
    render(<AddTaskForm onSubmit={vi.fn()} submitting={false} />)
    fireEvent.click(screen.getByRole('button', { name: /add task/i }))
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeDefined()
    })
  })

  it('should show error when description is empty on submit', async () => {
    render(<AddTaskForm onSubmit={vi.fn()} submitting={false} />)
    fireEvent.click(screen.getByRole('button', { name: /add task/i }))
    await waitFor(() => {
      expect(screen.getByText(/description is required/i)).toBeDefined()
    })
  })

  it('should not call onSubmit when fields are empty', async () => {
    const onSubmit = vi.fn()
    render(<AddTaskForm onSubmit={onSubmit} submitting={false} />)
    fireEvent.click(screen.getByRole('button', { name: /add task/i }))
    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  it('should update title input value', () => {
    render(<AddTaskForm onSubmit={vi.fn()} submitting={false} />)
    const input = screen.getByPlaceholderText(/design landing page/i)
    fireEvent.change(input, { target: { value: 'Buy books' } })
    expect((input as HTMLInputElement).value).toBe('Buy books')
  })

  it('should update description textarea value', () => {
    render(<AddTaskForm onSubmit={vi.fn()} submitting={false} />)
    const textarea = screen.getByPlaceholderText(/what needs to be done/i)
    fireEvent.change(textarea, { target: { value: 'Buy books for school' } })
    expect((textarea as HTMLTextAreaElement).value).toBe('Buy books for school')
  })

  it('should call onSubmit with correct data when form is valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<AddTaskForm onSubmit={onSubmit} submitting={false} />)
    fireEvent.change(screen.getByPlaceholderText(/design landing page/i), {
      target: { value: 'Buy books' },
    })
    fireEvent.change(screen.getByPlaceholderText(/what needs to be done/i), {
      target: { value: 'Buy books for school' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add task/i }))
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Buy books',
        description: 'Buy books for school',
      })
    })
  })

  it('should clear form after successful submit', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<AddTaskForm onSubmit={onSubmit} submitting={false} />)
    const titleInput = screen.getByPlaceholderText(/design landing page/i)
    const descInput = screen.getByPlaceholderText(/what needs to be done/i)
    fireEvent.change(titleInput, { target: { value: 'Buy books' } })
    fireEvent.change(descInput, { target: { value: 'Buy books for school' } })
    fireEvent.click(screen.getByRole('button', { name: /add task/i }))
    await waitFor(() => {
      expect((titleInput as HTMLInputElement).value).toBe('')
      expect((descInput as HTMLTextAreaElement).value).toBe('')
    })
  })
})