import React, { useEffect, useState } from 'react';
import {
    useNavigate
} from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <main class="hero">
            <h1>404</h1>
            <h2>Página não encontrada</h2>
            <p>
            Opa! Parece que você tentou acessar uma página que não existe. <br />
            Verifique o endereço ou volte para a página inicial.
            </p>
            <a href="/" class="cta-button">Voltar ao Início</a>
        </main>
    );
};

export default Home;