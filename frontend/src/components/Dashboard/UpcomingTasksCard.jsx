import React from 'react';
import { Clock } from 'lucide-react';
import './UpcomingTasksCard.css';

const UpcomingTasksCard = ({ tarefas }) => {
  // Função para formatar a data
  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="upcoming-tasks-card">
      <h3 className="upcoming-tasks-title">Próximas Tarefas</h3>
      <ul className="upcoming-tasks-list">
        {tarefas.length > 0 ? (
          tarefas.map(tarefa => (
            <li key={tarefa.id} className="upcoming-task-item">
              <span className="task-title">{tarefa.titulo}</span>
              <span className="task-due-date">
                <Clock size={14} />
                {formatDate(tarefa.dataFim)}
              </span>
            </li>
          ))
        ) : (
          <p className="no-upcoming-tasks">Nenhuma tarefa importante por perto. Que tal planejar a próxima?</p>
        )}
      </ul>
    </div>
  );
};

export default UpcomingTasksCard;