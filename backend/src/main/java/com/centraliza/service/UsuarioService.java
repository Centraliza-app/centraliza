package com.centraliza.service;

import com.centraliza.dto.UsuarioDTO;
import com.centraliza.model.Usuario;
import com.centraliza.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public Usuario registrarNovoUsuario(UsuarioDTO usuarioDTO) {
        if (usuarioRepository.findByUsuario(usuarioDTO.usuario()).isPresent()
                || usuarioRepository.findByEmail(usuarioDTO.email()).isPresent()) {
            throw new RuntimeException("Usuário ou e-mail já existente.");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setUsuario(usuarioDTO.usuario());
        novoUsuario.setNome(usuarioDTO.nome());
        novoUsuario.setSobrenome(usuarioDTO.sobrenome());
        novoUsuario.setEmail(usuarioDTO.email());
        novoUsuario.setSenha(passwordEncoder.encode(usuarioDTO.senha()));

        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        // Enviar e-mail de boas-vindas
        emailService.sendWelcomeEmail(usuarioSalvo);

        return usuarioSalvo;
    }
}