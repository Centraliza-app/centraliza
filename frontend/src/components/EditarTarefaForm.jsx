import React, { useState, useEffect } from 'react';
import { atualizarTarefa } from '../services/apiService';

const EditarTarefaForm = ({ tarefa, onTarefaAtualizada, onClose }) => {
  // ALTERADO: Adicionados os campos 'urgente' e 'importante' ao estado do formulário.
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    status: '',
    urgente: false,
    importante: false,
  });

  useEffect(() => {
    if (tarefa) {
      // ALTERADO: Popula os novos campos 'urgente' e 'importante' com os dados da tarefa.
      setFormData({
        nome: tarefa.nome || '',
        descricao: tarefa.descricao || '',
        dataInicio: tarefa.dataInicio ? tarefa.dataInicio.split('T')[0] : '',
        dataFim: tarefa.dataFim ? tarefa.dataFim.split('T')[0] : '',
        status: tarefa.status || 'A FAZER', // Garante um valor padrão
        urgente: tarefa.urgente || false,
        importante: tarefa.importante || false,
      });
    }
  }, [tarefa]);

  const handleChange = (e) => {
    // ALTERADO: Trata os checkboxes corretamente.
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await atualizarTarefa(tarefa.id, formData);
      alert('Tarefa atualizada com sucesso!');
      onTarefaAtualizada();
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      alert('Falha ao atualizar a tarefa.');
    }
  };

  if (!tarefa) return null;

  return (
    <form className="auth-form" onSubmit={handleSubmit} style={{ padding: 0 }}>
      <input name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
      <input name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} />
      <input type="date" name="dataInicio" value={formData.dataInicio} onChange={handleChange} required />
      <input type="date" name="dataFim" value={formData.dataFim} onChange={handleChange} required />
      
      <select name="status" value={formData.status} onChange={handleChange} required>
        <option value="A FAZER">A FAZER</option>
        <option value="EM EXECUÇÃO">EM EXECUÇÃO</option>
        <option value="CONCLUÍDO">CONCLUÍDO</option>
      </select>

      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '10px 0' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            name="urgente"
            checked={formData.urgente}
            onChange={handleChange}
          />
          Urgente
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            name="importante"
            checked={formData.importante}
            onChange={handleChange}
          />
          Importante
        </label>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button type="submit" className="cta-button" style={{ flex: 1 }}>
          Salvar Alterações
        </button>
        <button 
          type="button" 
          className="cta-button"
          onClick={onClose} 
          style={{ 
            flex: 1, 
            backgroundColor: '#c62828'
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditarTarefaForm;