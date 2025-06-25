import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SubtarefaCard = ({ task, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.subId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Feedback visual ao arrastar
    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 8px #0001',
    background: 'white',
    padding: '10px 15px',
    borderRadius: 6,
    marginBottom: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div>
        <strong>{task.subNome}</strong>
        <div>{task.descricao}</div>
      </div>
      <button
        onClick={(e) => {
            e.stopPropagation(); // Impede que o clique acione o drag
            onDelete(task.subId);
        }}
        title="Excluir subtarefa"
        style={{
            background: 'none', border: 'none', color: '#888',
            fontSize: '24px', fontWeight: 'bold', cursor: 'pointer',
            padding: '0 5px', lineHeight: '1',
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default SubtarefaCard;