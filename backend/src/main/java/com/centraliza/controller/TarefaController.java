package com.centraliza.controller;

import com.centraliza.model.Tarefa;
import com.centraliza.model.Usuario;
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
@RequestMapping("/tarefas")
@Tag(name = "Tarefas", description = "Gerenciamento de Tarefas do Usuário")
@SecurityRequirement(name = "bearerAuth") // Adicionado para documentação do Swagger
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
    public List<Tarefa> listarTarefas(@AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = getUsuarioLogado(userDetails);
        return tarefaRepository.findByUsuario(usuario);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Criar Tarefa", description = "Cria uma nova tarefa e a associa ao usuário autenticado.")
    public Tarefa criarTarefa(@RequestBody Tarefa tarefa, @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = getUsuarioLogado(userDetails);
        tarefa.setUsuario(usuario);
        return tarefaRepository.save(tarefa);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter Minha Tarefa por ID", description = "Retorna uma tarefa específica, se ela pertencer ao usuário autenticado.")
    public Tarefa obterTarefa(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = getUsuarioLogado(userDetails);
        return tarefaRepository.findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário."));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar Minha Tarefa", description = "Atualiza uma tarefa existente, se ela pertencer ao usuário autenticado.")
    public Tarefa atualizarTarefa(@PathVariable Long id, @RequestBody Tarefa tarefaAtualizada, @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = getUsuarioLogado(userDetails);

        Tarefa tarefaExistente = tarefaRepository.findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada ou não pertence a este usuário."));

        tarefaExistente.setNome(tarefaAtualizada.getNome());
        tarefaExistente.setDescricao(tarefaAtualizada.getDescricao());
        tarefaExistente.setStatus(tarefaAtualizada.getStatus());
        tarefaExistente.setDataInicio(tarefaAtualizada.getDataInicio());
        tarefaExistente.setDataFim(tarefaAtualizada.getDataFim());

        return tarefaRepository.save(tarefaExistente);
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