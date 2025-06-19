// Crie o arquivo: src/main/java/com/centraliza/dto/SubtarefaResponseDTO.java
package com.centraliza.dto;

import com.centraliza.model.Subtarefa;

public record SubtarefaResponseDTO(
    Long subId,
    String subNome,
    String descricao,
    String status
) {
    // Construtor que facilita a conversão da Entidade para o DTO
    public SubtarefaResponseDTO(Subtarefa subtarefa) {
        this(
            subtarefa.getSubId(),
            subtarefa.getSubNome(),
            subtarefa.getDescricao(),
            subtarefa.getStatus()
        );
    }
}