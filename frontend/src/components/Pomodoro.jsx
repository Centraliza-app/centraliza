import React, { useState, useRef, useEffect } from 'react';
import { listarTarefas, criarPomodoroSession } from '../services/apiService';

const Pomodoro = () => {
    // Estados principais
    const [workTime, setWorkTime] = useState(25); // minutos
    const [breakTime, setBreakTime] = useState(5); // minutos
    const [secondsLeft, setSecondsLeft] = useState(25 * 60); // Inicia com o tempo de trabalho
    const [isRunning, setIsRunning] = useState(false);
    const [isWork, setIsWork] = useState(true); // true = trabalho, false = descanso
    const [cycleCount, setCycleCount] = useState(0);

    // Novos estados para vincular a tarefa
    const [tarefas, setTarefas] = useState([]);
    const [tarefaSelecionada, setTarefaSelecionada] = useState('');
    const [startTime, setStartTime] = useState(null);

    const timerRef = useRef(null); // Ref para o ID do setInterval

    // Efeito para carregar as tarefas do usuário
    useEffect(() => {
        const carregarTarefas = async () => {
            try {
                const response = await listarTarefas();
                setTarefas(response.data);
            } catch (error) {
                console.error('Erro ao carregar tarefas:', error);
            }
        };
        carregarTarefas();
    }, []);

    // Atualiza segundos quando usuário altera o tempo de trabalho manualmente
    const handleWorkChange = (e) => {
        const min = parseInt(e.target.value) || 0;
        setWorkTime(min);
        if (isWork && !isRunning) setSecondsLeft(min * 60);
    };

    // Atualiza segundos quando usuário altera o tempo de descanso manualmente
    const handleBreakChange = (e) => {
        const min = parseInt(e.target.value) || 0;
        setBreakTime(min);
        if (!isWork && !isRunning) setSecondsLeft(min * 60);
    };

    // Formata o tempo em mm:ss
    const formatTime = (s) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    };

    // Iniciar ou pausar o timer
    const handleStartPause = () => {
        if (!tarefaSelecionada) {
            alert('Por favor, selecione uma tarefa para iniciar o Pomodoro.');
            return;
        }

        if (isRunning) {
            clearInterval(timerRef.current);
            setIsRunning(false);
        } else {
            if (!startTime) {
              setStartTime(new Date());
            }
            setIsRunning(true);
            timerRef.current = setInterval(() => {
                setSecondsLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleNext();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    // Avançar para próxima fase
    const handleNext = () => {
        clearInterval(timerRef.current);
        setIsRunning(false);
        if (isWork) {
            setIsWork(false);
            setSecondsLeft(breakTime * 60);
        } else {
            setIsWork(true);
            setSecondsLeft(workTime * 60);
            setCycleCount(c => c + 1);
        }
    };

    // Concluir e salvar o ciclo
    const handleConclude = async () => {
        if (startTime && tarefaSelecionada) {
            try {
                await criarPomodoroSession({
                    tarefaId: tarefaSelecionada,
                    startTime: startTime.toISOString(),
                    endTime: new Date().toISOString(),
                    duration: workTime, // Salva a duração do tempo de trabalho
                });
                alert('Sessão Pomodoro salva com sucesso!');
            } catch (error) {
                console.error('Erro ao salvar sessão Pomodoro:', error);
                alert('Erro ao salvar a sessão Pomodoro.');
            }
        }
        clearInterval(timerRef.current);
        setIsRunning(false);
        setIsWork(true);
        setSecondsLeft(workTime * 60);
        setCycleCount(0);
        setStartTime(null);
        setTarefaSelecionada('');
    };

    // Efeito para limpar o intervalo quando o componente é desmontado
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    return (
        <div className="tarefas-container">
            <div className="tarefas-header">
                <h1 className="tarefas-title">Pomodoro</h1>
                <button className="cta-button" onClick={handleConclude}>
                    Resetar e Salvar Ciclo
                </button>
            </div>

            <div className="pomodoro-content-wrapper">
                 <div className="pomodoro-label-input-group">
                    <label>
                        Tarefa Associada:
                        <select
                            value={tarefaSelecionada}
                            onChange={(e) => setTarefaSelecionada(e.target.value)}
                            disabled={isRunning}
                            style={{width: '100%', padding: '8px', marginTop: '5px'}}
                        >
                            <option value="">Selecione uma tarefa</option>
                            {tarefas.map((tarefa) => (
                                <option key={tarefa.id} value={tarefa.id}>
                                    {tarefa.nome}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="pomodoro-label-input-group">
                    <label>
                        Tempo de Trabalho (min):
                        <input
                            type="number"
                            value={workTime}
                            onChange={handleWorkChange}
                            min="1"
                            disabled={isRunning}
                        />
                    </label>
                </div>
                <div className="pomodoro-label-input-group">
                    <label>
                        Tempo de Descanso (min):
                        <input
                            type="number"
                            value={breakTime}
                            onChange={handleBreakChange}
                            min="1"
                            disabled={isRunning}
                        />
                    </label>
                </div>

                <div className="pomodoro-timer-display">
                    {formatTime(secondsLeft)}
                </div>

                <div className="pomodoro-status-text">
                    <span>{isWork ? "Fase: Trabalho" : "Fase: Descanso"}</span>
                </div>

                <div className="pomodoro-controls">
                    <button
                        onClick={handleStartPause}
                        className="cta-button"
                        style={{ backgroundColor: isRunning ? '#FFA000' : '#4CAF50' }}
                    >
                        {isRunning ? "Pausar" : "Iniciar"}
                    </button>
                    <button
                        onClick={handleNext}
                        className="cta-button"
                        style={{ backgroundColor: '#2196F3' }}
                        disabled={isRunning}
                    >
                        Avançar Fase
                    </button>
                </div>

                <div className="pomodoro-cycle-count">
                    <strong>Ciclos completos: {cycleCount}</strong>
                </div>
            </div>
        </div>
    );
};

export default Pomodoro;