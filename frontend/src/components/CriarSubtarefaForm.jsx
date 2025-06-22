import React, { useState } from 'react';
import api from '../services/apiService';

const CriarSubtarefaForm = ({ tarefaId, onSubtarefaCriada, onClose }) => {
  const [subtarefa, setSubtarefa] = useState({
    nome: '',
    descricao: '',
    status: ''
  });

  const handleChange = (e) => {
    setSubtarefa({ ...subtarefa, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/subtarefas`, { ...subtarefa, tarefaId }); // Envie o ID da tarefa associada
      onSubtarefaCriada();
      setSubtarefa({ nome: '', descricao: '', status: '' });
      if (onClose) onClose();
    } catch (err) {
      console.error('Erro ao criar subtarefa:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: 10, marginTop: 8 }}>
      <div>
        <input name="nome" placeholder="Nome da subtarefa" value={subtarefa.nome} onChange={handleChange} required />
      </div>
      <div>
        <input name="descricao" placeholder="Descrição" value={subtarefa.descricao} onChange={handleChange} />
      </div>
      <div>
        <input name="status" placeholder="Status" value={subtarefa.status} onChange={handleChange} required />
      </div>
      <button type="submit">Criar Subtarefa</button>
      <button type="button" onClick={onClose} style={{ marginLeft: 10 }}>Cancelar</button>
    </form>
  );
};

export default CriarSubtarefaForm;
