package com.centraliza.controller;

import com.centraliza.dto.TarefaRequestDTO;
import com.centraliza.dto.TarefaResponseDTO;
import com.centraliza.model.Tarefa;
import com.centraliza.model.Usuario;
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
@RequestMapping("/tarefas")
@Tag(name = "Tarefas", description = "Gerenciamento de Tarefas do Usuário")
@SecurityRequirement(name = "bearerAuth")
public class TarefaController {

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Busca o objeto Usuario completo do banco de dados a partir
     * das informações de autenticação fornecidas pelo Spring Security.
     */
    private Usuario getUsuarioLogado(UserDetails userDetails) {
        return usuarioRepository.findByUsuario(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado ou não autorizado."));
    }

    @GetMapping
    @Operation(summary = "Listar Minhas Tarefas", description = "Retorna uma lista de todas as tarefas pertencentes ao usuário autenticado.")
    public List<TarefaResponseDTO> listarTarefas(@AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = getUsuarioLogado(userDetails);
        return tarefaRepository.findByUsuario(usuario)
                .stream()
                .map(TarefaResponseDTO::new) // Converte cada Tarefa para TarefaResponseDTO
                .collect(Collectors.toList());
    }

    @PostMapping
    @Operation(summary = "Criar Tarefa", description = "Cria uma nova tarefa e a associa ao usuário autenticado.")
    public ResponseEntity<TarefaResponseDTO> criarTarefa(@RequestBody @Valid TarefaRequestDTO tarefaDTO, @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = getUsuarioLogado(userDetails);

        Tarefa novaTarefa = new Tarefa();
        novaTarefa.setNome(tarefaDTO.nome());
        novaTarefa.setDescricao(tarefaDTO.descricao());
        novaTarefa.setDataInicio(tarefaDTO.dataInicio());
        novaTarefa.setDataFim(tarefaDTO.dataFim());
        novaTarefa.setStatus(tarefaDTO.status());
        novaTarefa.setUsuario(usuario);

        Tarefa tarefaSalva = tarefaRepository.save(novaTarefa);
        
        // Retorna o DTO de resposta com status 201 CREATED
        return ResponseEntity.status(HttpStatus.CREATED).body(new TarefaResponseDTO(tarefaSalva));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter Minha Tarefa por ID", description = "Retorna uma tarefa específica, se ela pertencer ao usuário autenticado.")
    public TarefaResponseDTO obterTarefa(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = getUsuarioLogado(userDetails);
        Tarefa tarefa = tarefaRepository.findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário."));
        return new TarefaResponseDTO(tarefa);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar Minha Tarefa", description = "Atualiza uma tarefa existente, se ela pertencer ao usuário autenticado.")
    public TarefaResponseDTO atualizarTarefa(@PathVariable Long id, @RequestBody @Valid TarefaRequestDTO tarefaAtualizadaDTO, @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = getUsuarioLogado(userDetails);

        Tarefa tarefaExistente = tarefaRepository.findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário."));

        tarefaExistente.setNome(tarefaAtualizadaDTO.nome());
        tarefaExistente.setDescricao(tarefaAtualizadaDTO.descricao());
        tarefaExistente.setStatus(tarefaAtualizadaDTO.status());
        tarefaExistente.setDataInicio(tarefaAtualizadaDTO.dataInicio());
        tarefaExistente.setDataFim(tarefaAtualizadaDTO.dataFim());

        Tarefa tarefaSalva = tarefaRepository.save(tarefaExistente);
        return new TarefaResponseDTO(tarefaSalva);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Excluir Minha Tarefa", description = "Exclui uma tarefa, se ela pertencer ao usuário autenticado.")
    public void excluirTarefa(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = getUsuarioLogado(userDetails);

        if (!tarefaRepository.existsByIdAndUsuario(id, usuario)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário.");
        }
        
        tarefaRepository.deleteById(id);
    }
}