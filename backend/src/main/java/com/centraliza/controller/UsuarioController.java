package com.centraliza.controller;

import com.centraliza.dto.PasswordChangeDTO;
import com.centraliza.dto.PerfilDTO;
import com.centraliza.dto.PerfilResponseDTO;
import com.centraliza.dto.UsuarioDTO;
import com.centraliza.model.Usuario;
import com.centraliza.service.UsuarioService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuários", description = "Gerenciamento de Usuário")
@SecurityRequirement(name = "bearerAuth")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@RequestBody @Valid UsuarioDTO usuarioDTO) {
        try {
            Usuario novoUsuario = usuarioService.registrarNovoUsuario(usuarioDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(new PerfilResponseDTO(novoUsuario));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/perfil")
    public ResponseEntity<PerfilResponseDTO> getPerfilUsuario() {
        return usuarioService.getUsuarioLogado()
                .map(usuario -> ResponseEntity.ok(new PerfilResponseDTO(usuario)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/perfil")
    public ResponseEntity<PerfilResponseDTO> atualizarPerfilUsuario(@RequestBody @Valid PerfilDTO perfilDTO) {
        try {
            Usuario usuarioAtualizado = usuarioService.atualizarPerfil(perfilDTO);
            return ResponseEntity.ok(new PerfilResponseDTO(usuarioAtualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/alterar-senha")
    public ResponseEntity<?> alterarSenha(@RequestBody @Valid PasswordChangeDTO passwordChangeDTO) {
        try {
            usuarioService.alterarSenha(passwordChangeDTO);
            return ResponseEntity.ok().body("Senha alterada com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}