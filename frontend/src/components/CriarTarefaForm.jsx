import React, { useState } from 'react';
import { criarTarefa } from '../services/apiService';

const CriarTarefaForm = ({ onTarefaCriada }) => {
  const [tarefa, setTarefa] = useState({
    nome: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    status: 'A FAZER', // Valor inicial padrão
    urgente: false,
    importante: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTarefa({ ...tarefa, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await criarTarefa(tarefa);
      onTarefaCriada();
      setTarefa({ nome: '', descricao: '', dataInicio: '', dataFim: '', status: 'A FAZER', urgente: false, importante: false });
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
      
      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '10px 0' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            name="urgente"
            checked={tarefa.urgente}
            onChange={handleChange}
          />
          Urgente
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            name="importante"
            checked={tarefa.importante}
            onChange={handleChange}
          />
          Importante
        </label>
      </div>
      
      <button type="submit" className="cta-button">Criar Tarefa</button>
    </form>
  );
};

export default CriarTarefaForm;