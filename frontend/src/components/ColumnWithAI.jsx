import React, { useState } from "react";
import Column from "./Column";
import KanbanAiDialog from "./KanbanAiDialog";
import { criarSubtarefa } from "../services/apiService"; 

export default function ColumnWithAI({
  parentTaskId,   // id da tarefa principal
  tarefaNome,     // 1. Recebe o nome da tarefa
  status,         
  tasks,
  onDelete,
  onSubtasksCreated // callback para refetch após criar
}) {
  const [showAi, setShowAi] = useState(false);

  const handleConfirm = async (items) => {
    for (const it of items) {
      
      await criarSubtarefa(parentTaskId, {
        subNome: it.title,       // <-- MUDANÇA: de 'title' para 'subNome'
        descricao: it.description, // <-- MUDANÇA: de 'description' para 'descricao'
        status: "A FAZER", 
      });

    }
    setShowAi(false);
    onSubtasksCreated?.();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>{status}</strong>
        {status === "A FAZER" && (
          <button 
            onClick={() => setShowAi(true)} 
            disabled={!tarefaNome}
            title={!tarefaNome ? "Carregando nome da tarefa..." : "Gerar subtarefas com IA"}
          >
            Gerar com IA
          </button>
        )}
      </div>

      <Column status={status} tasks={tasks} onDelete={onDelete} />

      {showAi && (
        <KanbanAiDialog
          taskId={parentTaskId}
          onClose={() => setShowAi(false)}
          onConfirm={handleConfirm}
          prompt={tarefaNome}
        />
      )}
    </div>
  );
}