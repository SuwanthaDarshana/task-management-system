package com.mbtech.task_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskRequestDTO {

    @Schema(description = "Tile", example = "Meeting")
    @NotBlank(message = "Title is required")
    private  String title;

    @Schema(description = "description", example = "project meeting")
    @NotBlank(message = "description is required")
    private String description;


}
