package com.centraliza.repository;

import com.centraliza.model.Tarefa;
import com.centraliza.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.centraliza.model.enums.Status;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TarefaRepository extends JpaRepository<Tarefa, Long> {

    List<Tarefa> findByUsuario(Usuario usuario);

    Optional<Tarefa> findByIdAndUsuario(Long id, Usuario usuario);
    
    boolean existsByIdAndUsuario(Long id, Usuario usuario);

    @Query("SELECT t FROM Tarefa t JOIN FETCH t.usuario WHERE t.dataFim < :data AND t.status <> :status")
    List<Tarefa> findAllOverdueAndNotCompleted(
        @Param("data") LocalDate data, 
        @Param("status") Status status
    );
}