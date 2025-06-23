package com.centraliza.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.Date;

// DTO para requisições de criação ou atualização de tarefas
public record TarefaRequestDTO(
    @NotBlank String nome,
    String descricao,
    @NotNull Date dataInicio,
    @NotNull Date dataFim,
    @NotBlank(message = "O status não pode ser vazio.")
    @Pattern(regexp = "^(A FAZER|EM EXECUÇÃO|CONCLUÍDO)$", message = "Status inválido. Use 'A FAZER', 'EM EXECUÇÃO' ou 'CONCLUÍDO'.")
    String status
) {}