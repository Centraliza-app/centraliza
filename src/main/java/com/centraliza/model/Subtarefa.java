package com.centraliza.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subtarefas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@ToString(exclude = "tarefa")
public class Subtarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long subId;

    @Column(name = "sub_nome", nullable = false)
    private String subNome;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "status", nullable = false)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tarefa_id", nullable = false)
    private Tarefa tarefa;
}
