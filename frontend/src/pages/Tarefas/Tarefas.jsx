import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CriarTarefaForm from '../../components/CriarTarefaForm';
import TarefaListView from '../../components/TarefaListView';
import { listarTarefas } from '../../services/apiService';

const Tarefas = () => {
  const navigate = useNavigate();
  const [tarefas, setTarefas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  const carregarTarefas = async () => {
    try {
      const response = await listarTarefas();
      setTarefas(response.data); // <- aplicação correta da sua sugestão
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  const abrirModal = () => setMostrarModal(true);
  const fecharModal = () => setMostrarModal(false);

  return (
    <main className="hero">
      <h1>Minhas Tarefas</h1>

      <button className="cta-button" onClick={abrirModal}>
        Criar Nova Tarefa
      </button>

      <TarefaListView tarefas={tarefas} />

      {mostrarModal && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Criar Tarefa</h2>
            <CriarTarefaForm
              onTarefaCriada={() => {
                carregarTarefas();
                fecharModal();
              }}
            />
            <button className="cta-button close-btn" onClick={fecharModal}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Tarefas;
