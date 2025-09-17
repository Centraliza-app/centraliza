package com.centraliza.model;

import com.centraliza.model.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tarefas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@ToString(exclude = {"subtarefas", "usuario"}) // Evita loops de serialização
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
    // @Temporal(TemporalType.DATE)
    private LocalDate dataInicio;

    @Column(name = "data_fim", nullable = false)
    // @Temporal(TemporalType.DATE)
    private LocalDate dataFim;


    //Metadados de Criação e Conclusão da tarefa
    @Setter(AccessLevel.NONE) //impede que seja modificado por usuários
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDate dataCriacao;

    @Setter(AccessLevel.NONE) //impede que seja modificado por usuários
    @Column(name = "data_conclusao")
    private LocalDate dataConclusao;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @PrePersist
    protected void onCreate() {
        // Atribui a data atual ao criar a tarefa
        if (this.dataCriacao == null) {
            this.dataCriacao = LocalDate.now();
        }
        // Se a tarefa já for criada como concluída, já atribui a data de conclusao tb
        this.dataConclusao = (this.status == Status.CONCLUIDO) ? LocalDate.now() : null;
    }

    //Verifica sempre que a tarefa sofre alguma mopdificação
    @PreUpdate
    protected void onUpdate() {
        // Se for marcada como concluído, atualiza a adata de conclusao. Se for desmarcado como concluido, nulifica 
        if (this.status == Status.CONCLUIDO) {
            if (this.dataConclusao == null) this.dataConclusao = LocalDate.now();
        } else {
            this.dataConclusao = null;
        }
    }

    @Column(name = "urgente")
    private Boolean urgente;

    @Column(name = "importante")
    private Boolean importante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "tarefa", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Subtarefa> subtarefas;

    @OneToMany(mappedBy = "tarefa", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PomodoroSession> pomodoroSessions;
}