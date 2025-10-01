package com.centraliza.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PerfilDTO(
        @NotBlank String nome,
        @NotBlank String sobrenome,
        @NotNull Boolean notificar) {
}