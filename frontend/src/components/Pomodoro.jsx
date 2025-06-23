import React, { useState, useRef, useEffect } from 'react';

const Pomodoro = () => {
  // Estados principais
  const [workTime, setWorkTime] = useState(25); // minutos
  const [breakTime, setBreakTime] = useState(5); // minutos
  const [secondsLeft, setSecondsLeft] = useState(25 * 60); // Inicia com o tempo de trabalho
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true); // true = trabalho, false = descanso
  const [cycleCount, setCycleCount] = useState(0);

  const timerRef = useRef(null); // Ref para o ID do setInterval

  // Atualiza segundos quando usuário altera o tempo de trabalho manualmente
  const handleWorkChange = (e) => {
    const min = parseInt(e.target.value) || 0;
    setWorkTime(min);
    if (isWork) setSecondsLeft(min * 60); // Atualiza o timer se estiver na fase de trabalho
  };

  // Atualiza segundos quando usuário altera o tempo de descanso manualmente
  const handleBreakChange = (e) => {
    const min = parseInt(e.target.value) || 0;
    setBreakTime(min);
    if (!isWork) setSecondsLeft(min * 60); // Atualiza o timer se estiver na fase de descanso
  };

  // Formata o tempo em mm:ss
  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // Iniciar ou pausar o timer
  const handleStartPause = () => {
    if (isRunning) {
      clearInterval(timerRef.current); // Pausa o timer
      setIsRunning(false);
    } else {
      setIsRunning(true);
      // Inicia o timer para decrementar os segundos a cada segundo
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) { // Se o tempo acabar
            clearInterval(timerRef.current); // Para o intervalo
            handleNext(); // Avança para a próxima fase automaticamente
            return 0; // Garante que o contador mostre 0
          }
          return prev - 1; // Decrementa um segundo
        });
      }, 1000); // Roda a cada 1000ms (1 segundo)
    }
  };

  // Avançar para próxima fase (descanso -> trabalho ou trabalho -> descanso)
  const handleNext = () => {
    clearInterval(timerRef.current); // Para qualquer timer em execução
    setIsRunning(false); // Define como não rodando
    if (isWork) { // Se estava trabalhando, vai para o descanso
      setIsWork(false);
      setSecondsLeft(breakTime * 60);
    } else { // Se estava descansando, volta para o trabalho e incrementa o ciclo
      setIsWork(true);
      setSecondsLeft(workTime * 60);
      setCycleCount(c => c + 1); // Incrementa o ciclo quando um ciclo completo (trabalho + descanso) é concluído
    }
  };

  // Concluir ciclo (reset total)
  const handleConclude = () => {
    clearInterval(timerRef.current); // Para o timer
    setIsRunning(false); // Não está rodando
    setIsWork(true); // Volta para a fase de trabalho
    setSecondsLeft(workTime * 60); // Reseta o tempo para o tempo de trabalho inicial
    setCycleCount(0); // Reseta a contagem de ciclos
  };

  // Efeito para ajustar 'secondsLeft' quando 'isWork', 'workTime' ou 'breakTime' mudam
  // Isso garante que o timer seja reiniciado corretamente ao alternar fases ou ajustar tempos.
  useEffect(() => {
    if (isWork) {
      setSecondsLeft(workTime * 60);
    } else {
      setSecondsLeft(breakTime * 60);
    }
  }, [isWork, workTime, breakTime]);

  // Efeito de limpeza: garante que o setInterval seja limpo quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []); // Array de dependências vazio para rodar apenas na montagem/desmontagem

  return (
    // Usa 'tarefas-container' para o layout geral da página, centralizando o conteúdo
    <div className="tarefas-container">
      {/* Cabeçalho da página, alinhando título à esquerda e botão à direita */}
      <div className="tarefas-header">
        <h1 className="tarefas-title">Pomodoro</h1>
        {/* Botão de resetar tudo, alinhado à direita no cabeçalho */}
        <button className="cta-button" onClick={handleConclude}>
          Resetar Tudo
        </button>
      </div>

      {/* Wrapper principal do conteúdo do Pomodoro, com fundo, padding e sombra */}
      <div className="pomodoro-content-wrapper">
        {/* Grupos de label e input para configuração de tempo */}
        <div className="pomodoro-label-input-group">
          <label>
            Tempo de Trabalho (min):
            <input
              type="number"
              value={workTime}
              onChange={handleWorkChange}
              min="1"
              disabled={isRunning} // Desabilita edição enquanto o timer está rodando
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
              disabled={isRunning} // Desabilita edição enquanto o timer está rodando
            />
          </label>
        </div>

        {/* Exibição do tempo restante */}
        <div className="pomodoro-timer-display">
          {formatTime(secondsLeft)}
        </div>

        {/* Exibição da fase atual (Trabalho/Descanso) */}
        <div className="pomodoro-status-text">
          <span>{isWork ? "Fase: Trabalho" : "Fase: Descanso"}</span>
        </div>

        {/* Controles do timer (botões Iniciar/Pausar, Avançar Fase) */}
        <div className="pomodoro-controls">
          <button
            onClick={handleStartPause}
            className="cta-button"
            // Estilos inline para cores específicas dos botões
            style={{ backgroundColor: isRunning ? '#FFA000' : '#4CAF50' }} // Laranja para Pausar, Verde para Iniciar
          >
            {isRunning ? "Pausar" : "Iniciar"}
          </button>
          <button
            onClick={handleNext}
            className="cta-button"
            style={{ backgroundColor: '#2196F3' }} // Azul para Avançar
            disabled={isRunning} // Desabilita se o timer estiver rodando para evitar pulos acidentais
          >
            Avançar Fase
          </button>
          {/* O botão "Concluir" foi movido para o cabeçalho como "Resetar Tudo" */}
        </div>

        {/* Contagem de ciclos completos */}
        <div className="pomodoro-cycle-count">
          <strong>Ciclos completos: {cycleCount}</strong>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;