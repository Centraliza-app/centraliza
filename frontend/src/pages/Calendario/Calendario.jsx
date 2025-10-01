// src/pages/CalendarioPage.jsx
import React, { useEffect, useState } from 'react';
import { listarTarefas } from '../../services/apiService';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { parseISO, startOfWeek, getDay, format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek: (date) => startOfWeek(date, { locale: ptBR }),
  getDay,
  locales,
});

const CalendarioPage = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarTarefas = async () => {
    try {
      const response = await listarTarefas();
      setEventos(
        response.data.map((tarefa) => {
          // Garante que a data seja interpretada corretamente no fuso local
          const inicio =
            tarefa.dataInicio.length <= 10
              ? parseISO(tarefa.dataInicio + 'T00:00:00')
              : parseISO(tarefa.dataInicio);
          const fim =
            tarefa.dataFim.length <= 10
              ? parseISO(tarefa.dataFim + 'T23:59:59')
              : parseISO(tarefa.dataFim);

          return {
            id: tarefa.id,
            title: tarefa.nome,
            start: isValid(inicio) ? inicio : new Date(tarefa.dataInicio),
            end: isValid(fim) ? fim : new Date(tarefa.dataFim),
          };
        })
      );
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  return (
    <div className="tarefas-container">
      <div className="tarefas-header">
        <h1 className="tarefas-title">Calendário de Tarefas</h1>
        <button className="cta-button small" onClick={() => navigate('/tarefas')}>
          ← Voltar para Tarefas
        </button>
      </div>

      {loading ? (
        <p>Carregando eventos...</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={eventos}
          style={{ height: 600, background: 'white', borderRadius: 8, padding: 16 }}
          messages={{
            next: 'Próximo',
            previous: 'Anterior',
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
          }}
          onSelectEvent={(event) => {
            navigate(`/kanban/${event.id}`);
          }}
          eventPropGetter={(event) => ({
            style: {
              cursor: 'pointer',
              backgroundColor: '#007bff',
              borderRadius: '3px'
            }
          })}
        />
      )}
    </div>
  );
};

export default CalendarioPage;