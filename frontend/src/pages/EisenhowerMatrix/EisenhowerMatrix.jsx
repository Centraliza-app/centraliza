import React, { useState, useEffect, useMemo } from 'react';
import { listarTarefas } from '../../services/apiService';
import './EisenhowerMatrix.css';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const Quadrant = ({ title, tasks, quadrantClassName }) => (
  <div className={`eisenhower-quadrant ${quadrantClassName}`}>
    <h3 className="quadrant-title">{title}</h3>
    <div className="tasks-list">
      {tasks.length > 0 ? (
        tasks.map(task => (
          // ALTERADO: O card da tarefa agora inclui a data final.
          <div key={task.id} className="task-card">
            <div className="task-card-header">
              <strong className="task-card-title">{task.nome}</strong>
              <span className="task-card-date">Prazo: {formatDate(task.dataFim)}</span>
            </div>
            <p className="task-card-description">{task.descricao}</p>
          </div>
        ))
      ) : (
        <p className="no-tasks-message">Nenhuma tarefa aqui.</p>
      )}
    </div>
  </div>
);

const EisenhowerMatrix = () => {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const response = await listarTarefas();
        // Filtra apenas tarefas não concluídas para a matriz
        setTarefas(response.data.filter(t => t.status !== 'CONCLUÍDO'));
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
      }
      setLoading(false);
    };
    carregarDados();
  }, []);

  const quadrants = useMemo(() => {
    return {
      do: tarefas.filter(t => t.urgente && t.importante),
      schedule: tarefas.filter(t => !t.urgente && t.importante),
      delegate: tarefas.filter(t => t.urgente && !t.importante),
      eliminate: tarefas.filter(t => !t.urgente && !t.importante),
    };
  }, [tarefas]);

  if (loading) {
    return <div className="loading-message">Carregando Matriz...</div>;
  }

  return (
    <div className="eisenhower-container">
      <div className="eisenhower-header">
        <h1 className="eisenhower-title">Matriz de Eisenhower</h1>
        <p className="eisenhower-subtitle">Priorize suas tarefas com base na urgência e importância.</p>
      </div>
      <div className="eisenhower-matrix">
        <Quadrant title="Urgente e Importante (Faça Agora)" tasks={quadrants.do} quadrantClassName="do" />
        <Quadrant title="Não Urgente e Importante (Agende)" tasks={quadrants.schedule} quadrantClassName="schedule" />
        <Quadrant title="Urgente e Não Importante (Resolva Rápido ou Delegue)" tasks={quadrants.delegate} quadrantClassName="delegate" />
        <Quadrant title="Não Urgente e Não Importante (Elimine)" tasks={quadrants.eliminate} quadrantClassName="eliminate" />
      </div>
    </div>
  );
};

export default EisenhowerMatrix;