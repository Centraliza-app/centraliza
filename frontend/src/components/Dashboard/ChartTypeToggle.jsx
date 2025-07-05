import React from 'react';
// Ícones que vamos usar
import { BsBarChartLineFill, BsPieChartFill } from 'react-icons/bs'; 
import './ChartTypeToggle.css';

const ChartTypeToggle = ({ activeType, onTypeChange }) => {
  return (
    <div className="chart-type-toggle">
      <button
        className={`toggle-button ${activeType === 'bar' ? 'active' : ''}`}
        onClick={() => onTypeChange('bar')}
        aria-label="Ver gráfico de barras"
        title="Gráfico de Barras"
      >
        <BsBarChartLineFill />
      </button>
      <button
        className={`toggle-button ${activeType === 'doughnut' ? 'active' : ''}`}
        onClick={() => onTypeChange('doughnut')}
        aria-label="Ver gráfico de rosca"
        title="Gráfico de Rosca"
      >
        <BsPieChartFill />
      </button>
    </div>
  );
};

export default ChartTypeToggle;