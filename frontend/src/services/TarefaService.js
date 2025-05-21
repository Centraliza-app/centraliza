import axios from 'axios';

const API_URL = 'http://localhost:8080/tarefas';

// Altere isso conforme a senha que apareceu no terminal
const username = 'user';
const password = 'f8397bc4-9b7a-449d-890d-efdcc0baf623'; //Ao iniciar a aplicação, é preciso colocar a senha gerada pelo backend aqui ***Vou mudar isso***

const auth = {
  auth: {
    username,
    password
  }
};

export const listarTarefas = () => axios.get(API_URL, auth);

export const criarTarefa = (dados) => axios.post(API_URL, dados, auth);
