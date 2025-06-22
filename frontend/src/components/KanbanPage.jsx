// src/components/KanbanPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listarSubtarefasPorTarefa } from '../services/apiService';

const statusList = ["A FAZER", "EM EXECUÇÃO", "CONCLUÍDO"];

const KanbanPage = () => {
  const { tarefaId } = useParams();
  const [subtarefas, setSubtarefas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca as subtarefas ao carregar a página
  useEffect(() => {
    listarSubtarefasPorTarefa(tarefaId)
      .then(res => setSubtarefas(res.data))
      .finally(() => setLoading(false));
  }, [tarefaId]);

  // Organiza as subtarefas em colunas por status
  const getSubtarefasByStatus = (status) =>
    subtarefas.filter(sub => (sub.status || '').toUpperCase() === status);

  return (
    <div style={{ padding: 24 }}>
      <h2>Kanban de Subtarefas</h2>
      <Link to="/tarefas" style={{ marginBottom: 16, display: 'inline-block' }}>← Voltar para Tarefas</Link>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div style={{ display: 'flex', gap: 16 }}>
          {statusList.map(status => (
            <div key={status} style={{
              flex: 1, background: '#f4f4f4', borderRadius: 8, padding: 12, minHeight: 300
            }}>
              <h3 style={{ textAlign: 'center' }}>{status}</h3>
              {getSubtarefasByStatus(status).length === 0 && (
                <p style={{ color: '#aaa', textAlign: 'center' }}>Sem subtarefas</p>
              )}
              {getSubtarefasByStatus(status).map(sub => (
                <div key={sub.id} style={{
                  background: 'white',
                  margin: '8px 0',
                  borderRadius: 6,
                  padding: 10,
                  boxShadow: '0 2px 8px #0001'
                }}>
                  <strong>{sub.nome}</strong>
                  <div>{sub.descricao}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KanbanPage;
