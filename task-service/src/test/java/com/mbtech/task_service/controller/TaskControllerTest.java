package com.mbtech.task_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mbtech.task_service.dto.TaskRequestDTO;
import com.mbtech.task_service.dto.TaskResponseDTO;
import com.mbtech.task_service.exception.TaskNotFoundException;
import com.mbtech.task_service.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskController.class)
@ActiveProfiles("test")
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private TaskService taskService;

    private TaskResponseDTO taskResponseDTO;

    @BeforeEach
    void setUp() {
        taskResponseDTO = TaskResponseDTO.builder()
                .id(1L)
                .title("Buy books")
                .description("Buy books for school")
                .completed(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    // POST /api/v1/tasks

    @Test
    void createTask_ShouldReturn201_WhenValidRequest() throws Exception {
        when(taskService.createTask(any(TaskRequestDTO.class))).thenReturn(taskResponseDTO);

        TaskRequestDTO request = new TaskRequestDTO("Buy books", "Buy books for school");

        mockMvc.perform(post("/api/v1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.statusCode").value(201))
                .andExpect(jsonPath("$.message").value("Task Created Successfully"))
                .andExpect(jsonPath("$.data.title").value("Buy books"));
    }

    @Test
    void createTask_ShouldReturn400_WhenTitleIsBlank() throws Exception {
        TaskRequestDTO request = new TaskRequestDTO("", "Buy books for school");

        mockMvc.perform(post("/api/v1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.statusCode").value(400));
    }

    @Test
    void createTask_ShouldReturn400_WhenDescriptionIsBlank() throws Exception {
        TaskRequestDTO request = new TaskRequestDTO("Buy books", "");

        mockMvc.perform(post("/api/v1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.statusCode").value(400));
    }

    // --- GET /api/v1/tasks/recent ---

    @Test
    void getRecentTasks_ShouldReturn200_WithTaskList() throws Exception {
        when(taskService.getRecentTasks()).thenReturn(List.of(taskResponseDTO));

        mockMvc.perform(get("/api/v1/tasks/recent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusCode").value(200))
                .andExpect(jsonPath("$.data[0].title").value("Buy books"))
                .andExpect(jsonPath("$.data.length()").value(1));
    }

    @Test
    void getRecentTasks_ShouldReturn200_WithEmptyList() throws Exception {
        when(taskService.getRecentTasks()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/tasks/recent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    // --- PATCH /api/v1/tasks/{id}/complete ---

    @Test
    void completeTask_ShouldReturn200_WhenTaskExists() throws Exception {
        when(taskService.completeTask(1L)).thenReturn(taskResponseDTO);

        mockMvc.perform(patch("/api/v1/tasks/1/complete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusCode").value(200))
                .andExpect(jsonPath("$.message").value("Task Marked As Completed"));
    }

    @Test
    void completeTask_ShouldReturn404_WhenTaskNotFound() throws Exception {
        when(taskService.completeTask(99L))
                .thenThrow(new TaskNotFoundException("task not found with id : 99"));

        mockMvc.perform(patch("/api/v1/tasks/99/complete"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.statusCode").value(404))
                .andExpect(jsonPath("$.message").value("task not found with id : 99"));
    }

    @Test
    void completeTask_ShouldReturn500_WhenUnexpectedErrorOccurs() throws Exception {
        when(taskService.completeTask(1L))
                .thenThrow(new RuntimeException("Unexpected error"));

        mockMvc.perform(patch("/api/v1/tasks/1/complete"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.statusCode").value(500));
    }


}
