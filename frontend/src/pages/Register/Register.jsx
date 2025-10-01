import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../../services/apiService';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        usuario: '',
        nome: '',
        sobrenome: '',
        email: '',
        senha: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await registrarUsuario(formData);
            alert('Cadastro realizado com sucesso! Verifique seu e-mail.');
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Erro ao realizar o cadastro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="hero">
            <h1>Cadastre-se</h1>
            <form className="auth-form" onSubmit={handleRegister}>
                <input type="text" name="usuario" placeholder="Usuário" onChange={handleChange} required />
                <input type="text" name="nome" placeholder="Nome" onChange={handleChange} required />
                <input type="text" name="sobrenome" placeholder="Sobrenome" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="senha" placeholder="Senha" onChange={handleChange} required />
                <button type="submit" className="cta-button" disabled={loading}>
                    {loading ? 'Criando...' : 'Criar Conta'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}

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