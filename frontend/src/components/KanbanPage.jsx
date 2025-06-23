import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listarSubtarefasPorTarefa, deletarSubtarefa } from '../services/apiService';
import CriarSubtarefaForm from './CriarSubtarefaForm';

const statusList = ['A FAZER', 'EM EXECUÇÃO', 'CONCLUÍDO'];

const KanbanPage = () => {
  const { tarefaId } = useParams();
  const navigate = useNavigate();

  const [subtarefas, setSubtarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const carregarSubtarefas = async () => {
    try {
      const res = await listarSubtarefasPorTarefa(tarefaId);
      setSubtarefas(res.data);
    } catch (error) {
      console.error('Erro ao carregar subtarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarSubtarefas();
  }, [tarefaId]);

  const handleDeleteSubtarefa = async (subtarefaId) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta subtarefa?");
    if (confirmDelete) {
      try {
        await deletarSubtarefa(tarefaId, subtarefaId);
        carregarSubtarefas();
      } catch (error) {
        console.error('Erro ao deletar subtarefa:', error);
        alert('Falha ao excluir a subtarefa.');
      }
    }
  };

  const getSubtarefasByStatus = (status) =>
    subtarefas.filter(
      (sub) => (sub.status || '').toUpperCase() === status
    );

  return (
    <>
      <div className="tarefas-container">
        <div className="tarefas-header">
          <h1 className="tarefas-title">Kanban da Tarefa</h1>
          {/* Botões do cabeçalho */}
          <div>
            <button className="cta-button" onClick={() => setShowModal(true)}>
              Criar Nova Subtarefa
            </button>
            <button className="cta-button small" onClick={() => navigate('/tarefas')} style={{marginLeft: '10px'}}>
              ← Voltar para Tarefas
            </button>
          </div>
        </div>

        {loading ? (
          <p>Carregando subtarefas...</p>
        ) : (
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {statusList.map((status) => (
              <div
                key={status}
                style={{
                  flex: 1,
                  background: '#f4f4f4',
                  borderRadius: 8,
                  padding: 12,
                  minHeight: 300,
                  minWidth: 250,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <h3 style={{ textAlign: 'center', marginBottom: 12 }}>{status}</h3>
                {getSubtarefasByStatus(status).length === 0 ? (
                  <p style={{ color: '#aaa', textAlign: 'center' }}>Sem subtarefas</p>
                ) : (
                  getSubtarefasByStatus(status).map((sub) => (
                    <div
                      key={sub.subId}
                      style={{
                        background: 'white',
                        padding: '10px 15px',
                        borderRadius: 6,
                        boxShadow: '0 2px 8px #0001',
                        marginBottom: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <strong>{sub.subNome}</strong>
                        <div>{sub.descricao}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteSubtarefa(sub.subId)}
                        title="Excluir subtarefa"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#888',
                          fontSize: '24px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          padding: '0 5px',
                          lineHeight: '1',
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para criar nova subtarefa */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Criar Nova Subtarefa</h2>
            <CriarSubtarefaForm
              tarefaId={tarefaId}
              onSubtarefaCriada={() => {
                carregarSubtarefas();
                setShowModal(false);
              }}
              onClose={() => setShowModal(false)}
            />
             <button className="cta-button close-btn" onClick={() => setShowModal(false)} style={{width: '100%', marginTop: '10px'}}>
                Cancelar
              </button>
          </div>
        </div>
      )}
    </>
  );
};

export default KanbanPage;