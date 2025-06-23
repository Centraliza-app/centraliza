import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CriarSubtarefaForm from './CriarSubtarefaForm';
import { listarSubtarefasPorTarefa } from '../services/apiService';

const TarefaListView = ({ tarefas }) => {
  const [showSubFor, setShowSubFor] = useState(null);       // Controla expansão da lista
  const [subtarefas, setSubtarefas] = useState([]);
  const [loadingSub, setLoadingSub] = useState(false);
  const [showModal, setShowModal] = useState(null);         // ID da tarefa que vai abrir modal

  useEffect(() => {
    if (showSubFor) {
      setLoadingSub(true);
      listarSubtarefasPorTarefa(showSubFor)
        .then(res => setSubtarefas(res.data))
        .catch(() => setSubtarefas([]))
        .finally(() => setLoadingSub(false));
    }
  }, [showSubFor]);

  const handleSubtarefaCriada = async () => {
    try {
      const res = await listarSubtarefasPorTarefa(showSubFor);
      setSubtarefas(res.data);
    } catch {
      setSubtarefas([]);
    }
  };

  return (
    <>
      <ul className="tarefa-lista">
        {tarefas.map((tarefa) => (
          <li key={tarefa.id} className="tarefa-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{tarefa.nome}</strong> – {tarefa.descricao}<br />
                Início: {tarefa.dataInicio} | Fim: {tarefa.dataFim} | Status: {tarefa.status}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/kanban/${tarefa.id}`} className="cta-button small">Ver Kanban</Link>
                <button
                  className="cta-button small"
                  onClick={() => setShowSubFor(showSubFor === tarefa.id ? null : tarefa.id)}
                >
                  {showSubFor === tarefa.id ? 'Ocultar Subtarefas' : 'Ver Subtarefas'}
                </button>
                <button
                  className="cta-button small"
                  onClick={() => setShowModal(tarefa.id)}
                >
                  Criar Subtarefa
                </button>
              </div>
            </div>

            {/* Animação de expansão */}
            <div className={`expandable ${showSubFor === tarefa.id ? 'open' : ''}`}>
              {showSubFor === tarefa.id && (
                <>
                  <h4 style={{ marginTop: 12 }}>Subtarefas</h4>
                  {loadingSub ? (
                    <p>Carregando subtarefas...</p>
                  ) : subtarefas.length === 0 ? (
                    <p>Sem subtarefas.</p>
                  ) : (
                    <ul style={{ listStyle: 'disc', paddingLeft: 20 }}>
                      {subtarefas.map((sub) => (
                        <li key={sub.id} style={{ marginBottom: 8 }}>
                          <strong>{sub.subNome}</strong> — {sub.descricao} [{sub.status}]
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>

            {/* Modal de criar subtarefa */}
            {showModal === tarefa.id && (
              <div className="modal-overlay" onClick={() => setShowModal(null)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <h2>Criar Subtarefa</h2>
                  <CriarSubtarefaForm
                    tarefaId={tarefa.id}
                    onSubtarefaCriada={handleSubtarefaCriada}
                    onClose={() => setShowModal(null)}
                  />
                  <button className="cta-button close-btn" onClick={() => setShowModal(null)}>
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default TarefaListView;
