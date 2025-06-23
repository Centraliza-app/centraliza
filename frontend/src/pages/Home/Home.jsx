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
                <h2>Simplifique a gestão centralizada</h2>
                <p>
                Uma ferramenta poderosa que ajuda você a organizar e centralizar as
                operações da sua empresa de forma eficiente.
                </p>
                <a href="/register" class="cta-button">Cadastre-se</a>
            </main>
        </>
    );
};

export default Home;