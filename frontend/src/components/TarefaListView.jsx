import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CriarSubtarefaForm from './CriarSubtarefaForm';
import EditarTarefaForm from './EditarTarefaForm'; 
import { listarSubtarefasPorTarefa, deletarTarefa } from '../services/apiService';

const TarefaListView = ({ tarefas, onTarefaDeletada, onTarefaAtualizada }) => {
  const [showSubFor, setShowSubFor] = useState(null);
  const [subtarefas, setSubtarefas] = useState([]);
  const [loadingSub, setLoadingSub] = useState(false);
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null);

  useEffect(() => {
    if (showSubFor) {
      setLoadingSub(true);
      listarSubtarefasPorTarefa(showSubFor)
        .then(res => setSubtarefas(res.data))
        .catch(() => setSubtarefas([]))
        .finally(() => setLoadingSub(false));
    }
  }, [showSubFor]);

  const handleDeletarTarefa = async (tarefaId) => {
    const confirmado = window.confirm("Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.");
    
    if (confirmado) {
      try {
        await deletarTarefa(tarefaId);
        alert('Tarefa excluída com sucesso!');
        if (onTarefaDeletada) {
          onTarefaDeletada();
        }
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        alert('Não foi possível excluir a tarefa.');
      }
    }
  };

  const handleTarefaAtualizada = () => {
    setTarefaParaEditar(null); // Fecha o modal
    if (onTarefaAtualizada) {
      onTarefaAtualizada(); // Recarrega a lista de tarefas
    }
  };

  return (
    <>
      <ul className="tarefa-lista">
        {tarefas.map((tarefa) => (
          <li 
            key={tarefa.id} 
            className="tarefa-item"
            style={{
              backgroundColor: '#fff',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.03)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
          >
            <div 
              onClick={() => setShowSubFor(showSubFor === tarefa.id ? null : tarefa.id)}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                flexWrap: 'wrap',
                cursor: 'pointer',
                position: 'relative',
                padding: '10px'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      transform: `rotate(${showSubFor === tarefa.id ? '180deg' : '0deg'})`,
                      transition: 'transform 0.3s ease',
                      display: 'inline-block',
                      color: '#666'
                    }}
                  >
                    ▼
                  </div>
                  <strong>{tarefa.nome}</strong>
                </div>
                <div style={{ marginLeft: '24px' }}>
                  {tarefa.descricao}<br />
                  Início: {tarefa.dataInicio} | Fim: {tarefa.dataFim} | Status: {tarefa.status}
                  
                  <div className="task-tags-container">
                    {tarefa.urgente && <span className="task-tag urgent">Urgente</span>}
                    {tarefa.importante && <span className="task-tag important">Importante</span>}
                  </div>
                </div>
              </div>
              <div 
                style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: '10px' }}
                onClick={(e) => e.stopPropagation()} // Previne que os cliques nos botões disparem a expansão
              >
                <Link to={`/kanban/${tarefa.id}`} className="cta-button small">Kanban</Link>
                <button
                  className="cta-button small"
                  style={{ backgroundColor: '#1E88E5' }}
                  onClick={() => setTarefaParaEditar(tarefa)}
                >
                  Editar
                </button>
                <button
                  className="cta-button small"
                  style={{ backgroundColor: '#c62828' }}
                  onClick={() => handleDeletarTarefa(tarefa.id)}
                >
                  Excluir
                </button>
              </div>
            </div>

            <div style={{
              overflow: 'hidden',
              maxHeight: showSubFor === tarefa.id ? '500px' : '0',
              opacity: showSubFor === tarefa.id ? 1 : 0,
              transition: 'all 0.3s ease-in-out',
              marginLeft: '34px',
              paddingRight: '10px'
            }}>
              {showSubFor === tarefa.id && (
                <div style={{ padding: '10px 0' }}>
                  <h4 style={{ marginBottom: '10px' }}>Subtarefas</h4>
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
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      
      {/* Modal de editar tarefa */}
      {tarefaParaEditar && (
        <div className="modal-overlay" onClick={() => setTarefaParaEditar(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Tarefa</h2>
            <EditarTarefaForm
              tarefa={tarefaParaEditar}
              onTarefaAtualizada={handleTarefaAtualizada}
              onClose={() => setTarefaParaEditar(null)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TarefaListView;