
package com.centraliza.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record SubtarefaRequestDTO(
        @NotBlank(message = "O nome da subtarefa não pode ser vazio.")
        String subNome,

        String descricao,

        @NotBlank(message = "O status não pode ser vazio.")
        @Pattern(regexp = "^(A FAZER|EM EXECUÇÃO|CONCLUÍDO)$", message = "Status inválido. Use 'A FAZER', 'EM EXECUÇÃO' ou 'CONCLUÍDO'.")
        String status
) {}