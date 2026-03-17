package com.mbtech.task_service.controller;


import com.mbtech.task_service.dto.StandardResponseDTO;
import com.mbtech.task_service.dto.TaskRequestDTO;
import com.mbtech.task_service.dto.TaskResponseDTO;
import com.mbtech.task_service.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/tasks")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<StandardResponseDTO<TaskResponseDTO>> createTask(@Valid @RequestBody TaskRequestDTO taskRequestDTO) {
        log.info("Creating task with title: {}", taskRequestDTO.getTitle());
        TaskResponseDTO taskResponseDTO = taskService.createTask(taskRequestDTO);
        return new ResponseEntity<>(StandardResponseDTO.<TaskResponseDTO>builder()
                .data(taskResponseDTO)
                .message("Task Created Successfully")
                .statusCode(HttpStatus.CREATED.value())
                .build(),
                HttpStatus.CREATED);
    }

    @GetMapping("/recent")
    public ResponseEntity<StandardResponseDTO<List<TaskResponseDTO>>> getRecentTasks() {
        log.info("Getting recent tasks");
        List<TaskResponseDTO> tasks = taskService.getRecentTasks();
        return ResponseEntity.ok(StandardResponseDTO.<List<TaskResponseDTO>>builder()
                .data(tasks)
                .message("Task Retrived Successfully")
                .statusCode(HttpStatus.OK.value())
                .build());
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<StandardResponseDTO<TaskResponseDTO>> completeTask(@PathVariable Long id) {
        log.info("Completing task with id: {}", id);
        TaskResponseDTO task = taskService.completeTask(id);
        return ResponseEntity.ok(StandardResponseDTO.<TaskResponseDTO>builder()
                .data(task)
                .message("Task Marked As Completed")
                .statusCode(HttpStatus.OK.value())
                .build());
    }
}
