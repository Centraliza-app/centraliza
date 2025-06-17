package com.centraliza.controller;

import com.centraliza.config.security.TokenService;
import com.centraliza.dto.LoginRequestDTO;
import com.centraliza.dto.LoginResponseDTO;
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

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequestDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.usuario(), data.senha());
        
        var auth = this.authenticationManager.authenticate(usernamePassword);
        
        // --- LINHA CORRIGIDA: REMOVIDO O CAST (Usuario) ---
        // auth.getPrincipal() já retorna um UserDetails, que nosso TokenService agora aceita
        var token = tokenService.generateToken((UserDetails) auth.getPrincipal());
        
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }
}