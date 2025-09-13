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

import { Bar, Doughnut, Line } from 'react-chartjs-2';
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

  const [metricas, setMetricas] = useState({
    taxaAtraso: 0,
    conclusoesNaSemana: 0,
    tempoMedioConclusao: 0,
    distribuicaoPrioridade: {
      baixa: 0,
      media: 0,
      alta: 0
    },
    horariosProdutivos: Array(24).fill(0)
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

        // Cálculo das novas métricas
        const tarefasConcluidas = tarefas.filter(t => t.status === 'CONCLUÍDO');
        
        // 1. Taxa de Atraso
        const taxaAtraso = tarefasConcluidas.length > 0
          ? (tarefasConcluidas.filter(t => {
              const dataFim = new Date(t.dataFim + 'T00:00:00');
              const dataAtual = new Date();
              return dataAtual > dataFim;
            }).length / tarefasConcluidas.length * 100).toFixed(1)
          : 0;

        // 2. Conclusões na semana
        const umaSemanaAtras = new Date(hoje);
        umaSemanaAtras.setDate(hoje.getDate() - 7);
        const conclusoesNaSemana = tarefasConcluidas.filter(t => {
          const dataAtual = new Date();
          return dataAtual >= umaSemanaAtras && dataAtual <= hoje;
        }).length;

        // 3. Tempo Médio de Conclusão
        const tempoMedioConclusao = tarefasConcluidas.length > 0
          ? tarefasConcluidas.reduce((acc, t) => {
              console.log('Analisando tarefa:', t);
              const inicio = t.dataInicio ? new Date(t.dataInicio + 'T00:00:00') : null;
              const fim = t.dataFim ? new Date(t.dataFim + 'T00:00:00') : null;
              
              if (!inicio || !fim) {
                console.log('Datas da tarefa:', {
                  id: t.id,
                  inicio: t.dataInicio,
                  fim: t.dataFim,
                  status: t.status
                });
                return acc;
              }

              const diffDias = Math.max(0, (fim - inicio) / (1000 * 60 * 60 * 24));
              console.log(`Tarefa ${t.id}: ${diffDias} dias (${t.dataInicio} até ${t.dataFim})`);
              
              return acc + diffDias;
            }, 0) / tarefasConcluidas.filter(t => t.dataInicio && t.dataFim).length || 0
          : 0;

        // 4. Distribuição por Prioridade
        const distribuicaoPrioridade = {
          baixa: tarefas.filter(t => t.prioridade === 'BAIXA').length,
          media: tarefas.filter(t => t.prioridade === 'MEDIA').length,
          alta: tarefas.filter(t => t.prioridade === 'ALTA').length
        };

        // 5. Horários mais produtivos
        const horariosProdutivos = Array(24).fill(0);
        tarefasConcluidas.forEach(t => {
          if (t.dataFim) {
            const hora = new Date(t.dataFim + 'T00:00:00').getHours();
            horariosProdutivos[hora]++;
          }
        });

        // Atualizar estados
        setMetricas({
          taxaAtraso,
          conclusoesNaSemana,
          tempoMedioConclusao: tempoMedioConclusao.toFixed(1),
          distribuicaoPrioridade,
          horariosProdutivos
        });

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
        
        {/* Taxa de Atraso */}
        <InfoCard 
          titulo="Taxa de Atraso" 
          valor={`${metricas.taxaAtraso}%`}
          isWarning={metricas.taxaAtraso > 20}
          descricao="Porcentagem de tarefas entregues após o prazo"
        />

        {/* Conclusões na Semana */}
        <InfoCard 
          titulo="Conclusões na Semana" 
          valor={metricas.conclusoesNaSemana}
          descricao="Tarefas concluídas nos últimos 7 dias"
        />

        {/* Tempo Médio de Conclusão */}
        <InfoCard 
          titulo="Tempo Médio de Conclusão" 
          valor={`${metricas.tempoMedioConclusao} dias`}
          descricao="Tempo médio para concluir uma tarefa"
        />

        {/* Distribuição por Prioridade */}
        <ChartCard
          title="Distribuição por Prioridade"
        >
          <Doughnut 
            data={{
              labels: ['Alta', 'Média', 'Baixa'],
              datasets: [{
                data: [
                  metricas.distribuicaoPrioridade.alta,
                  metricas.distribuicaoPrioridade.media,
                  metricas.distribuicaoPrioridade.baixa
                ],
                backgroundColor: ['#dc3545', '#ffc107', '#28a745']
              }]
            }}
            options={doughnutOptions}
          />
        </ChartCard>

        {/* Horários Mais Produtivos */}
        <ChartCard
          title="Horários Mais Produtivos"
        >
          <Line 
            data={{
              labels: Array.from({length: 24}, (_, i) => `${i}h`),
              datasets: [{
                label: 'Conclusões',
                data: metricas.horariosProdutivos,
                borderColor: '#2196F3',
                tension: 0.3,
                fill: true,
                backgroundColor: 'rgba(33, 150, 243, 0.1)'
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1 }
                }
              }
            }}
          />
        </ChartCard>

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