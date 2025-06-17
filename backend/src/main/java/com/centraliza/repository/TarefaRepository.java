package com.centraliza.repository;

import com.centraliza.model.Tarefa;
import com.centraliza.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TarefaRepository extends JpaRepository<Tarefa, Long> {

    List<Tarefa> findByUsuario(Usuario usuario);

    Optional<Tarefa> findByIdAndUsuario(Long id, Usuario usuario);
    
    boolean existsByIdAndUsuario(Long id, Usuario usuario);
}
