package com.centraliza.dto;

import com.centraliza.model.Subtarefa;

public record SubtarefaResponseDTO(
    Long subId,
    String subNome,
    String descricao,
    String status
) {
    // ALTERADO: O construtor agora extrai o valor de string do enum 'Status'.
    public SubtarefaResponseDTO(Subtarefa subtarefa) {
        this(
            subtarefa.getSubId(),
            subtarefa.getSubNome(),
            subtarefa.getDescricao(),
            subtarefa.getStatus() != null ? subtarefa.getStatus().getValue() : null
        );
    }
}