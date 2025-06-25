import React from 'react';
import './GreetingCard.css';

const GreetingCard = ({ nomeUsuario, concluidas, atrasadas }) => {
  const getGreetingMessage = () => {
    if (atrasadas > 0) {
      return `Você tem ${atrasadas} tarefa(s) atrasada(s). Vamos resolver isso?`;
    }
    if (concluidas > 5) {
      return `Uau, semana muito produtiva! Você já concluiu ${concluidas} tarefas. 🔥`;
    }
    if (concluidas > 0) {
      return `Bom trabalho! Você concluiu ${concluidas} tarefa(s) esta semana.`;
    }
    return 'Vamos começar a semana com tudo? Organize suas tarefas!';
  };

  return (
    <div className="greeting-card">
      <h2 className="greeting-title">Oi, {nomeUsuario}!</h2>
      <p className="greeting-message">{getGreetingMessage()}</p>
    </div>
  );
};

export default GreetingCard;