package com.centraliza.controller;

import com.centraliza.dto.SubtarefaRequestDTO;
import com.centraliza.dto.SubtarefaResponseDTO;
import com.centraliza.model.Subtarefa;
import com.centraliza.model.Tarefa;
import com.centraliza.model.Usuario;
import com.centraliza.model.enums.Status; // ALTERADO: Importação do novo enum.
import com.centraliza.repository.SubtarefaRepository;
import com.centraliza.repository.TarefaRepository;
import com.centraliza.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
@RequestMapping("/tarefas/{tarefaId}/subtarefas")
@Tag(name = "Subtarefas", description = "Gerenciamento de Subtarefas")
@SecurityRequirement(name = "bearerAuth")
public class SubtarefaController {

    @Autowired
    private SubtarefaRepository subtarefaRepository;

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario getUsuarioLogado(UserDetails userDetails) {
        return usuarioRepository.findByUsuario(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado."));
    }

    @PostMapping
    @Operation(summary = "Criar Subtarefa", description = "Cria uma nova subtarefa associada a uma tarefa existente.")
    public ResponseEntity<SubtarefaResponseDTO> criarSubtarefa(
            @PathVariable Long tarefaId,
            @RequestBody @Valid SubtarefaRequestDTO subtarefaDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        Usuario usuario = getUsuarioLogado(userDetails);

        Tarefa tarefaPai = tarefaRepository.findByIdAndUsuario(tarefaId, usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário."));

        Subtarefa novaSubtarefa = new Subtarefa();
        novaSubtarefa.setSubNome(subtarefaDTO.subNome());
        novaSubtarefa.setDescricao(subtarefaDTO.descricao());
        novaSubtarefa.setStatus(Status.fromString(subtarefaDTO.status())); // ALTERADO: Converte a String do DTO para o enum.
        novaSubtarefa.setTarefa(tarefaPai);

        Subtarefa subtarefaSalva = subtarefaRepository.save(novaSubtarefa);

        return ResponseEntity.status(HttpStatus.CREATED).body(new SubtarefaResponseDTO(subtarefaSalva));
    }

    @GetMapping
    @Operation(summary = "Listar Subtarefas", description = "Lista todas as subtarefas de uma tarefa específica.")
    public List<SubtarefaResponseDTO> listarSubtarefas(@PathVariable Long tarefaId, @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = getUsuarioLogado(userDetails);

        if (!tarefaRepository.existsByIdAndUsuario(tarefaId, usuario)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário.");
        }

        return subtarefaRepository.findByTarefa_Id(tarefaId).stream()
                .map(SubtarefaResponseDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{subId}")
    @Operation(summary = "Buscar Subtarefa", description = "Busca uma subtarefa específica por ID.")
    public SubtarefaResponseDTO buscarSubtarefa(
            @PathVariable Long tarefaId,
            @PathVariable Long subId,
            @AuthenticationPrincipal UserDetails userDetails) {

        Usuario usuario = getUsuarioLogado(userDetails);

        Tarefa tarefaPai = tarefaRepository.findByIdAndUsuario(tarefaId, usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário."));

        Subtarefa subtarefa = subtarefaRepository.findBySubIdAndTarefa(subId, tarefaPai)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subtarefa não encontrada ou não pertence a esta tarefa."));

        return new SubtarefaResponseDTO(subtarefa);
    }

    @PutMapping("/{subId}")
    @Operation(summary = "Atualizar Subtarefa", description = "Atualiza uma subtarefa existente.")
    public SubtarefaResponseDTO atualizarSubtarefa(
            @PathVariable Long tarefaId,
            @PathVariable Long subId,
            @RequestBody @Valid SubtarefaRequestDTO subtarefaAtualizadaDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        Usuario usuario = getUsuarioLogado(userDetails);

        Tarefa tarefaPai = tarefaRepository.findByIdAndUsuario(tarefaId, usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário."));

        Subtarefa subtarefaExistente = subtarefaRepository.findBySubIdAndTarefa(subId, tarefaPai)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subtarefa não encontrada ou não pertence a esta tarefa."));

        subtarefaExistente.setSubNome(subtarefaAtualizadaDTO.subNome());
        subtarefaExistente.setDescricao(subtarefaAtualizadaDTO.descricao());
        subtarefaExistente.setStatus(Status.fromString(subtarefaAtualizadaDTO.status())); // ALTERADO: Converte a String do DTO para o enum.

        Subtarefa subtarefaSalva = subtarefaRepository.save(subtarefaExistente);

        return new SubtarefaResponseDTO(subtarefaSalva);
    }

    @DeleteMapping("/{subId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Excluir Subtarefa", description = "Exclui uma subtarefa existente.")
    public void excluirSubtarefa(
            @PathVariable Long tarefaId,
            @PathVariable Long subId,
            @AuthenticationPrincipal UserDetails userDetails) {

        Usuario usuario = getUsuarioLogado(userDetails);

        Tarefa tarefaPai = tarefaRepository.findByIdAndUsuario(tarefaId, usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário."));

        Subtarefa subtarefaExistente = subtarefaRepository.findBySubIdAndTarefa(subId, tarefaPai)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subtarefa não encontrada ou não pertence a esta tarefa."));

        subtarefaRepository.delete(subtarefaExistente);
    }
}