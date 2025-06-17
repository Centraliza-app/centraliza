import React, { useEffect, useState } from 'react';

// Importa os componentes da UI
import LoginForm from './components/LoginForm';
import TarefaListView from './components/TarefaListView';
import CriarTarefaForm from './components/CriarTarefaForm';

// Importa as funções da nossa API
import { login, logout, listarTarefas } from './services/apiService';

const App = () => {
  // 1. O estado de autenticação agora é baseado na existência de um token no localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [tarefas, setTarefas] = useState([]);

  // 2. Função de login que será passada para o LoginForm
  const handleLogin = async (username, password) => {
    const success = await login(username, password);
    if (success) {
      setIsAuthenticated(true);
    } else {
      // Se o login falhar no serviço, lança um erro para o LoginForm mostrar a mensagem
      throw new Error('Falha na autenticação');
    }
  };

  // 3. Função de logout
  const handleLogout = () => {
    logout(); // Limpa o token do localStorage
    setIsAuthenticated(false); // Atualiza o estado
    setTarefas([]); // Limpa as tarefas da tela
  };

  // 4. Efeito que carrega as tarefas QUANDO o usuário está autenticado
  useEffect(() => {
    const carregarDados = async () => {
      if (isAuthenticated) {
        try {
          const response = await listarTarefas();
          setTarefas(response.data);
        } catch (error) {
          console.error('Sessão expirada ou token inválido.', error);
          // Se o token for inválido, o backend dará erro. Deslogamos o usuário.
          handleLogout();
        }
      }
    };
    carregarDados();
  }, [isAuthenticated]); // Roda sempre que o estado 'isAuthenticated' mudar

  // ---- RENDERIZAÇÃO CONDICIONAL ----

  // 5. Se não estiver autenticado, mostra o formulário de login
  if (!isAuthenticated) {
    return (
      <div className="App">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  // 6. Se estiver autenticado, mostra a aplicação principal
  return (
    <div className="App">
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <button onClick={handleLogout}>Sair</button>
      </div>
      <h1>Centraliza - Tarefas</h1>
      <CriarTarefaForm onTarefaCriada={() => listarTarefas().then(res => setTarefas(res.data))} />
      <TarefaListView tarefas={tarefas} />
    </div>
  );
};

export default App;