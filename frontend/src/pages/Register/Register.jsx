import React from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        // Lógica de cadastro
        navigate('/');
    };

    return (
        <main className="hero">
            <h1>Cadastre-se</h1>
            <form className="auth-form" onSubmit={handleRegister}>
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Senha" required />
                <button type="submit" className="cta-button">Criar Conta</button>
            </form>

            <p>ou cadastre-se com</p>

            <div className="social-login">
                <button className="cta-button social google">Google</button>
                <button className="cta-button social facebook">Facebook</button>
                <button className="cta-button social apple">Apple</button>
            </div>

            <p>Já possui uma conta? <a href="/login">Entrar</a></p>
        </main>
    );
};

export default Register;