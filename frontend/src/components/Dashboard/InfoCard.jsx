import React from 'react';
import './InfoCard.css';

const InfoCard = ({ titulo, valor, isWarning, onListClick }) => (
  <div className={`info-card ${isWarning ? 'warning' : ''}`}>
    <h3 className="info-card-title">{titulo}</h3>
    <p className="info-card-value">{valor}</p>
    {isWarning && onListClick && (
        <button onClick={onListClick} className="list-button">
            Listar
        </button>
    )}
  </div>
);

export default InfoCard;