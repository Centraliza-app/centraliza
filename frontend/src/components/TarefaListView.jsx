import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CriarSubtarefaForm from './CriarSubtarefaForm';
import EditarTarefaForm from './EditarTarefaForm'; 
import { listarSubtarefasPorTarefa, deletarTarefa } from '../services/apiService';

const TarefaListView = ({ tarefas, onTarefaDeletada, onTarefaAtualizada }) => {
  const [showSubFor, setShowSubFor] = useState(null);       // Controla expansão da lista
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
          <li key={tarefa.id} className="tarefa-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <strong>{tarefa.nome}</strong> – {tarefa.descricao}<br />
                Início: {tarefa.dataInicio} | Fim: {tarefa.dataFim} | Status: {tarefa.status}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: '10px' }}>
                <Link to={`/kanban/${tarefa.id}`} className="cta-button small">Kanban</Link>
                <button
                  className="cta-button small"
                  onClick={() => setShowSubFor(showSubFor === tarefa.id ? null : tarefa.id)}
                >
                  {showSubFor === tarefa.id ? 'Ocultar subtarefas' : 'Mostrar subtarefas'}
                </button>
                {/* ALTERAÇÃO: O botão "Criar Sub" foi removido daqui. */}
                <button
                  className="cta-button small"
                  style={{ backgroundColor: '#1E88E5' }} // Cor azul para edição
                  onClick={() => setTarefaParaEditar(tarefa)} // Define a tarefa a ser editada, abrindo o modal
                >
                  Editar
                </button>
                <button
                  className="cta-button small"
                  style={{ backgroundColor: '#c62828' }} // Cor vermelha para indicar perigo
                  onClick={() => handleDeletarTarefa(tarefa.id)}
                >
                  Excluir
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