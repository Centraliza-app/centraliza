
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
      // 1. Busca todas as tarefas principais
      const resTarefas = await listarTarefas();
      const tarefasList = resTarefas.data;
      setTarefas(tarefasList);

      // 2. Cria uma lista de promises para buscar as subtarefas de cada tarefa
      const promises = tarefasList.map(tarefa => 
        listarSubtarefasPorTarefa(tarefa.id)
      );
      
      // 3. Executa todas as promises em paralelo
      const resultadosSubtarefas = await Promise.all(promises);
      
      // 4. Junta todas as subtarefas em um único array
      const todasSubtarefas = resultadosSubtarefas.flatMap(res => res.data);

      // 5. Calcula as métricas para as TAREFAS
      const tarefasPendentes = tarefasList.filter(t => t.status === 'A FAZER').length;
      const tarefasConcluidas = tarefasList.filter(t => t.status === 'CONCLUÍDO').length;

      // 6. Calcula as métricas para as SUBTAREFAS
      const subtarefasPendentes = todasSubtarefas.filter(s => s.status === 'A FAZER').length;
      const subtarefasEmExecucao = todasSubtarefas.filter(s => s.status === 'EM EXECUÇÃO').length;
      const subtarefasConcluidas = todasSubtarefas.filter(s => s.status === 'CONCLUÍDO').length;

      // 7. Atualiza o estado com todos os dados calculados
      setDashboardData({
        numTarefasPendentes: tarefasPendentes,
        numTarefasConcluidas: tarefasConcluidas,
        numSubtarefasConcluidas: subtarefasConcluidas,
        chartData: {
          labels: ['A FAZER', 'EM EXECUÇÃO', 'CONCLUÍDO'],
          datasets: [
            {
              label: 'Subtarefas',
              // Usa os dados das subtarefas para o gráfico
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
        <h1 className="tarefas-title">Dashboard</h1>
        <button className="cta-button small" onClick={() => navigate('/tarefas')}>
          Ver Tarefas
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <section style={{ marginBottom: 24 }}>
            <h2>Visão Geral</h2>
            <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
              {/* Card de Tarefas Pendentes */}
              <div className="tarefa-item" style={{ flex: 1, textAlign: 'center', minWidth: '200px' }}>
                <h3>Tarefas Pendentes</h3>
                <p style={{ fontSize: '2rem', fontWeight: 600 }}>{dashboardData.numTarefasPendentes}</p>
              </div>
              {/* Card de Tarefas Concluídas */}
              <div className="tarefa-item" style={{ flex: 1, textAlign: 'center', minWidth: '200px' }}>
                <h3>Tarefas Concluídas</h3>
                <p style={{ fontSize: '2rem', fontWeight: 600 }}>{dashboardData.numTarefasConcluidas}</p>
              </div>
              {/* Card de Subtarefas Concluídas - AGORA CORRETO */}
              <div className="tarefa-item" style={{ flex: 1, textAlign: 'center', minWidth: '200px' }}>
                <h3>Subtarefas Concluídas</h3>
                <p style={{ fontSize: '2rem', fontWeight: 600 }}>{dashboardData.numSubtarefasConcluidas}</p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: 24 }}>
            <h2>Resumo de Subtarefas</h2>
            <div style={{ background: 'white', padding: 16, borderRadius: 8, height: '250px' }}>
              {/* Gráfico agora usa os dados corretos das subtarefas */}
              <Bar data={dashboardData.chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </section>

          <section>
            <h2>Tarefas Recentes</h2>
            <ul className="tarefa-lista">
              {tarefas.slice(0, 5).map((t) => (
                <li key={t.id} className="tarefa-item" style={{ padding: 16 }}>
                  <strong>{t.nome}</strong>
                  <p>{t.descricao}</p>
                  <span style={{ background: '#e0e0e0', padding: '2px 8px', borderRadius: 4 }}>{t.status}</span>
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