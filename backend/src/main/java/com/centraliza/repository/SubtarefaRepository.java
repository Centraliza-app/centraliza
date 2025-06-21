package com.centraliza.repository;

import com.centraliza.model.Subtarefa;
import com.centraliza.model.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SubtarefaRepository extends JpaRepository<Subtarefa, Long> {
    // método para buscar todas as subtarefas de uma tarefa específica
    List<Subtarefa> findByTarefa_Id(Long tarefaId);

    // método para buscar uma subtarefa por ID e tarefa
    Optional<Subtarefa> findBySubIdAndTarefa(Long subId, Tarefa tarefa);
}