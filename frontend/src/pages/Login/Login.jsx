import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
        // Chama a função de login que veio do App.js
        await onLogin(username, password);
        navigate('/tarefas'); // Redireciona para a página de tarefas após o login
        } catch (err) {
            setError('Usuário ou senha inválidos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="hero">
            <h1>Entrar</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                <input required
                    type="text" 
                    placeholder="Usuário"  
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}/>
                <input required
                    type="password" 
                    placeholder="Senha" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit" className="cta-button" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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