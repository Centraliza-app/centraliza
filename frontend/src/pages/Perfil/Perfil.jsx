import React, { useState, useEffect } from 'react';
import { getPerfil, atualizarPerfil, alterarSenha } from '../../services/apiService';
import './Perfil.css';

const Perfil = () => {
    const [perfil, setPerfil] = useState({
        nome: '',
        sobrenome: '',
        email: '',
        notificar: true,
    });
    const [senhas, setSenhas] = useState({
        senhaAtual: '',
        novaSenha: '',
        confirmaSenha: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    useEffect(() => {
        const carregarPerfil = async () => {
            try {
                const { data } = await getPerfil();
                setPerfil(data);
            } catch (err) {
                setError('Não foi possível carregar os dados do perfil.');
            } finally {
                setLoading(false);
            }
        };

        carregarPerfil();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPerfil({ ...perfil, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSenhaChange = (e) => {
        setSenhas({ ...senhas, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await atualizarPerfil(perfil);
            setSuccess('Perfil atualizado com sucesso!');
        } catch (err) {
            setError('Não foi possível atualizar o perfil.');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (senhas.novaSenha !== senhas.confirmaSenha) {
            setPasswordError('As novas senhas não coincidem.');
            return;
        }

        try {
            await alterarSenha({
                senhaAtual: senhas.senhaAtual,
                novaSenha: senhas.novaSenha,
            });
            setPasswordSuccess('Senha alterada com sucesso!');
            setSenhas({ senhaAtual: '', novaSenha: '', confirmaSenha: '' });
        } catch (err) {
            setPasswordError(err.response?.data || 'Não foi possível alterar a senha.');
        }
    };

    if (loading) {
        return <div className="perfil-container">Carregando...</div>;
    }

    return (
        <div className="perfil-container">
            <h1>Meu Perfil</h1>
            
            <div className="perfil-card">
                <h2>Informações Pessoais</h2>
                <p className="perfil-info-readonly">Usuário: <strong>{perfil.usuario}</strong></p>
                <p className="perfil-info-readonly">E-mail: <strong>{perfil.email}</strong></p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nome">Nome</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={perfil.nome}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sobrenome">Sobrenome</label>
                        <input
                            type="text"
                            id="sobrenome"
                            name="sobrenome"
                            value={perfil.sobrenome}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group-checkbox">
                        <input
                            type="checkbox"
                            id="notificar"
                            name="notificar"
                            checked={perfil.notificar}
                            onChange={handleChange}
                        />
                        <label htmlFor="notificar">Desejo receber notificações por e-mail</label>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <div className="button-group">
                        <button type="submit" className="cta-button">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>

            <div className="perfil-card">
                <h2>Alterar Senha</h2>
                <form onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                        <label htmlFor="senhaAtual">Senha Atual</label>
                        <input
                            type="password"
                            id="senhaAtual"
                            name="senhaAtual"
                            value={senhas.senhaAtual}
                            onChange={handleSenhaChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="novaSenha">Nova Senha</label>
                        <input
                            type="password"
                            id="novaSenha"
                            name="novaSenha"
                            value={senhas.novaSenha}
                            onChange={handleSenhaChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmaSenha">Confirmar Nova Senha</label>
                        <input
                            type="password"
                            id="confirmaSenha"
                            name="confirmaSenha"
                            value={senhas.confirmaSenha}
                            onChange={handleSenhaChange}
                            required
                        />
                    </div>
                    {passwordError && <p className="error-message">{passwordError}</p>}
                    {passwordSuccess && <p className="success-message">{passwordSuccess}</p>}
                    <div className="button-group">
                        <button type="submit" className="cta-button">
                            Alterar Senha
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="perfil-card delete-account">
                <h2>Excluir Conta</h2>
                <p>Esta ação é irreversível e todos os seus dados serão perdidos.</p>
                <div className="button-group">
                    <button className="cta-button danger" disabled>
                        Excluir Minha Conta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Perfil;