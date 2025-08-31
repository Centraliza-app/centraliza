package com.centraliza.dto;

import java.time.LocalDateTime;

public record PomodoroSessionRequestDTO(
        Long tarefaId,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Integer duration
) {
}