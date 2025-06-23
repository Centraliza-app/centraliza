import React, { useState } from 'react';
import { criarTarefa } from '../services/apiService';

const CriarTarefaForm = ({ onTarefaCriada }) => {
  const [tarefa, setTarefa] = useState({
    nome: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    status: ''
  });

  const handleChange = (e) => {
    setTarefa({ ...tarefa, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await criarTarefa(tarefa);
      onTarefaCriada();
      setTarefa({ nome: '', descricao: '', dataInicio: '', dataFim: '', status: '' });
    } catch (err) {
      console.error('Erro ao criar tarefa:', err);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <input name="nome" placeholder="Nome" value={tarefa.nome} onChange={handleChange} required />
      <input name="descricao" placeholder="Descrição" value={tarefa.descricao} onChange={handleChange} />
      <input type="date" name="dataInicio" value={tarefa.dataInicio} onChange={handleChange} required />
      <input type="date" name="dataFim" value={tarefa.dataFim} onChange={handleChange} required />
      <input name="status" placeholder="Status" value={tarefa.status} onChange={handleChange} required />
      <button type="submit" className="cta-button">Criar Tarefa</button>
    </form>
  );
};

export default CriarTarefaForm;