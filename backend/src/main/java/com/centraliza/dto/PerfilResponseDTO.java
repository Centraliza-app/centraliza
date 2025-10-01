package com.centraliza.dto;

import com.centraliza.model.Usuario;

public record PerfilResponseDTO(
        String nome,
        String sobrenome,
        String email,
        String usuario,
        Boolean notificar) {

    public PerfilResponseDTO(Usuario usuario) {
        this(
                usuario.getNome(),
                usuario.getSobrenome(),
                usuario.getEmail(),
                usuario.getUsuario(),
                usuario.getNotificar());
    }
}