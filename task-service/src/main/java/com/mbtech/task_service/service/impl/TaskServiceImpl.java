package com.mbtech.task_service.service.impl;

import com.mbtech.task_service.dto.TaskRequestDTO;
import com.mbtech.task_service.dto.TaskResponseDTO;
import com.mbtech.task_service.entity.Task;
import com.mbtech.task_service.exception.TaskNotFoundException;
import com.mbtech.task_service.repository.TaskRepository;
import com.mbtech.task_service.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;


    @Override
    public TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO) {
        Task task = Task.builder()
                .title(taskRequestDTO.getTitle())
                .description(taskRequestDTO.getDescription())
                .completed(false)
                .build();

        log.info("Task created");
        return mapToDTO(taskRepository.save(task));
    }

    @Override
    public List<TaskResponseDTO> getRecentTasks() {
        return taskRepository.findTopfiveRecentIncompleteTasks()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public TaskResponseDTO completeTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(()-> new TaskNotFoundException("task not found with id : " + id));
        task.setCompleted(true);
        log.info("Task completed");
        return mapToDTO(taskRepository.save(task));
    }


    private TaskResponseDTO mapToDTO(Task task) {
        return TaskResponseDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .completed(task.isCompleted())
                .createdAt(task.getCreatedAt())
                .build();
    }

}
