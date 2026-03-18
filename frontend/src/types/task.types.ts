//task

export interface Task {
    id: number;
    title: string;
    description: string;
    completed:boolean;
    createdAt: string;
}

//standard API response format

export interface ApiResponse<T> {
    data: T;
    message?: string;
    statusCode: number;
}

//request body for creating a task
export interface CreateTaskRequest {
    title: string;
    description: string;
}