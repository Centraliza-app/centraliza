package com.centraliza.controller;

import com.centraliza.model.Subtarefa;
import com.centraliza.model.Tarefa;
import com.centraliza.model.Usuario;
import com.centraliza.repository.SubtarefaRepository;
import com.centraliza.repository.TarefaRepository;
import com.centraliza.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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

    // Método auxiliar para buscar o usuário logado
    private Usuario getUsuarioLogado(UserDetails userDetails) {
        return usuarioRepository.findByUsuario(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado."));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Criar Subtarefa", description = "Cria uma nova subtarefa associada a uma tarefa existente.")
    public Subtarefa criarSubtarefa(
            @PathVariable Long tarefaId,
            @RequestBody Subtarefa subtarefa,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Usuario usuario = getUsuarioLogado(userDetails);

        // 1. Verifica se a tarefa PAI existe e pertence ao usuário logado
        Tarefa tarefaPai = tarefaRepository.findByIdAndUsuario(tarefaId, usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário."));

        // 2. Associa a subtarefa à sua tarefa pai
        subtarefa.setTarefa(tarefaPai);

        // 3. Salva a nova subtarefa
        return subtarefaRepository.save(subtarefa);
    }
    
    @GetMapping
    @Operation(summary = "Listar Subtarefas", description = "Lista todas as subtarefas de uma tarefa específica.")
    public List<Subtarefa> listarSubtarefas(@PathVariable Long tarefaId, @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = getUsuarioLogado(userDetails);
        
        // Garante que o usuário só possa listar subtarefas de tarefas que lhe pertencem
        if (!tarefaRepository.existsByIdAndUsuario(tarefaId, usuario)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário.");
        }
        
        return subtarefaRepository.findByTarefa_Id(tarefaId);
    }

    @GetMapping("/{subId}")
    @Operation(summary = "Buscar Subtarefa", description = "Busca uma subtarefa específica por ID.")
    public Subtarefa buscarSubtarefa(
            @PathVariable Long tarefaId,
            @PathVariable Long subId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Usuario usuario = getUsuarioLogado(userDetails);
        
        // Verifica se a tarefa PAI existe e pertence ao usuário logado
        Tarefa tarefaPai = tarefaRepository.findByIdAndUsuario(tarefaId, usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário."));

        // Busca a subtarefa pelo ID e pela tarefa pai
        return subtarefaRepository.findBySubIdAndTarefa(subId, tarefaPai)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subtarefa não encontrada ou não pertence a esta tarefa."));
    }
    @PutMapping("/{subId}")
    @Operation(summary = "Atualizar Subtarefa", description = "Atualiza uma subtarefa existente.")
    public Subtarefa atualizarSubtarefa(
            @PathVariable Long tarefaId,
            @PathVariable Long subId,
            @RequestBody Subtarefa subtarefaAtualizada,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Usuario usuario = getUsuarioLogado(userDetails);
        
        // Verifica se a tarefa PAI existe e pertence ao usuário logado
        Tarefa tarefaPai = tarefaRepository.findByIdAndUsuario(tarefaId, usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário."));

        // Busca a subtarefa existente
        Subtarefa subtarefaExistente = subtarefaRepository.findBySubIdAndTarefa(subId, tarefaPai)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subtarefa não encontrada ou não pertence a esta tarefa."));

        // Atualiza os campos da subtarefa existente
        subtarefaExistente.setSubNome(subtarefaAtualizada.getSubNome());
        subtarefaExistente.setDescricao(subtarefaAtualizada.getDescricao());
        subtarefaExistente.setStatus(subtarefaAtualizada.getStatus());

        // Salva as alterações
        return subtarefaRepository.save(subtarefaExistente);
    }
    @DeleteMapping("/{subId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Excluir Subtarefa", description = "Exclui uma subtarefa existente.")
    public void excluirSubtarefa(
            @PathVariable Long tarefaId,
            @PathVariable Long subId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Usuario usuario = getUsuarioLogado(userDetails);
        
        // Verifica se a tarefa PAI existe e pertence ao usuário logado
        Tarefa tarefaPai = tarefaRepository.findByIdAndUsuario(tarefaId, usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário."));

        // Busca a subtarefa existente
        Subtarefa subtarefaExistente = subtarefaRepository.findBySubIdAndTarefa(subId, tarefaPai)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subtarefa não encontrada ou não pertence a esta tarefa."));

        // Exclui a subtarefa
        subtarefaRepository.delete(subtarefaExistente);
    }
}