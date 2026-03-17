package com.mbtech.task_service.exception;

import com.mbtech.task_service.dto.StandardResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<StandardResponseDTO<Object>> handleResourceNotFoundException(
            TaskNotFoundException ex) {
        return new ResponseEntity<>(
                StandardResponseDTO.builder()
                        .message(ex.getMessage())
                        .statusCode(HttpStatus.NOT_FOUND.value())
                        .build(),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardResponseDTO<Object>> handleGenericException(Exception ex) {
        log.error("Unhandled exception", ex);
        return new ResponseEntity<>(
                StandardResponseDTO.builder()
                        .message("An unexpected error occurred. Please try again later.")
                        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .build(),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<StandardResponseDTO<Object>> handleValidationException(
            MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return new ResponseEntity<>(
                StandardResponseDTO.builder()
                        .message(errors)
                        .statusCode(HttpStatus.BAD_REQUEST.value())
                        .build(),
                HttpStatus.BAD_REQUEST);
    }
}
