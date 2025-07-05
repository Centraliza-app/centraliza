import React, { useEffect, useState } from 'react';
import { listarTarefas, listarSubtarefasPorTarefa } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

import GreetingCard from '../../components/Dashboard/GreetingCard';
import ProgressCard from '../../components/Dashboard/ProgressCard';
import UpcomingTasksCard from '../../components/Dashboard/UpcomingTasksCard';
import InfoCard from '../../components/Dashboard/InfoCard';
import OverdueTasksModal from '../../components/Dashboard/OverdueTasksModal';
import ChartCard from '../../components/Dashboard/ChartCard';
import ChartTypeToggle from '../../components/Dashboard/ChartTypeToggle';

import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const Dashboard = () => {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [dashboardData, setDashboardData] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    upcomingTasks: [],
    overdueTasksList: [],
  });

  const [activeChart, setActiveChart] = useState('doughnut');

  const [subtaskCounts, setSubtaskCounts] = useState({ aFazer: 0, emExecucao: 0, concluidas: 0 });
  const [subtaskChartData, setSubtaskChartData] = useState({
    labels: ['A Fazer', 'Em Execução', 'Concluído'],
    datasets: [
      {
        label: 'Subtarefas',
        labels: ['A Fazer', 'Em Execução', 'Concluído'],
        data: [0, 0, 0],
        backgroundColor: ['#dc3545', '#ffc107', '#28a745'],
      },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { position: 'right', labels: { usePointStyle: true, pointStyle: 'circle', padding: 20 } }
    }
  };

  useEffect(() => {
    const nome = localStorage.getItem('nomeUsuario');
    if (nome) {
      setNomeUsuario(nome);
    }
    
    const carregarDadosDashboard = async () => {
      setLoading(true);
      try {
        const response = await listarTarefas();
        const tarefas = response.data;

        // --- Lógica de Tarefas Principais ---
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const limiteProximas = new Date(hoje);
        limiteProximas.setDate(hoje.getDate() + 7);

        const concluidas = tarefas.filter(t => t.status === 'CONCLUÍDO').length;
        
        const listaDeAtrasadas = tarefas.filter(t => {
            const dataFim = new Date(t.dataFim + 'T00:00:00');
            return dataFim < hoje && t.status !== 'CONCLUÍDO';
        });
        
        const proximas = tarefas
          .filter(t => {
            const dataFim = new Date(t.dataFim + 'T00:00:00');
            return t.status !== 'CONCLUÍDO' && dataFim >= hoje && dataFim <= limiteProximas;
          })
          .sort((a, b) => new Date(a.dataFim) - new Date(b.dataFim))
          .slice(0, 3)
          .map(t => ({ id: t.id, titulo: t.nome, dataFim: t.dataFim }));

        // --- Lógica de Subtarefas ---
        let subtarefasAFazer = 0;
        let subtarefasEmExecucao = 0;
        let subtarefasConcluidas = 0;

        // Carrega subtarefas para todas as tarefas e soma os status
        for (const tarefa of tarefas) {
          try {
            const resSub = await listarSubtarefasPorTarefa(tarefa.id);
            const subtarefas = resSub.data;
            subtarefasAFazer += subtarefas.filter(st => st.status === 'A FAZER').length;
            subtarefasEmExecucao += subtarefas.filter(st => st.status === 'EM EXECUÇÃO').length;
            subtarefasConcluidas += subtarefas.filter(st => st.status === 'CONCLUÍDO').length;
          } catch (e) {
            // Se falhar ao buscar subtarefas de uma tarefa, ignora
          }
        }

        setSubtaskCounts({
          aFazer: subtarefasAFazer,
          emExecucao: subtarefasEmExecucao,
          concluidas: subtarefasConcluidas,
        });

        setSubtaskChartData(prevData => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: [subtarefasAFazer, subtarefasEmExecucao, subtarefasConcluidas],
            },
          ],
        }));

        setDashboardData({
          totalTasks: tarefas.length,
          completedTasks: concluidas,
          overdueTasks: listaDeAtrasadas.length,
          upcomingTasks: proximas,
          overdueTasksList: listaDeAtrasadas,
        });

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      }
      setLoading(false);
    };

    carregarDadosDashboard();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <GreetingCard 
          nomeUsuario={nomeUsuario} 
          concluidas={dashboardData.completedTasks}
          atrasadas={dashboardData.overdueTasks}
        />
        <ProgressCard 
          concluidas={dashboardData.completedTasks}
          total={dashboardData.totalTasks}
        />
        <InfoCard 
          titulo="Tarefas Atrasadas" 
          valor={dashboardData.overdueTasks} 
          isWarning={dashboardData.overdueTasks > 0}
          onListClick={handleOpenModal} 
        />
        <UpcomingTasksCard tarefas={dashboardData.upcomingTasks} />
        <ChartCard
          title="Composição das Subtarefas"
          controls={
            <ChartTypeToggle
              activeType={activeChart}
              onTypeChange={setActiveChart} // Passa a função de mudar o estado
            />
          }
        >
          {/* RENDERIZA O GRÁFICO CORRETO COM BASE NO ESTADO */}
          {activeChart === 'bar' && (
            <Bar data={subtaskChartData} options={barOptions} />
          )}
          {activeChart === 'doughnut' && (
            <Doughnut data={subtaskChartData} options={doughnutOptions} />
          )}
        </ChartCard>
      </div>
      <OverdueTasksModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        tasks={dashboardData.overdueTasksList}
      />
    </div>
  );
};

export default Dashboard;