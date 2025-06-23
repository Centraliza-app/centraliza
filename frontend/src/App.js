import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import TarefaListView from './components/TarefaListView';
import CriarTarefaForm from './components/CriarTarefaForm';
import Pomodoro from './components/Pomodoro';
import KanbanPage from './components/KanbanPage';

import NavBar from './components/NavBar/NavBar';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Tarefas from './pages/Tarefas/Tarefas';
import Calendario from './pages/Calendario/Calendario';
import Dashboard from './pages/Dashboard/Dashboard';
import { login, logout, listarTarefas } from './services/apiService';
import ProtectedRoute from "./components/ProtectedRoute";
import SideLayout from './components/SideLayout/SideLayout';

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

  return (
    <Router>
        <Routes>
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SideLayout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                <Dashboard />
              </SideLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin}/>} />
        <Route path="/register" element={<Register />} />
        {/* Caso não encontre página alguma */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
