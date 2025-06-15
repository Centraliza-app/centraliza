package com.centraliza.controller;

import com.centraliza.model.Tarefa;
import com.centraliza.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/tarefas")
@Tag(name = "Tarefas", description = "Gerenciamento de Tarefas")
public class TarefaController {

    @Autowired
    private TarefaRepository tarefaRepository;

    @GetMapping
    @Operation(summary = "Listar Tarefas", description = "Retorna uma lista de todas as tarefas")
    public List<Tarefa> listarTarefas() {
        return tarefaRepository.findAll();
    }

    @PostMapping
    @Operation(summary = "Criar Tarefa", description = "Cria uma nova tarefa")
    public Tarefa criarTarefa(@RequestBody Tarefa tarefa) {
        return tarefaRepository.save(tarefa);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter Tarefa", description = "Retorna uma tarefa específica pelo ID")
    public Tarefa obterTarefa(@PathVariable Long id) {
        return tarefaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada com ID: " + id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar Tarefa", description = "Atualiza uma tarefa existente")
    public Tarefa atualizarTarefa(@PathVariable Long id, @RequestBody Tarefa tarefaAtualizada) {
        return tarefaRepository.findById(id)
                .map(tarefa -> {
                    tarefa.setNome(tarefaAtualizada.getNome());
                    tarefa.setDescricao(tarefaAtualizada.getDescricao());
                    tarefa.setStatus(tarefaAtualizada.getStatus());
                    tarefa.setDataInicio(tarefaAtualizada.getDataInicio());
                    tarefa.setDataFim(tarefaAtualizada.getDataFim());
                    return tarefaRepository.save(tarefa);
                })
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada com ID: " + id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir Tarefa", description = "Exclui uma tarefa pelo ID")
    public void excluirTarefa(@PathVariable Long id) {
        tarefaRepository.deleteById(id);
    }


}