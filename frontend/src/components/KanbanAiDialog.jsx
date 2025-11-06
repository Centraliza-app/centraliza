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
    <>
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
          <p className="muted" style={{ fontSize: '0.9em', color: '#555', marginTop: 0 }}>Sugestões para: "{prompt}"</p>
          <h4 style={{ marginTop: '15px', marginBottom: '10px' }}>Pré-visualização</h4>
          
          {/* Estilos adicionados para se parecer com os inputs do outro modal */}
          <div style={{ 
            maxHeight: '300px', 
            overflowY: 'auto', 
            paddingRight: '10px', 
            margin: '0 -10px 0 -10px' 
          }}>
            {drafts.map((d, i) => (
              <div 
                key={i} 
                className="card" 
                style={{ 
                  border: '1px solid #eee', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  marginBottom: '10px',
                  marginLeft: '10px',
                  marginRight: '10px'
                }}
              >
                <input
                  value={d.title}
                  onChange={(e)=>{
                    const next=[...drafts]; next[i]={...d, title:e.target.value}; setDrafts(next);
                  }}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '5px' }}
                />
                <textarea
                  rows={3}
                  value={d.description}
                  onChange={(e)=>{
                    const next=[...drafts]; next[i]={...d, description:e.target.value}; setDrafts(next);
                  }}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
                />
                <button 
                  onClick={()=>setDrafts(drafts.filter((_,idx)=>idx!==i))}
                  className="cta-button small"
                  style={{ backgroundColor: '#c62828', marginTop: '5px' }}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          <div className="row" style={{ marginTop: '20px' }}>
            <button 
              onClick={() => onConfirm(drafts)} 
              disabled={drafts.length === 0}
              className="cta-button"
              style={{ width: '100%' }}
            >
              Adicionar ao Kanban
            </button>
          </div>
        </>
      )}

      {/* 10. Botão de cancelar removido (agora está na KanbanPage.jsx) */}
    </>
  );
}