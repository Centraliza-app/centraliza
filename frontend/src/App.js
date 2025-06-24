import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Tarefas from './pages/Tarefas/Tarefas';
import Calendario from './pages/Calendario/Calendario';
import Dashboard from './pages/Dashboard/Dashboard';
import Pomodoro from './components/Pomodoro';
import KanbanPage from './components/KanbanPage';
import { login, logout, listarTarefas } from './services/apiService';
import ProtectedRoute from "./components/ProtectedRoute";
import SideLayout from './components/SideLayout/SideLayout';

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

  return (
    <Router>
      <Routes>
        {/* Rota principal: Dashboard para autenticados, Home para não autenticados */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <SideLayout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                <Dashboard />
              </SideLayout>
            ) : (
              <Home />
            )
          }
        />
        <Route
          path="/tarefas"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SideLayout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                <Tarefas />
              </SideLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pomodoro"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SideLayout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                <Pomodoro />
              </SideLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/kanban/:tarefaId"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SideLayout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                <KanbanPage />
              </SideLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendario"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SideLayout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                <Calendario />
              </SideLayout>
            </ProtectedRoute>
          }
        />
        {/* A rota /dashboard foi removida pois agora é a rota principal "/" */}
        
        <Route path="/login" element={<Login onLogin={handleLogin}/>} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;