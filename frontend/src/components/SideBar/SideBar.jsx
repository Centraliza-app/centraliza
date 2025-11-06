import React from 'react'; // Removido o useState
import { Link, useNavigate } from 'react-router-dom';
import { ListTodo, Timer, CalendarDays, LogOut, HomeIcon, LayoutGrid, User } from 'lucide-react';
import './SideBar-style.css'; 

// Recebe 'isOpen' e 'onClose' como propriedades
const Sidebar = ({ isAuthenticated, isOpen, onClose, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    onClose(); // Fecha o menu ao fazer logout
    navigate('/'); 
  };

  // Função para fechar o menu ao clicar em um link
  const handleLinkClick = () => {
    onClose();
  };

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon, requiresAuth: true },
    { name: 'Tarefas', path: '/tarefas', icon: ListTodo, requiresAuth: true },
    { name: 'Pomodoro', path: '/pomodoro', icon: Timer, requiresAuth: true },
    { name: 'Calendário', path: '/calendario', icon: CalendarDays, requiresAuth: true },
    { name: 'Matriz', path: '/matriz-eisenhower', icon: LayoutGrid, requiresAuth: true },
    { name: 'Perfil', path: '/perfil', icon: User, requiresAuth: true },
  ];

  return (
    <>
      {/* O container da sidebar agora é controlado pelo 'isOpen' vindo do pai */}
      <aside
        className={`sidebar-container ${isOpen ? 'is-open' : ''}`}
      >
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            Centraliza
          </Link>
          <button
            onClick={onClose} // Usa a função 'onClose'
            className="sidebar-close-button"
          >
            &times;
          </button>
        </div>
        <nav className="flex-grow">
          <ul className="sidebar-nav-list">
            {navItems.map((item) => {
              if (!item.requiresAuth || isAuthenticated) {
                return (
                  <li key={item.name} className="sidebar-nav-item">
                    <Link
                      to={item.path}
                      onClick={handleLinkClick} // Fecha o menu ao navegar
                      className="sidebar-nav-link"
                    >
                      <item.icon size={20} />
                      <span>{item.name === 'Matriz' ? 'Matriz de Eisenhower' : item.name}</span>
                    </Link>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </nav>
        <div className="sidebar-footer">
        <button
            onClick={handleLogoutClick} 
            className="sidebar-logout-button"
        >
            <LogOut size={20} />
            <span>Sair</span>
        </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;