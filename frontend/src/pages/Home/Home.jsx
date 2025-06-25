import React, { useEffect, useState } from 'react';
import {
    useNavigate
} from "react-router-dom";
import NavBar from '../../components/NavBar/NavBar';

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <NavBar />
            <main class="hero">
                <h1>Centraliza</h1>
                <h2>Assuma o controle total dos seus projetos.</h2>
                <p>
                Do planejamento de tarefas com Kanban ao foco profundo com o timer Pomodoro, o Centraliza une as ferramentas que você precisa para transformar esforço em resultado, sem esforço.
                </p>
                <a href="/register" class="cta-button">Cadastre-se</a>
            </main>
        </>
    );
};

export default Home;