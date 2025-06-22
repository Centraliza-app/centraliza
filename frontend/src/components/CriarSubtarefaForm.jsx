import React, { useState } from 'react';
import api from '../services/apiService';

const CriarSubtarefaForm = ({ tarefaId, onSubtarefaCriada, onClose }) => {
  // Estado local do formulário, já usando os nomes que o backend espera!
  const [subtarefa, setSubtarefa] = useState({
    subNome: '',     // Nome da subtarefa - deve ser subNome (não nome)
    descricao: '',
    status: ''
  });

  // Atualiza o estado conforme o usuário digita nos campos.
  const handleChange = (e) => {
    setSubtarefa({ ...subtarefa, [e.target.name]: e.target.value });
  };

  // Ao submeter o formulário, envia a requisição para o backend
  // usando o endpoint e corpo corretos.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envia para /tarefas/{tarefaId}/subtarefas com o corpo certo
      await api.post(`/tarefas/${tarefaId}/subtarefas`, subtarefa);
      onSubtarefaCriada(); // Atualiza lista de subtarefas na tarefa mãe
      setSubtarefa({ subNome: '', descricao: '', status: '' }); // Limpa formulário
      if (onClose) onClose(); // Fecha, se for o caso
    } catch (err) {
      console.error('Erro ao criar subtarefa:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: 10, marginTop: 8 }}>
      <div>
        {/* Campo para o nome da subtarefa - deve ser subNome */}
        <input
          name="subNome"
          placeholder="Nome da subtarefa"
          value={subtarefa.subNome}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          name="descricao"
          placeholder="Descrição"
          value={subtarefa.descricao}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          name="status"
          placeholder="Status"
          value={subtarefa.status}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Criar Subtarefa</button>
      <button type="button" onClick={onClose} style={{ marginLeft: 10 }}>Cancelar</button>
    </form>
  );
};

export default CriarSubtarefaForm;
