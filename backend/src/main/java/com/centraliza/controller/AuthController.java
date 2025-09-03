package com.centraliza.controller;

import com.centraliza.config.security.TokenService;
import com.centraliza.dto.LoginRequestDTO;
import com.centraliza.dto.LoginResponseDTO;
import com.centraliza.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails; // Pode ser útil para clareza
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.usuario(), data.senha());
        
        var auth = this.authenticationManager.authenticate(usernamePassword);
        
        // Buscar o usuário completo para obter o nome
        var usuario = usuarioRepository.findByUsuario(data.usuario())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        var token = tokenService.generateToken((UserDetails) auth.getPrincipal());
        
        // Retornar o novo DTO com token e nome do usuário
        return ResponseEntity.ok(new LoginResponseDTO(token, usuario.getNome()));
    }
}