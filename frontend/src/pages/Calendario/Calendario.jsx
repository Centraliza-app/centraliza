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
  const [filters, setFilters] = useState({
    todo: true,
    inProgress: true,
    completed: true,
    overdue: true,
  });

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

          // Mantém o status original da tarefa (espera-se algo como 'CONCLUÍDO', 'EM EXECUÇÃO', 'A FAZER')
          const status = tarefa.status || tarefa.statusTarefa || 'A FAZER';

          return {
            id: tarefa.id,
            title: tarefa.nome,
            start: isValid(inicio) ? inicio : new Date(tarefa.dataInicio),
            end: isValid(fim) ? fim : new Date(tarefa.dataFim),
            status,
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

  const toggleFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const eventosFiltrados = eventos.filter(event => {
    const today = new Date();
    const isOverdue = event.end && event.end < today && event.status !== 'CONCLUÍDO';

    if (isOverdue) return filters.overdue;

    if (event.status === 'CONCLUÍDO') return filters.completed;

    if (event.status === 'EM EXECUÇÃO' || event.status === 'EM_EXECUCAO' || event.status === 'EM_EXECUÇÃO') return filters.inProgress;

    // Default: todo / a fazer
    return filters.todo;
  });

  const FILTER_COLORS = {
    todo: '#007bff',
    inProgress: '#fdd835',
    completed: '#2e7d32',
    overdue: '#dc3545'
  };

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
        <>
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#333' }}>Filtrar por Status da tarefa</h3>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.todo} onChange={() => toggleFilter('todo')} />
                <span style={{ display: 'inline-block', width: 12, height: 12, background: FILTER_COLORS.todo, borderRadius: 3, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)' }} />
                <span style={{ color: '#333' }}>A Fazer</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.inProgress} onChange={() => toggleFilter('inProgress')} />
                <span style={{ display: 'inline-block', width: 12, height: 12, background: FILTER_COLORS.inProgress, borderRadius: 3, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)' }} />
                <span style={{ color: '#333' }}>Em Execução</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.completed} onChange={() => toggleFilter('completed')} />
                <span style={{ display: 'inline-block', width: 12, height: 12, background: FILTER_COLORS.completed, borderRadius: 3, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)' }} />
                <span style={{ color: '#333' }}>Concluído</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={filters.overdue} onChange={() => toggleFilter('overdue')} />
                <span style={{ display: 'inline-block', width: 12, height: 12, background: FILTER_COLORS.overdue, borderRadius: 3, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)' }} />
                <span style={{ color: '#333' }}>Atrasadas</span>
              </label>
            </div>
          </div>

          <Calendar
            localizer={localizer}
            events={eventosFiltrados}
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
          eventPropGetter={(event) => {
              const today = new Date();
              const isOverdue = event.end && event.end < today && event.status !== 'CONCLUÍDO';

              // Cores: vermelho = atrasada, verde escuro = finalizada, amarelo = em execução, azul = a fazer
              const COLORS = {
                overdue: '#dc3545', // vermelho
                completed: '#2e7d32', // verde escuro
                inProgress: '#fdd835', // amarelo
                todo: '#007bff' // azul
              };

              let backgroundColor = COLORS.todo;

              if (isOverdue) {
                backgroundColor = COLORS.overdue;
              } else if (event.status === 'CONCLUÍDO') {
                backgroundColor = COLORS.completed;
              } else if (
                event.status === 'EM EXECUÇÃO'
              ) {
                backgroundColor = COLORS.inProgress;
              }

              const textColor = backgroundColor === COLORS.inProgress ? '#000' : '#fff';

              return {
                style: {
                  cursor: 'pointer',
                  backgroundColor,
                  borderRadius: '3px',
                  color: textColor,
                }
              };
            }}
          />
          </>
      )}
    </div>
  );
};

export default CalendarioPage;