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
import DeadlineHeatmap from '../../components/Dashboard/DeadlineHeatmap';
import PomodoroMetrics from '../../components/Dashboard/PomodoroMetrics';

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
    // ATUALIZADO: Estrutura para os 4 quadrantes
    distribuicaoPrioridade: {
      do: 0,
      schedule: 0,
      delegate: 0,
      eliminate: 0
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
  const [tarefas, setTarefas] = useState([]);

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
        setTarefas(response.data);
        const tarefasData = response.data;

        // --- Lógica de Tarefas Principais ---
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const limiteProximas = new Date(hoje);
        limiteProximas.setDate(hoje.getDate() + 7);

        const concluidas = tarefasData.filter(t => t.status === 'CONCLUÍDO').length;
        
        const listaDeAtrasadas = tarefasData.filter(t => {
            const dataFim = new Date(t.dataFim + 'T00:00:00');
            return dataFim < hoje && t.status !== 'CONCLUÍDO';
        });
        
        const proximas = tarefasData
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
        for (const tarefa of tarefasData) {
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

        const tarefasConcluidas = tarefasData.filter(t => t.status === 'CONCLUÍDO');

        // 1. Taxa de Atraso (dataConclusao > dataFim)
        const tarefasAtrasadas = tarefasConcluidas.filter(t => {
          if (!t.dataFim || !t.dataConclusao) {
            return false;
          }

          const dataPrevista = new Date(t.dataFim + 'T23:59:59');
          const dataReal = new Date(t.dataConclusao + 'T23:59:59');
          
          return dataReal > dataPrevista;
        });
        
        const taxaAtraso = tarefasConcluidas.length > 0
          ? ((tarefasAtrasadas.length / tarefasConcluidas.length) * 100).toFixed(1)
          : 0;

        // 2. Conclusões na semana (usando dataConclusao)
        const umaSemanaAtras = new Date();
        umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
        umaSemanaAtras.setHours(0, 0, 0, 0);
        
        const fimHoje = new Date();
        fimHoje.setHours(23, 59, 59, 999);
        
        const conclusoesNaSemana = tarefasConcluidas.filter(t => {
          if (!t.dataConclusao) return false;
          
          const dataConclusao = new Date(t.dataConclusao);
          dataConclusao.setHours(
            t.horaConclusao ? parseInt(t.horaConclusao.split(':')[0]) : 0,
            t.horaConclusao ? parseInt(t.horaConclusao.split(':')[1]) : 0,
            0, 0
          );
          
          return dataConclusao >= umaSemanaAtras && dataConclusao <= fimHoje;
        }).length;

        // 3. Tempo Médio de Conclusão (dataInicio -> dataConclusao)
        const tarefasComDatas = tarefasConcluidas.filter(t => t.dataInicio && t.dataConclusao);
        
        const tempoMedioConclusao = tarefasComDatas.length > 0
          ? (
              tarefasComDatas.reduce((acc, t) => {
                const inicio = new Date(t.dataInicio);
                const conclusao = new Date(t.dataConclusao);
                const diffDias = (conclusao - inicio) / (1000 * 60 * 60 * 24);
                return acc + diffDias;
              }, 0) / tarefasComDatas.length
            ).toFixed(1)
          : 0;

        // 4. Distribuição por Prioridade (baseado na Matriz de Eisenhower)
        // ATUALIZAÇÃO: Filtra apenas tarefas não concluídas
        const tarefasPendentes = tarefasData.filter(t => t.status !== 'CONCLUÍDO');
        
        // ATUALIZAÇÃO: Calcula os 4 quadrantes
        const distribuicaoPrioridade = {
          do: tarefasPendentes.filter(t => t.urgente && t.importante).length,
          schedule: tarefasPendentes.filter(t => !t.urgente && t.importante).length,
          delegate: tarefasPendentes.filter(t => t.urgente && !t.importante).length,
          eliminate: tarefasPendentes.filter(t => !t.urgente && !t.importante).length,
        };

        // 5. Horários mais produtivos (baseado na dataConclusao)
        const horariosProdutivos = Array(24).fill(0);
        
        tarefasConcluidas.forEach(t => {
          if (t.dataConclusao) {
            const dataConclusao = new Date(t.dataConclusao);
            const hora = dataConclusao.getHours();
            horariosProdutivos[hora]++;
          }
        });

        // Atualizar estados
        setMetricas({
          taxaAtraso,
          conclusoesNaSemana,
          tempoMedioConclusao,  // já está formatado com toFixed(1)
          distribuicaoPrioridade, // Objeto atualizado
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
  }, []); // Dependência 'navigate' removida, pois 'carregarDadosDashboard' não a utiliza

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
        <PomodoroMetrics tarefas={tarefas} />
        
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

        {/* --- ATUALIZAÇÃO AQUI --- */}
        {/* O Card agora é envolvido por uma div clicável */}
        <ChartCard
          title="Prioridade"
          subtitle="Baseado na Matriz de Eisenhower"
        >
          <div
            onClick={() => navigate('/matriz-eisenhower')}
            style={{ cursor: 'pointer', height: '100%', width: '100%' }}
            title="Ir para a Matriz de Eisenhower"
          >
            <Doughnut 
              data={{
                labels: [
                  'Faça Agora', 
                  'Agende', 
                  'Delegue', 
                  'Elimine'
                ],
                datasets: [{
                  data: [
                    metricas.distribuicaoPrioridade.do,
                    metricas.distribuicaoPrioridade.schedule,
                    metricas.distribuicaoPrioridade.delegate,
                    metricas.distribuicaoPrioridade.eliminate
                  ],
                  backgroundColor: [
                    '#dc3545', // Vermelho (Faça)
                    '#007bff', // Azul (Agende)
                    '#ffc107', // Amarelo (Delegue)
                    '#6c757d'  // Cinza (Elimine)
                  ]
                }]
              }}
              options={{
                ...doughnutOptions,
                onClick: (e) => navigate('/matriz-eisenhower'),
              }}
            />
          </div>
        </ChartCard>
        {/* --- FIM DA ATUALIZAÇÃO --- */}

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
              onTypeChange={setActiveChart}
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

        <div className="heatmap-container">
          <ChartCard
            title="Planejado vs Realizado"
            subtitle="Status das tarefas com base na data planejada"
          >
            <DeadlineHeatmap tarefas={tarefas} />
          </ChartCard>
        </div>
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