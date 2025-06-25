import React, { useState } from 'react';
import { criarTarefa } from '../services/apiService';

const CriarTarefaForm = ({ onTarefaCriada }) => {
  // ALTERADO: O status inicial agora é 'A FAZER' por padrão.
  const [tarefa, setTarefa] = useState({
    nome: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    status: 'A FAZER' // Valor inicial padrão
  });

  const handleChange = (e) => {
    setTarefa({ ...tarefa, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await criarTarefa(tarefa);
      onTarefaCriada();
      setTarefa({ nome: '', descricao: '', dataInicio: '', dataFim: '', status: 'A FAZER' });
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

      <select name="status" value={tarefa.status} onChange={handleChange} required>
        <option value="A FAZER">A FAZER</option>
        <option value="EM EXECUÇÃO">EM EXECUÇÃO</option>
        <option value="CONCLUÍDO">CONCLUÍDO</option>
      </select>
      
      <button type="submit" className="cta-button">Criar Tarefa</button>
    </form>
  );
};

export default CriarTarefaForm;