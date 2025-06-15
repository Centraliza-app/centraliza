import axios from 'axios';

const API_URL = 'http://localhost:8080/tarefas';

const username = 'admin';
const password = 'admin';

const auth = {
  auth: {
    username,
    password
  }
};

export const listarTarefas = () => axios.get(API_URL, auth);

export const criarTarefa = (dados) => axios.post(API_URL, dados, auth);
