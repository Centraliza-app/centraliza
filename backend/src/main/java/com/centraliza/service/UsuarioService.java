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

import java.util.Optional;

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
        // O valor padrão de 'notificar' já é TRUE no modelo

        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        emailService.sendWelcomeEmail(usuarioSalvo);

        return usuarioSalvo;
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