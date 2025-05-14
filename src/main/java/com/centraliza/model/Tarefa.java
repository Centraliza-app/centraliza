package com.centraliza.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "tarefas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@ToString(exclude = "subtarefas")
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "data_inicio", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dataInicio;

    @Column(name = "data_fim", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dataFim;

    @Column(name = "status", nullable = false)
    private String status;

    @OneToMany(mappedBy = "tarefa", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Subtarefa> subtarefas;
}
