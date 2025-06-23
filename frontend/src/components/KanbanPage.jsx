// src/components/KanbanPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listarSubtarefasPorTarefa } from '../services/apiService';

const statusList = ['A FAZER', 'EM EXECUÇÃO', 'CONCLUÍDO'];

const KanbanPage = () => {
  const { tarefaId } = useParams();
  const navigate = useNavigate();

  const [subtarefas, setSubtarefas] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getSubtarefasByStatus = (status) =>
    subtarefas.filter(
      (sub) => (sub.status || '').toUpperCase() === status
    );

  return (
    <div className="tarefas-container">
      <div className="tarefas-header">
        <h1 className="tarefas-title">Kanban da Tarefa</h1>
        <button className="cta-button small" onClick={() => navigate('/tarefas')}>
          ← Voltar para Tarefas
        </button>
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
                    key={sub.id}
                    style={{
                      background: 'white',
                      padding: 10,
                      borderRadius: 6,
                      boxShadow: '0 2px 8px #0001',
                      marginBottom: 8,
                    }}
                  >
                    <strong>{sub.subNome}</strong>
                    <div>{sub.descricao}</div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KanbanPage;
