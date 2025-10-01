import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// ALTERADO: Importado o ícone LayoutGrid para a nova página.
import { ListTodo, Timer, CalendarDays, LogOut, HomeIcon, LayoutGrid, User } from 'lucide-react';
import './SideBar-style.css'; 

const Sidebar = ({ isAuthenticated, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/'); // Redireciona para a página inicial após o logout
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
      {/* Botão de abrir/fechar sidebar para mobile */}
      <aside
        className={`sidebar-container ${isOpen ? 'is-open' : ''}`}
      >
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            Centraliza
          </Link>
          <button
            onClick={() => setIsOpen(false)}
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
                      onClick={() => setIsOpen(false)}
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
            onClick={handleLogoutClick} // Esta função agora redireciona
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