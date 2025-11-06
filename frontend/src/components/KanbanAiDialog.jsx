import { useState, useEffect } from "react"; // 1. Importar useEffect
import { sugerirSubtarefasComIA } from "../services/apiService"; // ajuste o caminho conforme seu projeto

export default function KanbanAiDialog({ taskId, onClose, onConfirm, prompt }) { // 2. Recebe 'prompt'
  // 3. Remove o useState para 'prompt'
  const [loading, setLoading] = useState(true); // 4. Começa true
  const [drafts, setDrafts] = useState([]);
  const [error, setError] = useState(''); // 5. Adiciona estado de erro

  // 6. Função 'generate' agora é interna e usa o prompt recebido
  const generate = async () => {
    if (!prompt) {
        setError("Não foi possível obter o nome da tarefa para gerar sugestões.");
        setLoading(false);
        return;
    }
    
    setError('');
    setLoading(true);
    try {
      // 7. Usa o 'prompt' da prop
      const { data } = await sugerirSubtarefasComIA(prompt);
      setDrafts(data.items || []);
    } catch (err) {
      console.error("Erro ao sugerir subtarefas:", err);
      setError("Ocorreu um erro ao buscar sugestões da IA.");
    } finally {
      setLoading(false);
    }
  };

  // 8. useEffect para disparar a geração automaticamente
  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]); // Dispara quando 'prompt' for recebido

  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h3>Gerar subtarefas com IA</h3>

        {/* 9. Remove o <textarea> e o botão "Gerar" */}
        
        {loading && (
            <p>Gerando sugestões para a tarefa: "{prompt}"...</p>
        )}

        {error && (
            <p style={{color: 'red'}}>{error}</p>
        )}

        {!loading && !error && drafts.length === 0 && (
            <p>A IA não retornou sugestões. Tente novamente ou crie manualmente.</p>
        )}

        {!loading && drafts.length > 0 && (
          <>
            <p className="muted">Sugestões para: "{prompt}"</p>
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
              <button onClick={()=>onConfirm(drafts)} disabled={drafts.length === 0}>
                Adicionar ao Kanban
              </button>
            </div>
          </>
        )}

        {/* 10. Botão de cancelar agora é o principal (ou único) se algo falhar */}
        <div className="row" style={{marginTop: '10px'}}>
           <button className="ghost" onClick={onClose}>Cancelar</button>
        </div>

      </div>
    </div>
  );
}