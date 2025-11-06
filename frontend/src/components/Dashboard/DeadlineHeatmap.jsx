import React from 'react';
import './DeadlineHeatmap.css';

const DeadlineHeatmap = ({ tarefas = [] }) => {

  const getStatusClass = (tarefa) => {
    const hoje = new Date();
    const dataFim = new Date(tarefa.dataFim);
    dataFim.setHours(23, 59, 59, 999); // Final do dia

    // Se a tarefa está atrasada (passada da data fim)
    if (dataFim < hoje && tarefa.status !== 'CONCLUÍDO') {
      return 'atrasado';
    }

    if (tarefa.status === 'CONCLUÍDO') {
      if (!tarefa.dataConclusao) return 'concluido-no-prazo'; // Fallback se não tiver data de conclusão
      
      const dataConclusao = new Date(tarefa.dataConclusao);
      dataConclusao.setHours(0, 0, 0, 0); // Início do dia
      const dataFimInicio = new Date(tarefa.dataFim);
      dataFimInicio.setHours(0, 0, 0, 0); // Início do dia
      
      if (dataConclusao < dataFimInicio) {
        return 'concluido-antes'; // Verde escuro
      } else if (dataConclusao.getTime() === dataFimInicio.getTime()) {
        return 'concluido-no-prazo'; // Verde claro
      } else {
        return 'atrasado'; // Vermelho (concluído após o prazo)
      }
    }
    
    return 'nao-finalizado'; // Cinza
  };
  return (
    <div className="deadline-heatmap">
      <div className="heatmap-header">
        <div className="heatmap-legend">
          <span><div className="legend-color" style={{backgroundColor: '#2ea043'}}></div>Finalizado antes do prazo</span>
          <span><div className="legend-color" style={{backgroundColor: '#9be9a8'}}></div>Finalizado no prazo</span>
          <span><div className="legend-color" style={{backgroundColor: '#ebedf0'}}></div>Não finalizado</span>
          <span><div className="legend-color" style={{backgroundColor: '#f85149'}}></div>Atrasado</span>
        </div>
      </div>
      <div className="tasks-grid">
        {tarefas.map((tarefa, idx) => (
          <div
            key={idx}
            className={`task-cell ${getStatusClass(tarefa)}`}
            title={`${tarefa.nome}
Status: ${tarefa.status}
Data limite: ${new Date(tarefa.dataFim).toLocaleDateString('pt-BR')}
${tarefa.dataConclusao ? `Concluído em: ${new Date(tarefa.dataConclusao).toLocaleDateString('pt-BR')}` : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default DeadlineHeatmap;