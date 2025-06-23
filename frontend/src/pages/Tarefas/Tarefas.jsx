import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CriarTarefaForm from '../../components/CriarTarefaForm';
import TarefaListView from '../../components/TarefaListView';
import { listarTarefas } from '../../services/apiService';
import SideBar from '../../components/SideBar/SideBar';

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
    <>
      <div className="tarefas-container"> {/* Novo container para organizar o cabeçalho e a lista */}
        <div className="tarefas-header"> {/* Novo div para o cabeçalho */}
          <h1 className="tarefas-title">Minhas Tarefas</h1>
          <button className="cta-button" onClick={abrirModal}>
            Criar Nova Tarefa
          </button>
        </div>

        {/* Exibe a lista de tarefas */}
        <TarefaListView tarefas={tarefas} />

        {/* Modal para criação de nova tarefa */}
        {mostrarModal && (
          <div className="modal-overlay" onClick={fecharModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Criar Tarefa</h2>
              <CriarTarefaForm
                onTarefaCriada={() => {
                  carregarTarefas(); // Recarrega as tarefas após a criação bem-sucedida
                  fecharModal();     // Fecha o modal
                }}
              />
              <button className="cta-button close-btn" onClick={fecharModal}>
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tarefas;