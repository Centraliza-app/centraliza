import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import TarefaListView from './components/TarefaListView';
import CriarTarefaForm from './components/CriarTarefaForm';
import Pomodoro from './components/Pomodoro';
import KanbanPage from './components/KanbanPage';

import { login, logout, listarTarefas } from './services/apiService';

const TarefasPage = ({ tarefas, onCriarTarefa }) => (
  <div>
    <h1>Centraliza - Tarefas</h1>
    <CriarTarefaForm onTarefaCriada={onCriarTarefa} />
    <TarefaListView tarefas={tarefas} />
  </div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [tarefas, setTarefas] = useState([]);

  const handleLogin = async (username, password) => {
    const success = await login(username, password);
    if (success) {
      setIsAuthenticated(true);
    } else {
      throw new Error('Falha na autenticação');
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setTarefas([]);
  };

  useEffect(() => {
    const carregarDados = async () => {
      if (isAuthenticated) {
        try {
          const response = await listarTarefas();
          setTarefas(response.data);
        } catch (error) {
          console.error('Sessão expirada ou token inválido.', error);
          handleLogout();
        }
      }
    };
    carregarDados();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="App">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <button onClick={handleLogout}>Sair</button>
        </div>
        {/* Menu de navegação */}
        <nav style={{ marginBottom: 20 }}>
          <Link to="/tarefas" style={{ marginRight: 10 }}>Tarefas</Link>
          <Link to="/pomodoro" style={{ marginRight: 10 }}>Pomodoro</Link>
        </nav>
        <Routes>
          <Route
            path="/tarefas"
            element={
              <TarefasPage
                tarefas={tarefas}
                onCriarTarefa={() => listarTarefas().then(res => setTarefas(res.data))}
              />
            }
          />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/kanban/:tarefaId" element={<KanbanPage />} />
          <Route path="*" element={<Navigate to="/tarefas" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
