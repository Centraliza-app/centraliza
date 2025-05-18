import React from 'react';

const TarefaListView = ({ tarefas }) => {
  if (tarefas.length === 0) {
    return <p>Você não possui tarefas à fazer.</p>;
  }

  return (
    <ul>
      {tarefas.map((tarefa) => (
        <li key={tarefa.id}>
          <strong>{tarefa.nome}</strong> – {tarefa.descricao}<br />
          Início: {tarefa.dataInicio} | Fim: {tarefa.dataFim} | Status: {tarefa.status}
        </li>
      ))}
    </ul>
  );
};

export default TarefaListView;
