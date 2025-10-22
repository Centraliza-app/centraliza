import React, { useState } from "react";
import Column from "./Column";
import KanbanAiDialog from "./KanbanAiDialog";
import { criarSubtarefa } from "../services/apiService"; // ajuste o caminho

export default function ColumnWithAI({
  parentTaskId,   // id da tarefa principal
  status,         
  tasks,
  onDelete,
  onSubtasksCreated // callback para refetch após criar
}) {
  const [showAi, setShowAi] = useState(false);

  const handleConfirm = async (items) => {
    for (const it of items) {
      await criarSubtarefa(parentTaskId, {
        title: it.title,
        description: it.description,
        status: "A FAZER", // casa com suas colunas
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
          <button onClick={() => setShowAi(true)}>Gerar com IA</button>
        )}
      </div>

      <Column status={status} tasks={tasks} onDelete={onDelete} />

      {showAi && (
        <KanbanAiDialog
          taskId={parentTaskId}
          onClose={() => setShowAi(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
