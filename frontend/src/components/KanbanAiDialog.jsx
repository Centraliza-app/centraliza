import { useState } from "react";
import { sugerirSubtarefasComIA } from "../services/apiService"; // ajuste o caminho conforme seu projeto

export default function KanbanAiDialog({ taskId, onClose, onConfirm }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState([]);

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await sugerirSubtarefasComIA(prompt);
      setDrafts(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h3>Gerar subtarefas com IA</h3>
        <p className="muted">Descreva os passos da tarefa a realizar</p>
        <textarea
          rows={5}
          placeholder="Ex.: Publicar nova versão do app: preparar changelog, atualizar versão, rodar testes, criar tag..."
          value={prompt}
          onChange={(e)=>setPrompt(e.target.value)}
        />
        <div className="row">
          <button onClick={generate} disabled={!prompt || loading}>
            {loading ? "Gerando..." : "Gerar"}
          </button>
          <button className="ghost" onClick={onClose}>Cancelar</button>
        </div>

        {drafts.length > 0 && (
          <>
            <h4>Pré-visualização</h4>
            {drafts.map((d, i) => (
              <div key={i} className="card">
                <input
                  value={d.title}
                  onChange={(e)=>{
                    const next=[...drafts]; next[i]={...d, title:e.target.value}; setDrafts(next);
                  }}
                />
                <textarea
                  rows={3}
                  value={d.description}
                  onChange={(e)=>{
                    const next=[...drafts]; next[i]={...d, description:e.target.value}; setDrafts(next);
                  }}
                />
                <button onClick={()=>setDrafts(drafts.filter((_,idx)=>idx!==i))}>
                  Remover
                </button>
              </div>
            ))}
            <div className="row">
              <button onClick={()=>onConfirm(drafts)}>Adicionar ao Kanban</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
