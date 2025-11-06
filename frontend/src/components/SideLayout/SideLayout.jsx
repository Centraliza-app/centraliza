import React, { useState } from 'react';
import Sidebar from '../SideBar/SideBar'; 
import { Menu } from 'lucide-react'; // Importe o ícone do menu

const SideLayout = ({ isAuthenticated, onLogout, children }) => {
  // O estado que controla a sidebar agora vive aqui
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  return (
    <>
      {/* Botão de abrir/fechar sidebar para mobile */}
      {/* Este botão só aparece em telas pequenas, conforme definido no Global.css */}
      <button
        onClick={handleOpen}
        className="sidebar-toggle-button"
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay para fechar sidebar no mobile */}
      {/* Também só aparece em telas pequenas quando o menu está aberto */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={handleClose} />
      )}

      <div className="app-container">
        {/* Passa o estado e a função de fechar para o componente Sidebar */}
        <Sidebar 
          isAuthenticated={isAuthenticated} 
          isOpen={isOpen} 
          onClose={handleClose} 
          onLogout={onLogout} 
        />
        
        <main className="main-content">
          {children}
        </main>
      </div>
    </>
  );
};

export default SideLayout;