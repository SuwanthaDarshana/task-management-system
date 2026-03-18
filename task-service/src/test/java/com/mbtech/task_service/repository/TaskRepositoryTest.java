package com.mbtech.task_service.repository;

import com.mbtech.task_service.entity.Task;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Test
    void findTopFiveRecentIncompleteTasks_ShouldReturnOnlyIncompleteTasks() {
        // Arrange
        Task incomplete = Task.builder()
                .title("Task 1").description("Desc 1").completed(false).build();
        Task completed = Task.builder()
                .title("Task 2").description("Desc 2").completed(true).build();

        taskRepository.save(incomplete);
        taskRepository.save(completed);

        // Act
        List<Task> results = taskRepository.findTopfiveRecentIncompleteTasks(PageRequest.of(0, 5));

        // Assert
        assertThat(results).hasSize(1);
        assertThat(results.get(0).isCompleted()).isFalse();
    }

    @Test
    void findTopFiveRecentIncompleteTasks_ShouldReturnMaxFive() {
        // Arrange — save 7 incomplete tasks
        for (int i = 1; i <= 7; i++) {
            taskRepository.save(Task.builder()
                    .title("Task " + i)
                    .description("Desc " + i)
                    .completed(false)
                    .build());
        }

        // Act
        List<Task> results = taskRepository.findTopfiveRecentIncompleteTasks(PageRequest.of(0, 5));

        // Assert
        assertThat(results).hasSize(5);
    }

    @Test
    void findTopFiveRecentIncompleteTasks_ShouldReturnMostRecentFirst() {
        // Arrange
        Task older = taskRepository.save(Task.builder()
                .title("Older Task").description("Desc").completed(false).build());
        Task newer = taskRepository.save(Task.builder()
                .title("Newer Task").description("Desc").completed(false).build());

        // Act
        List<Task> results = taskRepository.findTopfiveRecentIncompleteTasks(PageRequest.of(0, 5));

        // assert — newer task should come first
        assertThat(results.get(0).getTitle()).isEqualTo("Newer Task");
    }

    @Test
    void findTopFiveRecentIncompleteTasks_ShouldReturnEmpty_WhenNoTasks() {
        List<Task> results = taskRepository.findTopfiveRecentIncompleteTasks(PageRequest.of(0, 5));
        assertThat(results).isEmpty();
    }

}
