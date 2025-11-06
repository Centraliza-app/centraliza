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
            await onLogin(username, password);
            navigate('/');
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Usuário ou senha inválidos.');
            } else if (err.response && err.response.status === 403) {
                setError('Sua conta ainda não foi ativada. Verifique seu e-mail.');
            }
            else {
                setError('Ocorreu um erro. Tente novamente.');
            }
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
            
            <p>Não tem uma conta? <a href="/register">Cadastre-se</a></p>
        </main>
    );
};

export default Login;