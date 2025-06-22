// src/components/Pomodoro.jsx
import React, { useState, useRef } from 'react';

const Pomodoro = () => {
  // Estados principais
  const [workTime, setWorkTime] = useState(25); // minutos
  const [breakTime, setBreakTime] = useState(5); // minutos
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true); // true = trabalho, false = descanso
  const [cycleCount, setCycleCount] = useState(0);

  const timerRef = useRef(null);

  // Atualiza segundos quando usuário altera o tempo manualmente
  const handleWorkChange = (e) => {
    const min = parseInt(e.target.value) || 0;
    setWorkTime(min);
    if (isWork) setSecondsLeft(min * 60);
  };

  const handleBreakChange = (e) => {
    const min = parseInt(e.target.value) || 0;
    setBreakTime(min);
    if (!isWork) setSecondsLeft(min * 60);
  };

  // Formata o tempo em mm:ss
  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // Iniciar ou pausar
  const handleStartPause = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Avança ciclo automaticamente
            handleNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Avançar para próxima fase (descanso ou trabalho)
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

  // Concluir ciclo (reset)
  const handleConclude = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setIsWork(true);
    setSecondsLeft(workTime * 60);
    setCycleCount(0);
  };

  // Atualiza tempo ao alternar fase
  React.useEffect(() => {
    if (isWork) setSecondsLeft(workTime * 60);
    else setSecondsLeft(breakTime * 60);
    // eslint-disable-next-line
  }, [workTime, breakTime]);

  // Limpeza do intervalo ao desmontar
  React.useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div style={{ border: '1px solid #999', padding: 20, margin: 16, maxWidth: 350 }}>
      <h2>Pomodoro</h2>
      <div>
        <label>
          Tempo de tarefa (min):
          <input type="number" value={workTime} onChange={handleWorkChange} min="1" disabled={isRunning} />
        </label>
        <br />
        <label>
          Tempo de descanso (min):
          <input type="number" value={breakTime} onChange={handleBreakChange} min="1" disabled={isRunning} />
        </label>
      </div>
      <div style={{ fontSize: 36, margin: 12 }}>
        {formatTime(secondsLeft)}
      </div>
      <div>
        <span>{isWork ? "Trabalho" : "Descanso"}</span>
      </div>
      <div>
        <button onClick={handleStartPause}>
          {isRunning ? "Pausar" : "Iniciar"}
        </button>
        <button onClick={handleNext} disabled={isRunning}>
          Avançar
        </button>
        <button onClick={handleConclude}>
          Concluir
        </button>
      </div>
      <div>
        <strong>Ciclos completos: {cycleCount}</strong>
      </div>
    </div>
  );
};

export default Pomodoro;
