import React from 'react';

export default function ClienteDashboard({ dashboardData }) {
    return (
        <div className="dashboard-content cliente-dashboard">
            <h2>Olá, {dashboardData.nome}! 👋</h2>
            <div className="card-list-title">
                <h3>🛠️ Minhas Ordens de Serviço/Agendamentos Recentes</h3>
            </div>
            <div className="servicos-list">
                {dashboardData.servicos.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Serviço</th>
                                <th>Veículo (Placa)</th>
                                <th>Data</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.servicos.slice(0, 10).map((servico) => (
                                <tr key={servico.id}>
                                    <td>{servico.servico}</td>
                                    <td>{servico.modelo} ({servico.placa})</td>
                                    <td>{new Date(servico.dataHora).toLocaleDateString('pt-BR')}</td>
                                    <td>{servico.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhuma ordem de serviço ou agendamento pendente.</p>
                )}
            </div>
        </div>
    );
}
