package com.mbtech.task_service.service;

import com.mbtech.task_service.dto.TaskRequestDTO;
import com.mbtech.task_service.dto.TaskResponseDTO;
import com.mbtech.task_service.entity.Task;
import com.mbtech.task_service.exception.TaskNotFoundException;
import com.mbtech.task_service.repository.TaskRepository;
import com.mbtech.task_service.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    private Task task;
    private TaskRequestDTO requestDTO;

    @BeforeEach
    void setUp(){
        task = Task.builder()
                .id(1L)
                .title("Buy books")
                .description("Buy books for school")
                .completed(false)
                .createdAt(LocalDateTime.now())
                .build();
        requestDTO = new TaskRequestDTO("Buy books", "Buy books for school");
    }

    // createTask

    @Test
    void createTask_ShouldReturnTaskResponseDTO() {
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponseDTO result = taskService.createTask(requestDTO);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Buy books");
        assertThat(result.getDescription()).isEqualTo("Buy books for school");
        assertThat(result.isCompleted()).isFalse();
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void createTask_ShouldSetCompletedFalseByDefault() {
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponseDTO result = taskService.createTask(requestDTO);

        assertThat(result.isCompleted()).isFalse();
    }

    // getRecentTasks

    @Test
    void getRecentTasks_ShouldReturnListOfTasks() {
        when(taskRepository.findTopfiveRecentIncompleteTasks()).thenReturn(List.of(task));

        List<TaskResponseDTO> results = taskService.getRecentTasks();

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTitle()).isEqualTo("Buy books");
        verify(taskRepository, times(1)).findTopfiveRecentIncompleteTasks();
    }

    @Test
    void getRecentTasks_ShouldReturnEmptyList_WhenNoTasks() {
        when(taskRepository.findTopfiveRecentIncompleteTasks()).thenReturn(List.of());

        List<TaskResponseDTO> results = taskService.getRecentTasks();

        assertThat(results).isEmpty();
    }

    @Test
    void getRecentTasks_ShouldReturnMaxFiveTasks() {
        List<Task> fiveTasks = List.of(task, task, task, task, task);
        when(taskRepository.findTopfiveRecentIncompleteTasks()).thenReturn(fiveTasks);

        List<TaskResponseDTO> results = taskService.getRecentTasks();

        assertThat(results).hasSize(5);
    }

    // completeTask

    @Test
    void completeTask_ShouldMarkTaskAsCompleted() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponseDTO result = taskService.completeTask(1L);

        assertThat(result).isNotNull();
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void completeTask_ShouldThrowTaskNotFoundException_WhenTaskNotFound() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.completeTask(99L))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessageContaining("99");

        verify(taskRepository, never()).save(any(Task.class));
    }




}
