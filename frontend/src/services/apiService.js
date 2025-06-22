// src/services/apiService.js
import axios from 'axios';

// Cria uma instância base do Axios
const api = axios.create({
  baseURL: 'http://localhost:8080',
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
    const { token } = response.data;
    if (token) {
      localStorage.setItem('authToken', token);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro no login:", error);
    localStorage.removeItem('authToken');
    return false;
  }
};

/**
 * Função para fazer logout.
 */
export const logout = () => {
  localStorage.removeItem('authToken');
};

/**
 * Funções para interagir com as tarefas.
 */
export const listarTarefas = () => api.get('/tarefas');
export const criarTarefa = (dados) => api.post('/tarefas', dados);

/**
 * Funções para interagir com as subtarefas.
 */
export const criarSubtarefa = (dados) => api.post('/subtarefas', dados);
// Outros métodos à testar:
// export const listarSubtarefasPorTarefa = (tarefaId) => api.get(`/subtarefas/tarefa/${tarefaId}`);
// export const atualizarSubtarefa = (id, dados) => api.put(`/subtarefas/${id}`, dados);
// export const deletarSubtarefa = (id) => api.delete(`/subtarefas/${id}`);

export const listarSubtarefasPorTarefa = (tarefaId) => api.get(`/subtarefas/tarefa/${tarefaId}`);


// Exporta a instância do api caso precise em outros lugares
export default api;
