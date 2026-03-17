package com.mbtech.task_service.service;

import com.mbtech.task_service.dto.TaskRequestDTO;
import com.mbtech.task_service.dto.TaskResponseDTO;

import java.util.List;

public interface TaskService {

    TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO);
    List<TaskResponseDTO> getRecentTasks();
    TaskResponseDTO completeTask(Long id);
}
