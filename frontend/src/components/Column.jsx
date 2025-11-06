import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import SubtaskCard from './SubtarefaCard';

const Column = ({ status, tasks, onDelete }) => {
  const { setNodeRef } = useDroppable({ id: status });

  const getBackgroundColor = () => {
    switch (status) {
      case 'A FAZER':
        return '#ffebee'; // Vermelho pastel
      case 'EM EXECUÇÃO':
        return '#fff8e1'; // Amarelo pastel
      case 'CONCLUÍDO':
        return '#e8f5e9'; // Verde pastel
      default:
        return '#f4f4f4'; // Cor padrão
    }
  };

  const columnStyle = {
    flex: 1, 
    background: getBackgroundColor(),
    borderRadius: 8,
    padding: 12,
    minHeight: 300,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden' 
  };

  return (
    <div ref={setNodeRef} style={columnStyle}>
      <div style={{
        flexGrow: 1, 
        overflowY: 'auto', 
        overflowX: 'hidden',
        paddingRight: '5px', // Espaço para a scrollbar
        marginRight: '-5px' // Compensa o padding
      }}>
        <SortableContext id={status} items={tasks.map(t => t.subId)}>
            {tasks.length > 0 ? (
                tasks.map(task => (
                    <SubtaskCard key={task.subId} task={task} onDelete={onDelete} />
                ))
            ) : (
                <p style={{ color: '#aaa', textAlign: 'center', marginTop: '20px' }}>Sem subtarefas</p>
            )}
        </SortableContext>
      </div>
    </div>
  );
};

export default Column;