import { useContext, useEffect, useState } from 'react';
import {AuthContext} from "../../context/AuthContext";
import axios from 'axios'

import FuncionarioDashboard from "../../components/dashboard/FuncionarioDashboard";
import ClienteDashboard from "../../components/dashboard/ClienteDashboard";

import '../../css/dashboard.css'

export default function Dashboard() {
    const { user, logout, loading: authLoading } = useContext(AuthContext); 
    const perfil = user?.perfil
    const userId = user?.id; 

    const API_URL = 'http://localhost:3001'; 

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClienteData = async (id) => {
            try {
                const response = await axios.get(`${API_URL}/agenda/cliente/${id}`);
                setDashboardData({
                    nome: user.nome, 
                    servicos: response.data || [], 
                });
            } catch (err) {
                console.error("Erro ao buscar dados do cliente:", err);
                setError("Não foi possível carregar seus serviços.");
            } finally {
                setLoading(false);
            }
        };

        const fetchFuncionarioData = async (id) => {
            try {
                const osResponse = await axios.get(`${API_URL}/os/${id}`);
                setDashboardData({
                    nome: user.nome,
                    os: osResponse.data || [], 
                });
            } catch (err) {
                console.error("Erro ao buscar dados do funcionário:", err);
                setError("Não foi possível carregar as ordens de serviço.");
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && userId && perfil) {
            setLoading(true);
            setError(null);

            if (perfil === 'cliente') {
                fetchClienteData(userId);
            } else if (perfil === 'funcionario') {
                fetchFuncionarioData(userId);
            } else {
                setLoading(false);
            }
        } else if (!authLoading && !userId) {
            setLoading(false);
        }
    }, [userId, perfil, authLoading, user.nome]);

    if (authLoading || loading) return <div className="loading">Carregando Dashboard...</div>;
    if (error) return <div className="error-message">Erro ao carregar dados: {error}</div>;
    if (!user || !perfil) return <div>Usuário não autenticado ou perfil não definido.</div>;

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <h1>Dashboard | {perfil === 'cliente' ? 'Cliente 👤' : 'Funcionário ⚙️'}</h1>
                <button onClick={logout} className="logout-button" title="Sair da aplicação">
                    Sair 🚪
                </button>
            </header>
            <hr />
            {perfil === 'funcionario' && dashboardData && <FuncionarioDashboard dashboardData={dashboardData} />}
            {perfil === 'cliente' && dashboardData && <ClienteDashboard dashboardData={dashboardData} />}
            {['funcionario', 'cliente'].indexOf(perfil) === -1 && (
                <div className="perfil-nao-suportado">
                    <p>Seu perfil ({perfil}) está logado, mas não há visualização.</p>
                </div>
            )}
        </div>
    );
}