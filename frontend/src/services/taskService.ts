import axios from "axios"
import type { ApiResponse, CreateTaskRequest, Task } from "../types/task.types"


const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1/tasks'

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

//POST /api/v1/tasks
const createTask = async(request:CreateTaskRequest):Promise<ApiResponse<Task>> => {
    const response = await apiClient.post<ApiResponse<Task>>('', request)
    return response.data
}

//GET /api/v1/tasks
const getRecentTasks = async():Promise<ApiResponse<Task[]>> => {
    const response = await apiClient.get<ApiResponse<Task[]>>('/recent')
    return response.data
}

// PATCH /api/v1/tasks/{id}/complete
const completeTask = async (id: number): Promise<ApiResponse<Task>> => {
  const response = await apiClient.patch<ApiResponse<Task>>(`/${id}/complete`)
  return response.data
}

const taskService = {
    createTask,
    getRecentTasks,
    completeTask
}

export default taskService