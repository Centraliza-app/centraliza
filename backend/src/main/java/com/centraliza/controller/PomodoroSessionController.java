package com.centraliza.controller;

import com.centraliza.dto.PomodoroSessionRequestDTO;
import com.centraliza.dto.PomodoroSessionResponseDTO;
import com.centraliza.model.PomodoroSession;
import com.centraliza.model.Tarefa;
import com.centraliza.model.Usuario;
import com.centraliza.repository.PomodoroSessionRepository;
import com.centraliza.repository.TarefaRepository;
import com.centraliza.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/pomodoro-sessions")
@SecurityRequirement(name = "bearerAuth")
public class PomodoroSessionController {

    @Autowired
    private PomodoroSessionRepository pomodoroSessionRepository;

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario getUsuarioLogado(UserDetails userDetails) {
        return usuarioRepository.findByUsuario(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado."));
    }

    @PostMapping
    public ResponseEntity<PomodoroSessionResponseDTO> createPomodoroSession(
            @RequestBody PomodoroSessionRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = getUsuarioLogado(userDetails);
        Tarefa tarefa = tarefaRepository.findByIdAndUsuario(requestDTO.tarefaId(), usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário."));

        PomodoroSession pomodoroSession = PomodoroSession.builder()
                .tarefa(tarefa)
                .startTime(requestDTO.startTime())
                .endTime(requestDTO.endTime())
                .duration(requestDTO.duration())
                .build();

        PomodoroSession savedSession = pomodoroSessionRepository.save(pomodoroSession);
        return ResponseEntity.status(HttpStatus.CREATED).body(new PomodoroSessionResponseDTO(savedSession));
    }

    @GetMapping("/tarefa/{tarefaId}")
    public List<PomodoroSessionResponseDTO> getPomodoroSessionsByTarefa(@PathVariable Long tarefaId, @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = getUsuarioLogado(userDetails);
        if (!tarefaRepository.existsByIdAndUsuario(tarefaId, usuario)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário.");
        }

        return pomodoroSessionRepository.findByTarefaId(tarefaId).stream()
                .map(PomodoroSessionResponseDTO::new)
                .collect(Collectors.toList());
    }
}