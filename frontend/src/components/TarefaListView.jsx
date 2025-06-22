import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CriarSubtarefaForm from './CriarSubtarefaForm';
import { listarSubtarefasPorTarefa } from '../services/apiService';

const TarefaListView = ({ tarefas }) => {
  const [showSubFormFor, setShowSubFormFor] = useState(null); // id da tarefa selecionada
  const [subtarefas, setSubtarefas] = useState([]); // subtarefas da tarefa aberta
  const [loadingSub, setLoadingSub] = useState(false);

  // Quando abrir o formulário, carrega as subtarefas da tarefa selecionada
  useEffect(() => {
    if (showSubFormFor) {
      setLoadingSub(true);
      listarSubtarefasPorTarefa(showSubFormFor)
        .then(res => setSubtarefas(res.data))
        .catch(() => setSubtarefas([]))
        .finally(() => setLoadingSub(false));
    }
  }, [showSubFormFor]);

  // Quando criar uma nova subtarefa, recarrega a lista
  const handleSubtarefaCriada = () => {
    listarSubtarefasPorTarefa(showSubFormFor)
      .then(res => setSubtarefas(res.data))
      .catch(() => setSubtarefas([]));
  };

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
              <Link to={`/kanban/${tarefa.id}`}>
                <button style={{ marginRight: 8 }}>Ver Kanban</button>
              </Link>
              <span
                style={{ cursor: 'pointer', padding: '0 8px', fontSize: 22 }}
                onClick={() => setShowSubFormFor(showSubFormFor === tarefa.id ? null : tarefa.id)}
                title="Mais opções"
              >
                &#8942;
              </span>
            </div>
          </div>
          {/* Se o formulário estiver aberto para essa tarefa */}
          {showSubFormFor === tarefa.id && (
            <div>
              <CriarSubtarefaForm
                tarefaId={tarefa.id}
                onSubtarefaCriada={handleSubtarefaCriada}
                onClose={() => setShowSubFormFor(null)}
              />
              <div style={{ marginTop: 12, paddingLeft: 10 }}>
                <h4>Subtarefas</h4>
                {loadingSub ? (
                  <p>Carregando...</p>
                ) : subtarefas.length === 0 ? (
                  <p>Sem subtarefas.</p>
                ) : (
                  <ul style={{ listStyleType: 'circle', paddingLeft: 20 }}>
                    {subtarefas.map(sub => (
                      <li key={sub.id} style={{ marginBottom: 4 }}>
                        <strong>{sub.nome}</strong> — {sub.descricao} [{sub.status}]
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
