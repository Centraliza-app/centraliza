import axios from 'axios';

// Cria uma instância base do Axios
const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Isso é um "interceptor". É uma função que roda ANTES de cada requisição.
// A sua função é adicionar o token de autenticação em todas as chamadas.
api.interceptors.request.use(async (config) => {
  // Pega o token do localStorage (onde vamos guardá-lo)
  const token = localStorage.getItem('authToken');
  if (token) {
    // Se o token existir, adiciona o cabeçalho Authorization
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Função para fazer login.
 * @param {string} usuario
 * @param {string} senha
 * @returns {boolean} - True se o login foi bem-sucedido, false caso contrário.
 */
export const login = async (usuario, senha) => {
  try {
    const response = await api.post('/auth/login', { usuario, senha });
    const { token } = response.data;

    if (token) {
      // Salva o token no localStorage para ser usado em futuras requisições
      localStorage.setItem('authToken', token);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro no login:", error);
    localStorage.removeItem('authToken'); // Garante que qualquer token antigo seja removido
    return false;
  }
};

/**
 * Função para fazer logout.
 */
export const logout = () => {
  // Simplesmente remove o token do localStorage
  localStorage.removeItem('authToken');
};

/**
 * Funções para interagir com as tarefas.
 * Elas não precisam mais se preocupar com autenticação, o interceptor faz isso!
 */
export const listarTarefas = () => api.get('/tarefas');

export const criarTarefa = (dados) => api.post('/tarefas', dados);

// Exporte a instância do api se precisar em outros lugares
export default api;