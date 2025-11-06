import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../../services/apiService';

const AtivarConta = () => {
    const [message, setMessage] = useState('Ativando sua conta...');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true); // Adicionado para controlar a chamada da API
    const location = useLocation();

    useEffect(() => {
        const token = new URLSearchParams(location.search).get('token');

        if (!token) {
            setMessage('Token de ativação não encontrado.');
            setError(true);
            setLoading(false);
            return;
        }

        const ativar = async () => {
            try {
                await api.get(`/usuarios/ativar-conta?token=${token}`);
                setMessage('Sua conta foi ativada com sucesso! Você já pode fazer o login.');
                setError(false);
            } catch (err) {
                if (loading) {
                    setMessage(err.response?.data || 'Erro ao ativar a conta. O token pode ser inválido ou ter expirado.');
                    setError(true);
                }
            } finally {
                setLoading(false);
            }
        };

        if (loading) {
            ativar();
        }

    }, [location, loading]); 

    return (
        <main className="hero" style={{ textAlign: 'center' }}>
            <h1>Ativação de Conta</h1>
            {loading ? (
                <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>{message}</p>
            ) : (
                <>
                    <p style={{ color: error ? 'red' : 'green', fontSize: '1.2rem', margin: '20px 0' }}>
                        {message}
                    </p>
                    {!error && (
                        <Link to="/login" className="cta-button">
                            Ir para o Login
                        </Link>
                    )}
                </>
            )}
        </main>
    );
};

export default AtivarConta;