package com.centraliza.dto;

import com.centraliza.model.Tarefa;
// import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;

public record TarefaResponseDTO(
    Long id,
    String nome,
    String descricao,
    LocalDate dataInicio,
    LocalDate dataFim,
    String status,
    List<SubtarefaResponseDTO> subtarefas
) {
    public TarefaResponseDTO(Tarefa tarefa) {
        this(
            tarefa.getId(),
            tarefa.getNome(),
            tarefa.getDescricao(),
            tarefa.getDataInicio(),
            tarefa.getDataFim(),
            tarefa.getStatus() != null ? tarefa.getStatus().getValue() : null,
            // Garante que a lista não seja nula e converte cada Subtarefa para seu DTO
            tarefa.getSubtarefas() != null ?
                tarefa.getSubtarefas().stream()
                    .map(SubtarefaResponseDTO::new)
                    .collect(Collectors.toList())
                : List.of() // Retorna uma lista vazia se não houver subtarefas
        );
    }
}