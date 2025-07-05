import React from 'react';
import './ProgressCard.css';

const ProgressCard = ({ concluidas, total }) => {
  const percentual = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  return (
    <div className="progress-card">
      <div className="progress-card-header">
        <h3 className="progress-card-title">Progresso da Semana</h3>
        <span className="progress-card-percent">{percentual}%</span>
      </div>
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentual}%` }}
        ></div>
      </div>
      <p className="progress-card-summary">{concluidas} de {total} tarefas concluídas</p>
    </div>
  );
};

export default ProgressCard;