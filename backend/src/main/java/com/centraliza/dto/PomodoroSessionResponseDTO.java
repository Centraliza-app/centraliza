package com.centraliza.dto;

import com.centraliza.model.PomodoroSession;

import java.time.LocalDateTime;

public record PomodoroSessionResponseDTO(
        Long id,
        Long tarefaId,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Integer duration
) {
    public PomodoroSessionResponseDTO(PomodoroSession pomodoroSession) {
        this(
                pomodoroSession.getId(),
                pomodoroSession.getTarefa().getId(),
                pomodoroSession.getStartTime(),
                pomodoroSession.getEndTime(),
                pomodoroSession.getDuration()
        );
    }
}