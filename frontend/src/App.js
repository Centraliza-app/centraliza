import React, { useEffect, useState } from 'react';
import { listarTarefas } from './services/TarefaService';
import TarefaListView from './components/TarefaListView';
import CriarTarefaForm from './components/CriarTarefaForm';

const App = () => {
  const [tarefas, setTarefas] = useState([]);

  const carregarTarefas = async () => {
    try {
      const response = await listarTarefas();
      setTarefas(response.data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  return (
    <div className="App">
      <h1>Centraliza - Tarefas</h1>
      <CriarTarefaForm onTarefaCriada={carregarTarefas} />
      <TarefaListView tarefas={tarefas} />
    </div>
  );
};

export default App;
