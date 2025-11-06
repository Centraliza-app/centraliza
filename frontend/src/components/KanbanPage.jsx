import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// 1. Importar criarSubtarefa e KanbanAiDialog
import { 
  listarSubtarefasPorTarefa, 
  deletarSubtarefa, 
  atualizarSubtarefa, 
  getTarefa,
  criarSubtarefa
} from '../services/apiService'; 

// dnd-kit
import { DndContext, PointerSensor, useSensor, useSensors, closestCorners, DragOverlay } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import ColumnWithAI from '../components/ColumnWithAI';
import CriarSubtarefaForm from '../components/CriarSubtarefaForm';
import SubtarefaCard from '../components/SubtarefaCard';
import KanbanAiDialog from '../components/KanbanAiDialog';

const statusList = ['A FAZER', 'EM EXECUÇÃO', 'CONCLUÍDO'];

const KanbanPage = () => {
  const { tarefaId } = useParams();
  const navigate = useNavigate();

  const [subtarefas, setSubtarefas] = useState([]);
  const [tarefaNome, setTarefaNome] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  
  const [showAiModal, setShowAiModal] = useState(false);

  const tasksByStatus = useMemo(() => {
    const grouped = {};
    statusList.forEach(status => grouped[status] = []);
    subtarefas.forEach(sub => {
      const status = (sub.status || 'A FAZER').toUpperCase();
      if (grouped[status]) {
        grouped[status].push(sub);
      }
    });
    return grouped;
  }, [subtarefas]);

  const carregarDados = React.useCallback(async () => {
    setLoading(true);
    try {
      const [tarefaRes, subtarefasRes] = await Promise.all([
        getTarefa(tarefaId),
        listarSubtarefasPorTarefa(tarefaId)
      ]);
      
      setTarefaNome(tarefaRes.data.nome); 
      setSubtarefas(subtarefasRes.data);

    } catch (error) {
      console.error('Erro ao carregar dados do kanban:', error);
      if (error.response && error.response.status === 404) {
        alert("Tarefa não encontrada.");
        navigate('/tarefas');
      }
    } finally {
      setLoading(false);
    }
  }, [tarefaId, navigate]);

  useEffect(() => {
    carregarDados();
  }, [tarefaId, carregarDados]);

  const handleDeleteSubtarefa = async (subtarefaId) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta subtarefa?");
    if (confirmDelete) {
      try {
        await deletarSubtarefa(tarefaId, subtarefaId);
        carregarDados();
      } catch (error) {
        console.error('Erro ao deletar subtarefa:', error);
        alert('Falha ao excluir a subtarefa.');
      }
    }
  };
  
  const handleAiConfirm = async (items) => {
    try {
      for (const it of items) {
        await criarSubtarefa(tarefaId, {
          subNome: it.title,
          descricao: it.description,
          status: "A FAZER", // Sempre cria em "A FAZER"
        });
      }
      setShowAiModal(false);
      carregarDados(); // Recarrega os dados após criar
    } catch (error) {
       console.error('Erro ao criar subtarefas com IA:', error);
       alert('Ocorreu um erro ao salvar as subtarefas geradas.');
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = subtarefas.find(sub => sub.subId === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable?.containerId || over.id;

    if (activeContainer !== overContainer) {
      const novoStatus = overContainer;
      const subtarefaArrastada = subtarefas.find(sub => sub.subId === activeId);

      setSubtarefas(prev =>
        prev.map(sub =>
          sub.subId === activeId ? { ...sub, status: novoStatus } : sub
        )
      );

      try {
        await atualizarSubtarefa(tarefaId, activeId, { ...subtarefaArrastada, status: novoStatus });
      } catch (error) {
        console.error('Erro ao atualizar subtarefa:', error);
        alert('Falha ao mover a subtarefa. Revertendo.');
        carregarDados(); 
      }
    } else {
      const tasksInContainer = tasksByStatus[activeContainer];
      const oldIndex = tasksInContainer.findIndex(t => t.subId === activeId);
      const newIndex = tasksInContainer.findIndex(t => t.subId === overId);

      if (oldIndex !== newIndex) {
        const reorderedTasks = arrayMove(tasksInContainer, oldIndex, newIndex);
        setSubtarefas(prev => [
          ...prev.filter(t => t.status !== activeContainer),
          ...reorderedTasks
        ]);
      }
    }
  };

  return (
    <>
      <div className="tarefas-container">
        <div className="tarefas-header">
          <h1 className="tarefas-title">Kanban: {tarefaNome || '...'}</h1>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="cta-button" 
              onClick={() => setShowAiModal(true)}
              disabled={!tarefaNome}
              title={!tarefaNome ? "Carregando nome da tarefa..." : "Gerar subtarefas com IA"}
            >
              Gerar com IA
            </button>
            
            <button className="cta-button" onClick={() => setShowModal(true)}>
              Criar Nova Subtarefa
            </button>
            
            <button
              className="cta-button"
              onClick={() => navigate('/tarefas')}
            >
              Voltar
            </button>
          </div>
        </div>

        {loading ? (
          <p>Carregando subtarefas...</p>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            <div style={{ 
              display: 'flex', 
              gap: 16, 
              flexWrap: 'nowrap', 
              justifyContent: 'flex-start', 
              overflowX: 'auto',
              padding: '16px 8px',
              background: '#f4f4f4', 
              borderRadius: '8px'
            }}>
              {statusList.map((status) => (
                <ColumnWithAI
                  key={status}
                  status={status}
                  tasks={tasksByStatus[status] || []}
                  onDelete={handleDeleteSubtarefa}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask ? (
                <SubtarefaCard task={activeTask} onDelete={() => {}} />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Criar Nova Subtarefa</h2>
            <CriarSubtarefaForm
              tarefaId={tarefaId}
              onSubtarefaCriada={() => {
                carregarDados(); 
                setShowModal(false);
              }}
              onClose={() => setShowModal(false)}
            />
            <button
              className="cta-button close-btn"
              onClick={() => setShowModal(false)}
              style={{ width: '100%', marginTop: '10px' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      
      {showAiModal && (
        <KanbanAiDialog
          taskId={tarefaId}
          onClose={() => setShowAiModal(false)}
          onConfirm={handleAiConfirm}
          prompt={tarefaNome}
        />
      )}
    </>
  );
};

export default KanbanPage;