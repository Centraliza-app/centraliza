import React, { useState } from 'react';
import api from '../services/apiService';

const CriarSubtarefaForm = ({ tarefaId, onSubtarefaCriada, onClose }) => {
  // ALTERADO: O status agora começa com um valor padrão válido.
  const [subtarefa, setSubtarefa] = useState({
    subNome: '',
    descricao: '',
    status: 'A FAZER'
  });

  const handleChange = (e) => {
    setSubtarefa({ ...subtarefa, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/tarefas/${tarefaId}/subtarefas`, subtarefa);
      onSubtarefaCriada();
      // ALTERADO: Limpa o formulário, redefinindo o status para o padrão.
      setSubtarefa({ subNome: '', descricao: '', status: 'A FAZER' });
      if (onClose) onClose();
    } catch (err) {
      console.error('Erro ao criar subtarefa:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" style={{ padding: 0 }}>
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
        
        {/* ALTERADO: O input de texto foi substituído por este <select> */}
        <select
          name="status"
          value={subtarefa.status}
          onChange={handleChange}
          required
        >
          <option value="A FAZER">A FAZER</option>
          <option value="EM EXECUÇÃO">EM EXECUÇÃO</option>
          <option value="CONCLUÍDO">CONCLUÍDO</option>
        </select>
      
      <button type="submit" className="cta-button">Criar Subtarefa</button>
    </form>
  );
};

export default CriarSubtarefaForm;