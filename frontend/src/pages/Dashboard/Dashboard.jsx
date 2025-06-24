import React, { useEffect, useState } from 'react';
import { listarTarefas, listarSubtarefasPorTarefa } from '../../services/apiService';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tarefas, setTarefas] = useState([]);
  
  const [dashboardData, setDashboardData] = useState({
    numTarefasPendentes: 0,
    numTarefasConcluidas: 0,
    numSubtarefasConcluidas: 0,
    chartData: {
      labels: ['A FAZER', 'EM EXECUÇÃO', 'CONCLUÍDO'],
      datasets: [
        {
          label: 'Subtarefas',
          data: [0, 0, 0],
          backgroundColor: ['#64B5F6', '#42A5F5', '#2962FF'],
        },
      ],
    }
  });

  const [loading, setLoading] = useState(true);

  const carregarDadosDashboard = async () => {
    try {
      const resTarefas = await listarTarefas();
      const tarefasList = resTarefas.data;
      setTarefas(tarefasList);

      const promises = tarefasList.map(tarefa => 
        listarSubtarefasPorTarefa(tarefa.id)
      );
      
      const resultadosSubtarefas = await Promise.all(promises);
      const todasSubtarefas = resultadosSubtarefas.flatMap(res => res.data);

      const tarefasPendentes = tarefasList.filter(t => t.status === 'A FAZER').length;
      const tarefasConcluidas = tarefasList.filter(t => t.status === 'CONCLUÍDO').length;

      const subtarefasPendentes = todasSubtarefas.filter(s => s.status === 'A FAZER').length;
      const subtarefasEmExecucao = todasSubtarefas.filter(s => s.status === 'EM EXECUÇÃO').length;
      const subtarefasConcluidas = todasSubtarefas.filter(s => s.status === 'CONCLUÍDO').length;

      setDashboardData({
        numTarefasPendentes: tarefasPendentes,
        numTarefasConcluidas: tarefasConcluidas,
        numSubtarefasConcluidas: subtarefasConcluidas,
        chartData: {
          labels: ['A FAZER', 'EM EXECUÇÃO', 'CONCLUÍDO'],
          datasets: [
            {
              label: 'Subtarefas',
              data: [subtarefasPendentes, subtarefasEmExecucao, subtarefasConcluidas],
              backgroundColor: ['#64B5F6', '#42A5F5', '#2962FF'],
            },
          ],
        }
      });

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  return (
    <main className="tarefas-container">
      <div className="tarefas-header">
        <h1 className="tarefas-title">Home</h1>
        <button className="cta-button small" onClick={() => navigate('/tarefas')}>
          Ver Tarefas
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <section className="dashboard-section">
            <h2>Visão Geral</h2>
            <div className="dashboard-cards">
              <div className="tarefa-item dashboard-card">
                <h3>Tarefas Pendentes</h3>
                <p className="dashboard-card-metric">{dashboardData.numTarefasPendentes}</p>
              </div>
              <div className="tarefa-item dashboard-card">
                <h3>Tarefas Concluídas</h3>
                <p className="dashboard-card-metric">{dashboardData.numTarefasConcluidas}</p>
              </div>
              <div className="tarefa-item dashboard-card">
                <h3>Subtarefas Concluídas</h3>
                <p className="dashboard-card-metric">{dashboardData.numSubtarefasConcluidas}</p>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2>Resumo de Subtarefas</h2>
            <div className="dashboard-chart-container">
              <Bar data={dashboardData.chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </section>

          <section className="dashboard-section">
            <h2>Tarefas Recentes</h2>
            <ul className="tarefa-lista dashboard-task-list">
              {tarefas.slice(0, 5).map((t) => (
                <li key={t.id} className="tarefa-item">
                  <strong>{t.nome}</strong>
                  <p>{t.descricao}</p>
                  <span className="dashboard-task-status">{t.status}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
};

export default Dashboard;