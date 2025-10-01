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
    const { token, nomeUsuario } = response.data;
    if (token && nomeUsuario) {
      localStorage.setItem('authToken', token);
      // NOVO: Armazenar o nome do usuário no localStorage
      localStorage.setItem('nomeUsuario', nomeUsuario); 
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro no login:", error);
    localStorage.removeItem('authToken');
    // NOVO: Remover também o nome do usuário em caso de erro
    localStorage.removeItem('nomeUsuario'); 
    return false;
  }
};

/**
 * Função para fazer logout.
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  // NOVO: Remover o nome do usuário ao fazer logout
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

// Função correta para criar subtarefa associada a uma tarefa (corpo NÃO leva tarefaId, só no path)
export const criarSubtarefa = (tarefaId, dados) => 
  api.post(`/tarefas/${tarefaId}/subtarefas`, dados);

// Função para listar as subtarefas de uma tarefa específica
export const listarSubtarefasPorTarefa = (tarefaId) => api.get(`/tarefas/${tarefaId}/subtarefas`);

// Outros métodos à testar ou implementar depois:
export const atualizarSubtarefa = (tarefaId, subId, dados) => api.put(`/tarefas/${tarefaId}/subtarefas/${subId}`, dados);
export const deletarSubtarefa = (tarefaId, subId) => api.delete(`/tarefas/${tarefaId}/subtarefas/${subId}`);

// Funções para interagir com as sessões Pomodoro
export const listarPomodoroSessionsPorTarefa = (tarefaId) => api.get(`/pomodoro-sessions/tarefa/${tarefaId}`);
export const criarPomodoroSession = (dados) => api.post(`/pomodoro-sessions`, dados);

/**
 * Funções para interagir com o perfil do usuário.
 */
export const getPerfil = () => api.get('/usuarios/perfil');
export const atualizarPerfil = (dados) => api.put('/usuarios/perfil', dados);
export const alterarSenha = (dados) => api.post('/usuarios/alterar-senha', dados);

// Exporta a instância do api caso precise em outros lugares
export default api;
