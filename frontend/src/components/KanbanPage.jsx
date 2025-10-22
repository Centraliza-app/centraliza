import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listarSubtarefasPorTarefa, deletarSubtarefa, atualizarSubtarefa } from '../services/apiService';

// dnd-kit
import { DndContext, PointerSensor, useSensor, useSensors, closestCorners, DragOverlay } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

// Troca: sai Column “puro”, entra o wrapper com IA
// import Column from '../components/Column';
import ColumnWithAI from '../components/ColumnWithAI';

import CriarSubtarefaForm from '../components/CriarSubtarefaForm';
import SubtarefaCard from '../components/SubtarefaCard';

const statusList = ['A FAZER', 'EM EXECUÇÃO', 'CONCLUÍDO'];

const KanbanPage = () => {
  const { tarefaId } = useParams();
  const navigate = useNavigate();

  const [subtarefas, setSubtarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

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

  const carregarSubtarefas = React.useCallback(async () => {
    try {
      const res = await listarSubtarefasPorTarefa(tarefaId);
      setSubtarefas(res.data);
    } catch (error) {
      console.error('Erro ao carregar subtarefas:', error);
    } finally {
      setLoading(false);
    }
  }, [tarefaId]);

  useEffect(() => {
    carregarSubtarefas();
  }, [tarefaId, carregarSubtarefas]);

  const handleDeleteSubtarefa = async (subtarefaId) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta subtarefa?");
    if (confirmDelete) {
      try {
        await deletarSubtarefa(tarefaId, subtarefaId);
        carregarSubtarefas();
      } catch (error) {
        console.error('Erro ao deletar subtarefa:', error);
        alert('Falha ao excluir a subtarefa.');
      }
    }
  };

  // dnd sensors
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
      // mudança de coluna (status)
      const novoStatus = overContainer;
      const subtarefaArrastada = subtarefas.find(sub => sub.subId === activeId);

      // 1) Atualiza UI
      setSubtarefas(prev =>
        prev.map(sub =>
          sub.subId === activeId ? { ...sub, status: novoStatus } : sub
        )
      );

      // 2) Persiste no backend
      try {
        await atualizarSubtarefa(tarefaId, activeId, { ...subtarefaArrastada, status: novoStatus });
      } catch (error) {
        console.error('Erro ao atualizar subtarefa:', error);
        alert('Falha ao mover a subtarefa. Revertendo.');
        carregarSubtarefas();
      }
    } else {
      // reordenação dentro da mesma coluna
      const tasksInContainer = tasksByStatus[activeContainer];
      const oldIndex = tasksInContainer.findIndex(t => t.subId === activeId);
      const newIndex = tasksInContainer.findIndex(t => t.subId === overId);

      if (oldIndex !== newIndex) {
        const reorderedTasks = arrayMove(tasksInContainer, oldIndex, newIndex);
        setSubtarefas(prev => [
          ...prev.filter(t => t.status !== activeContainer),
          ...reorderedTasks
        ]);
        // Se quiser, salve a nova ordem no backend aqui
      }
    }
  };

  return (
    <>
      <div className="tarefas-container">
        <div className="tarefas-header">
          <h1 className="tarefas-title">Kanban da Tarefa</h1>
          <div>
            <button className="cta-button" onClick={() => setShowModal(true)}>
              Criar Nova Subtarefa
            </button>
            <button
              className="cta-button small"
              onClick={() => navigate('/tarefas')}
              style={{ marginLeft: '10px' }}
            >
              ← Voltar para Tarefas
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
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              {statusList.map((status) => (
                <ColumnWithAI
                  key={status}
                  parentTaskId={tarefaId}
                  status={status}
                  tasks={tasksByStatus[status] || []}
                  onDelete={handleDeleteSubtarefa}
                  onSubtasksCreated={carregarSubtarefas}
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
                carregarSubtarefas();
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
    </>
  );
};

export default KanbanPage;
