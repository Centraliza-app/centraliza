import React, { useEffect, useState } from 'react';
import { listarTarefas } from '../../services/apiService';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarTarefas = async () => {
    try {
      const res = await listarTarefas();
      setTarefas(res.data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  const numPendentes = tarefas.filter(t => t.status === 'A FAZER').length;
  const numConcluidas = tarefas.filter(t => t.status === 'CONCLUÍDO').length;
  const numEmExecucao = tarefas.filter(t => t.status === 'EM EXECUÇÃO').length;

  const chartData = {
    labels: ['A FAZER', 'EM EXECUÇÃO', 'CONCLUÍDO'],
    datasets: [
      {
        label: 'Subtarefas',
        data: [numPendentes, numEmExecucao, numConcluidas],
        backgroundColor: ['#64B5F6', '#42A5F5', '#2962FF'],
      },
    ],
  };

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
            <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
              <div className="tarefa-item" style={{ flex: 1, textAlign: 'center' }}>
                <h3>Tarefas Pendentes</h3>
                <p style={{ fontSize: '2rem', fontWeight: 600 }}>{numPendentes}</p>
              </div>
              <div className="tarefa-item" style={{ flex: 1, textAlign: 'center' }}>
                <h3>Tarefas Concluídas</h3>
                <p style={{ fontSize: '2rem', fontWeight: 600 }}>{numConcluidas}</p>
              </div>
              <div className="tarefa-item" style={{ flex: 1, textAlign: 'center' }}>
                <h3>Subtarefas Concluídas</h3>
                <p style={{ fontSize: '2rem', fontWeight: 600 }}>{numConcluidas}</p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: 24 }}>
            <h2>Resumo de Subtarefas</h2>
            <div style={{ background: 'white', padding: 16, borderRadius: 8 }}>
              <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
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
