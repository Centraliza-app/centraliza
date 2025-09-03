import axios from 'axios';

// Cria uma instância base do Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Função para fazer login.
 * @param {string} usuario
 * @param {string} senha
 * @returns {boolean}
 */
export const login = async (usuario, senha) => {
  try {
    const response = await api.post('/auth/login', { usuario, senha });
    const { token, nomeUsuario } = response.data;
    if (token && nomeUsuario) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('nomeUsuario', nomeUsuario); 
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro no login:", error);
    localStorage.removeItem('authToken');
    localStorage.removeItem('nomeUsuario'); 
    return false;
  }
};

/**
 * Função para fazer logout.
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('nomeUsuario');
};

/**
 * Funções para interagir com as tarefas.
 */
export const listarTarefas = () => api.get('/tarefas');
export const criarTarefa = (dados) => api.post('/tarefas', dados);
export const deletarTarefa = (id) => api.delete(`/tarefas/${id}`);
export const atualizarTarefa = (id, dados) => api.put(`/tarefas/${id}`, dados);
/**
 * Funções para interagir com as subtarefas.
 */
export const criarSubtarefa = (tarefaId, dados) => 
  api.post(`/tarefas/${tarefaId}/subtarefas`, dados);

export const listarSubtarefasPorTarefa = (tarefaId) => api.get(`/tarefas/${tarefaId}/subtarefas`);

export const atualizarSubtarefa = (tarefaId, subId, dados) => api.put(`/tarefas/${tarefaId}/subtarefas/${subId}`, dados);
export const deletarSubtarefa = (tarefaId, subId) => api.delete(`/tarefas/${tarefaId}/subtarefas/${subId}`);

// Funções para interagir com as sessões Pomodoro
export const listarPomodoroSessionsPorTarefa = (tarefaId) => api.get(`/pomodoro-sessions/tarefa/${tarefaId}`);
export const criarPomodoroSession = (dados) => api.post(`/pomodoro-sessions`, dados);

export default api;