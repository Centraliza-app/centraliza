package com.centraliza.service;

import com.centraliza.dto.PasswordChangeDTO;
import com.centraliza.dto.PerfilDTO;
import com.centraliza.dto.UsuarioDTO;
import com.centraliza.model.Usuario;
import com.centraliza.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

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
        novoUsuario.setEnabled(false); // A conta começa desativada

        String token = UUID.randomUUID().toString();
        novoUsuario.setVerificationToken(token);
        novoUsuario.setTokenExpiration(LocalDateTime.now().plusHours(24)); // Token válido por 24h

        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        emailService.sendActivationEmail(usuarioSalvo, token);

        return usuarioSalvo;
    }

    public void ativarConta(String token) {
        Usuario usuario = usuarioRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Token de verificação inválido."));

        if (usuario.getTokenExpiration().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token de verificação expirado.");
        }

        usuario.setEnabled(true);
        usuario.setVerificationToken(null);
        usuario.setTokenExpiration(null);
        usuarioRepository.save(usuario);
    }

    public Optional<Usuario> getUsuarioLogado() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return usuarioRepository.findByUsuario(username);
    }

    public Usuario atualizarPerfil(PerfilDTO perfilDTO) {
        return getUsuarioLogado().map(usuario -> {
            usuario.setNome(perfilDTO.nome());
            usuario.setSobrenome(perfilDTO.sobrenome());
            usuario.setNotificar(perfilDTO.notificar());
            return usuarioRepository.save(usuario);
        }).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    }

    public void alterarSenha(PasswordChangeDTO passwordChangeDTO) {
        Usuario usuario = getUsuarioLogado().orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        if (!passwordEncoder.matches(passwordChangeDTO.senhaAtual(), usuario.getSenha())) {
            throw new RuntimeException("A senha atual está incorreta.");
        }

        usuario.setSenha(passwordEncoder.encode(passwordChangeDTO.novaSenha()));
        usuarioRepository.save(usuario);
    }
}