import React from 'react';

export default function FuncionarioDashboard({ dashboardData }) {
    return (
        <div className="dashboard-content funcionario-dashboard">
            <h2>Bem-vindo(a), {dashboardData.nome}! 👨‍🔧</h2>
            <div className="card-list-title">
                <h3>📑 Minhas Ordens de Serviço Vinculadas</h3>
            </div>
            <div className="os-list">
                {dashboardData.os.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>ID OS</th>
                                <th>Status</th>
                                <th>Diagnóstico</th>
                                <th>Custo (R$)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.os.slice(0, 10).map((os) => (
                                <tr key={os.id}>
                                    <td>{os.id}</td>
                                    <td>{os.status}</td>
                                    <td>{os.diagnostico ? os.diagnostico.substring(0, 30) + '...' : 'Pendente'}</td>
                                    <td>{Number(os.custo || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhuma Ordem de Serviço vinculada a você no momento.</p>
                )}
            </div>
        </div>
    );
}
