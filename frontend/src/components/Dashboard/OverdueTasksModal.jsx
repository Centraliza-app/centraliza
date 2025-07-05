import React from 'react';
import './OverdueTasksModal.css'; // Estilos específicos para este modal

// Função para formatar a data de forma amigável
const formatDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00'); // Trata a data como local
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const OverdueTasksModal = ({ isOpen, onClose, tasks }) => {
  // Não renderiza nada se o modal não estiver aberto
  if (!isOpen) {
    return null;
  }

  return (
    // O overlay escuro que cobre a tela
    <div className="modal-overlay" onClick={onClose}>
      {/* O conteúdo do modal */}
      <div className="modal overdue-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Tarefas Atrasadas</h2>
        <p>Estas são as tarefas que já passaram do prazo e não foram concluídas.</p>
        
        <ul className="overdue-task-list">
          {tasks.map(task => (
            <li key={task.id} className="overdue-task-item">
              <div className="task-details">
                <strong>{task.nome}</strong>
                <span>Vencimento: {formatDate(task.dataFim)}</span>
              </div>
              <span className={`task-status-badge status-${task.status.toLowerCase().replace(' ', '-')}`}>
                {task.status}
              </span>
            </li>
          ))}
        </ul>

        <button className="cta-button close-btn" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default OverdueTasksModal;