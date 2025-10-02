import React, { useEffect, useState } from 'react';
import InfoCard from './InfoCard';
import { getPomodoroMetricsByTarefas } from '../../services/apiService';

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  return `${mins}min`;
};

const PomodoroMetrics = ({ tarefas }) => {
  const [metrics, setMetrics] = useState({
    totalSessions: 0,
    totalMinutes: 0
  });

  useEffect(() => {
    const calcularMetricas = async () => {
      if (!tarefas || tarefas.length === 0) {
        return;
      }

      try {
        let totalSessions = 0;
        let totalMinutes = 0;

        for (const tarefa of tarefas) {
          try {
            const response = await getPomodoroMetricsByTarefas(tarefa.id);
            
            if (Array.isArray(response.data)) {
              const sessions = response.data;
              totalSessions += sessions.length;
              totalMinutes += sessions.reduce((sum, session) => 
                sum + (session.duration || 0), 0);
            }
          } catch (error) {
            console.error('Erro ao buscar sessões:', error);
          }
        }

        setMetrics({
          totalSessions,
          totalMinutes
        });
      } catch (error) {
        setMetrics({
          totalSessions: 0,
          totalMinutes: 0
        });
      }
    };

    calcularMetricas();
  }, [tarefas]);

  return (
    <>
      <InfoCard
        titulo="Total de Pomodoros"
        valor={metrics.totalSessions}
        descricao="Ciclos completados"
      />
      <InfoCard
        titulo="Tempo Total Focado"
        valor={formatDuration(metrics.totalMinutes)}
        descricao="Tempo em pomodoros"
      />
    </>
  );
};

export default PomodoroMetrics;