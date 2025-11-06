import React from 'react';
import './DeadlineHeatmap.css'; // O CSS também será substituído

// Função para obter o nível de cor com base na contagem
const getContributionLevel = (count) => {
  if (!count || count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  return 4; // 7+
};

// Função para formatar a data como YYYY-MM-DD
const getISODateString = (date) => {
  return date.toISOString().split('T')[0];
};

// Gera os dias para o heatmap (últimas 5 semanas = 35 dias)
const getDaysArray = () => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normaliza para o início do dia

  // 1. Define a data de início
  const startDate = new Date(today);
  
  // 2. Recua 4 semanas (para termos 5 semanas no total, incluindo a atual)
  startDate.setDate(startDate.getDate() - (4 * 7));
  
  // 3. Alinha a data de início ao Domingo anterior
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // 4. Gera os 35 dias (5 semanas x 7 dias)
  let currentDate = new Date(startDate);
  for (let i = 0; i < 35; i++) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
};

const DeadlineHeatmap = ({ data = {} }) => {
  const days = getDaysArray();
  const todayString = getISODateString(new Date());

  // Nomes dos dias da semana para o cabeçalho
  // Ajustado para começar com Domingo (D), já que getDay() = 0 é Domingo
  const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <div className="heatmap-calendar-container">
      
      {/* Cabeçalho com os dias da semana */}
      <div className="heatmap-weekdays">
        {weekdays.map((day, index) => (
          <div key={index} className="heatmap-weekday">{day}</div>
        ))}
      </div>

      {/* Grid principal do calendário (5 semanas) */}
      <div className="heatmap-grid-simplified">
        {days.map((date, index) => {
          const dateString = getISODateString(date);
          const count = data[dateString] || 0;
          const level = getContributionLevel(count);
          
          // Marca dias futuros como vazios
          if (dateString > todayString) {
            return <div key={index} className="heatmap-day empty"></div>;
          }

          return (
            <div
              key={index}
              className={`heatmap-day level-${level}`}
              title={`${count} ${count === 1 ? 'tarefa' : 'tarefas'} em ${date.toLocaleDateString('pt-BR')}`}
            />
          );
        })}
      </div>

      {/* Legenda (opcional, mas boa prática) */}
      <div className="heatmap-legend">
        <span>Menos</span>
        <div className="heatmap-day level-0" title="Nenhuma tarefa"></div>
        <div className="heatmap-day level-1" title="1-2 tarefas"></div>
        <div className="heatmap-day level-2" title="3-4 tarefas"></div>
        <div className="heatmap-day level-3" title="5-6 tarefas"></div>
        <div className="heatmap-day level-4" title="7+ tarefas"></div>
        <span>Mais</span>
      </div>
    </div>
  );
};

export default DeadlineHeatmap;