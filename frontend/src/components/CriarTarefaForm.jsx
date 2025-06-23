import React, { useState } from 'react';
import api from '../services/apiService';

const CriarSubtarefaForm = ({ tarefaId, onSubtarefaCriada, onClose }) => {
  const [subtarefa, setSubtarefa] = useState({ subNome: '', descricao: '', status: '' });

  const handleChange = (e) => setSubtarefa({ ...subtarefa, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/tarefas/${tarefaId}/subtarefas`, subtarefa);
      onSubtarefaCriada();
      setSubtarefa({ subNome: '', descricao: '', status: '' });
      onClose();
    } catch (err) {
      console.error('Erro ao criar subtarefa:', err);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} style={{ padding: 0 }}>
      <input
        name="subNome"
        placeholder="Nome da subtarefa"
        value={subtarefa.subNome}
        onChange={handleChange}
        required
      />
      <input
        name="descricao"
        placeholder="Descrição"
        value={subtarefa.descricao}
        onChange={handleChange}
      />
      <input
        name="status"
        placeholder="Status"
        value={subtarefa.status}
        onChange={handleChange}
        required
      />
      <button type="submit" className="cta-button">Criar Subtarefa</button>
    </form>
  );
};

export default CriarSubtarefaForm;
