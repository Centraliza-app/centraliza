// src/components/TarefaListView.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CriarSubtarefaForm from './CriarSubtarefaForm';
import { listarSubtarefasPorTarefa } from '../services/apiService';

const TarefaListView = ({ tarefas }) => {
  // Estado para controlar qual tarefa está com o formulário de subtarefa aberto (id da tarefa)
  const [showSubFormFor, setShowSubFormFor] = useState(null);
  // Estado para armazenar as subtarefas da tarefa selecionada
  const [subtarefas, setSubtarefas] = useState([]);
  // Estado para exibir carregamento enquanto busca as subtarefas
  const [loadingSub, setLoadingSub] = useState(false);

  // useEffect roda quando showSubFormFor muda
  // Sempre que um formulário for aberto, carrega as subtarefas da tarefa correspondente
  useEffect(() => {
    if (showSubFormFor) {
      console.log("Buscando subtarefas para a tarefa:", showSubFormFor); // DEBUG
      setLoadingSub(true);
      listarSubtarefasPorTarefa(showSubFormFor)
        .then(res => {
          console.log("Resposta recebida do backend:", res.data); // DEBUG
          setSubtarefas(res.data);
        })
        .catch((e) => {
          console.error("Erro ao buscar subtarefas:", e); // DEBUG
          setSubtarefas([]);
        })
        .finally(() => setLoadingSub(false));
    }
  }, [showSubFormFor]);

  // Função para atualizar as subtarefas após criar uma nova
  const handleSubtarefaCriada = () => {
    listarSubtarefasPorTarefa(showSubFormFor)
      .then(res => setSubtarefas(res.data))
      .catch(() => setSubtarefas([]));
  };

  // Mensagem caso não haja tarefas
  if (!tarefas || tarefas.length === 0) {
    return <p>Você não possui tarefas à fazer.</p>;
  }

  return (
    <ul>
      {tarefas.map((tarefa) => (
        <li key={tarefa.id} style={{ position: 'relative', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong>{tarefa.nome}</strong> – {tarefa.descricao}<br />
              Início: {tarefa.dataInicio} | Fim: {tarefa.dataFim} | Status: {tarefa.status}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Botão para acessar o Kanban da tarefa */}
              <Link to={`/kanban/${tarefa.id}`}>
                <button style={{ marginRight: 8 }}>Ver Kanban</button>
              </Link>
              {/* Três pontinhos para abrir/criar subtarefa */}
              <span
                style={{ cursor: 'pointer', padding: '0 8px', fontSize: 22 }}
                onClick={() => setShowSubFormFor(showSubFormFor === tarefa.id ? null : tarefa.id)}
                title="Mais opções"
              >
                &#8942;
              </span>
            </div>
          </div>
          {/* Renderiza o formulário de subtarefa e a listagem abaixo dele, se aberto para esta tarefa */}
          {showSubFormFor === tarefa.id && (
            <div>
              {/* Passa o id da tarefa para o formulário, garantindo associação automática */}
              <CriarSubtarefaForm
                tarefaId={tarefa.id}
                onSubtarefaCriada={handleSubtarefaCriada}
                onClose={() => setShowSubFormFor(null)}
              />
              <div style={{ marginTop: 12, paddingLeft: 10 }}>
                <h4>Subtarefas</h4>
                {/* Exibe carregando, lista ou mensagem de vazio */}
                {loadingSub ? (
                  <p>Carregando...</p>
                ) : subtarefas.length === 0 ? (
                  <p>Sem subtarefas.</p>
                ) : (
                  <ul style={{ listStyleType: 'circle', paddingLeft: 20 }}>
                    {subtarefas.map(sub => (
                      <li key={sub.id} style={{ marginBottom: 4 }}>
                        {/* Use subNome para o campo de nome da subtarefa */}
                        <strong>{sub.subNome}</strong> — {sub.descricao} [{sub.status}]
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TarefaListView;
