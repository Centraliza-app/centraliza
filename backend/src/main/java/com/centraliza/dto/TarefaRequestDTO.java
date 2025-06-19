package com.centraliza.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Date;

// DTO para requisições de criação ou atualização de tarefas
public record TarefaRequestDTO(
    @NotBlank String nome,
    String descricao,
    @NotNull Date dataInicio,
    @NotNull Date dataFim,
    @NotBlank String status
) {}