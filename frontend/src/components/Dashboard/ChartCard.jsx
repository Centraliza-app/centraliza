import React from 'react';
import './ChartCard.css';

// Este card recebe o título, os controles (nosso toggle) e o gráfico (children)
const ChartCard = ({ title, controls, children }) => {
  return (
    <div className="info-card chart-card">
      <div className="chart-card-header">
        <h3 className="info-card-title">{title}</h3>
        {/* Renderiza os controles aqui */}
        <div className="chart-card-controls">
          {controls}
        </div>
      </div>
      <div className="chart-container">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;