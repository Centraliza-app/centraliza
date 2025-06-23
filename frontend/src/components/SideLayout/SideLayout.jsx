import React from 'react';
import Sidebar from '../SideBar/SideBar'; 


const SideLayout = ({ isAuthenticated, onLogout, children }) => {
  return (
    <div className="app-container">
      <Sidebar isAuthenticated={isAuthenticated} onLogout={onLogout} />

      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default SideLayout;