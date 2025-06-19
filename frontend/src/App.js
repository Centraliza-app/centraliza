import React, { useEffect, useState } from 'react';

// Importa os componentes da UI
import LoginForm from './components/LoginForm';
import TarefaListView from './components/TarefaListView';
import CriarTarefaForm from './components/CriarTarefaForm';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
    Outlet,
    Navigate
} from "react-router-dom";

import NavBar from './components/NavBar/NavBar';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Tarefas from './pages/Tarefas/Tarefas';

// Importa as funções da nossa API
import { login, logout, listarTarefas } from './services/apiService';

import ProtectedRoute from "./components/ProtectedRoute";

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

  // Rota para definição de páginas LOGADAS!
  // Se não estiver logado, redireciona para a página de login
  // Se estiver logado, renderiza o componente passado

  return (
    <Router>
      <NavBar />
      {/*Implementing Routes for respective Path */}
      <Routes>
        <Route
          path="/tarefas"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Tarefas />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tarefas-naologado" element={<Tarefas />} />
        {/* Caso não encontre página alguma */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;