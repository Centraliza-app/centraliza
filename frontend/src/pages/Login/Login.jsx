import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Lógica de autenticação
        navigate('/');
    };

    return (
        <main className="hero">
            <h1>Entrar</h1>
            <form className="auth-form" onSubmit={handleLogin}>
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Senha" required />
                <button type="submit" className="cta-button">Entrar</button>
            </form>

            <p>ou continue com</p>

            <div className="social-login">
                <button className="cta-button social google">Google</button>
                <button className="cta-button social facebook">Facebook</button>
                <button className="cta-button social apple">Apple</button>
            </div>

            <p>Não tem uma conta? <a href="/register">Cadastre-se</a></p>
        </main>
    );
};

export default Login;
