import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, ListTodo, Timer, CalendarDays, Kanban, LayoutDashboard, LogOut, Menu } from 'lucide-react'; // Ícones para o sidebar
import './SideBar-style.css'; // Importando o CSS para o sidebar

// Componente Sidebar
const Sidebar = ({ isAuthenticated, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    onLogout();
  };

  // Itens de navegação da barra lateral
  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon, requiresAuth: false },
    { name: 'Tarefas', path: '/tarefas', icon: ListTodo, requiresAuth: true },
    { name: 'Pomodoro', path: '/pomodoro', icon: Timer, requiresAuth: true },
    { name: 'Calendário', path: '/calendario', icon: CalendarDays, requiresAuth: true },
    // { name: 'Kanban', path: '/kanban', icon: Kanban, requiresAuth: true }, //DESCOMENTAR CASO MUDE OS PLANOS
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, requiresAuth: true },
  ];

  return (
    <>
      {/* Botão de abrir/fechar sidebar para mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sidebar-toggle-button" // Usando classe CSS
      >
        <Menu size={24} />
      </button>

      {/* Overlay para fechar sidebar no mobile quando aberto */}
      {isOpen && (
        <div
          className="sidebar-overlay" // Usando classe CSS
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar principal */}
      <aside
        className={`sidebar-container ${isOpen ? 'is-open' : ''}`} // Usando classes CSS e condicional
      >
        <div className="sidebar-header"> {/* Usando classe CSS */}
          <Link to="/" className="sidebar-logo"> {/* Usando classe CSS */}
            Centraliza
          </Link>
          {/* Botão de fechar para mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="sidebar-close-button" // Usando classe CSS
          >
            &times;
          </button>
        </div>
        <nav className="flex-grow"> {/* flex-grow do Tailwind permanece para layout */}
          <ul className="sidebar-nav-list"> {/* Usando classe CSS */}
            {navItems.map((item) => {
              if (!item.requiresAuth || isAuthenticated) {
                return (
                  <li key={item.name} className="sidebar-nav-item"> {/* Usando classe CSS */}
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="sidebar-nav-link" // Usando classe CSS
                    >
                      <item.icon size={20} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </nav>
        <div className="sidebar-footer"> {/* Usando classe CSS */}
        <button
            onClick={handleLogoutClick}
            className="sidebar-logout-button" // Usando classe CSS
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