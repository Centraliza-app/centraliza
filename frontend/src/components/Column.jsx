import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import SubtaskCard from './SubtarefaCard';

const Column = ({ status, tasks, onDelete }) => {
  const { setNodeRef } = useDroppable({ id: status });

  const columnStyle = {
    flex: 1,
    background: '#f4f4f4',
    borderRadius: 8,
    padding: 12,
    minHeight: 300,
    minWidth: 250,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <div ref={setNodeRef} style={columnStyle}>
        <h3 style={{ textAlign: 'center', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #ddd' }}>{status}</h3>
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
  );
};

export default Column;