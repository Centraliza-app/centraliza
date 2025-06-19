// Crie o arquivo: src/main/java/com/centraliza/dto/SubtarefaRequestDTO.java
package com.centraliza.dto;

import jakarta.validation.constraints.NotBlank;

public record SubtarefaRequestDTO(
    @NotBlank(message = "O nome da subtarefa não pode ser vazio.")
    String subNome,

    String descricao,

    @NotBlank(message = "O status não pode ser vazio.")
    String status
) {}