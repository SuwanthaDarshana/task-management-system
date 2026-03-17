package com.mbtech.task_service.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StandardResponseDTO <T>{

    private T data;
    private String message;
    private int statusCode;

}
