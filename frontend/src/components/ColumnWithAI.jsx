import React from "react"; // 1. Removidas importações desnecessárias
import Column from "./Column";

export default function ColumnWithAI({
  status,         
  tasks,
  onDelete,
}) {

  const columnWrapperStyle = {
    display: "flex", 
    flexDirection: "column", 
    gap: 8,
    width: '300px',
    flexShrink: 0,
    maxHeight: 'calc(100vh - 180px)'
  };

  return (
    <div style={columnWrapperStyle}>
      {/* 4. Cabeçalho da coluna simplificado */}
      <div style={{ 
        display: "flex", 
        justifyContent: "flex-start", // Alinhado à esquerda
        alignItems: "center",
        flexShrink: 0, 
        padding: '0 4px',
        minHeight: '34px', // Altura mínima para alinhamento
        paddingLeft: '8px'
      }}>
        <strong>{status}</strong>
      </div>

      <Column status={status} tasks={tasks} onDelete={onDelete} />

    </div>
  );
}