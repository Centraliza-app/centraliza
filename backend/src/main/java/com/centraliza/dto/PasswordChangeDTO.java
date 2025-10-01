package com.centraliza.dto;

import jakarta.validation.constraints.NotBlank;

public record PasswordChangeDTO(
        @NotBlank String senhaAtual,
        @NotBlank String novaSenha) {
}