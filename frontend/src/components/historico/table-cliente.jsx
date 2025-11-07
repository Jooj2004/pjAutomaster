import { useState, useEffect } from "react";
import { ModalHistorico } from "./modal";
import "../../css/Historico.css";

export const TableCliente = ({ user }) => {
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        const fetchHistorico = async () => {
            try {
                const response = await fetch(`http://localhost:3001/historico/${user.id}`);
                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Erro ${response.status}: ${errText}`);
                }
                const data = await response.json();
                setHistorico(data);
            } catch (err) {
                console.error(err);
                setError("Não foi possível carregar o histórico.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistorico();
    }, [user.id]);

    if (loading) return <p>Carregando histórico...</p>;

    if (error) {
        return (
            <div className="table-func-empty">
                <h3>{error}</h3>
            </div>
        );
    }

    if (historico.length === 0) {
        return (
            <div className="table-func-empty">
                <h3>Nenhum serviço realizado ainda.</h3>
                <p>Assim que houver histórico, ele aparecerá aqui.</p>
            </div>
        );
    }

    // Organiza por data decrescente
    const historicoOrdenado = [...historico].sort((a, b) => {
        const [da, ma, ya] = a.data.split("/").map(Number);
        const [db, mb, yb] = b.data.split("/").map(Number);
        return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
    });

    return (
        <div className="table-func-container">
            <table className="table-func">
                <thead>
                    <tr>
                        <th>Veículo</th>
                        <th>Data</th>
                        <th>Serviço</th>
                        <th>Peças</th>
                        <th>Preço</th>
                        <th>Status</th>
                        <th className="blue">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {historicoOrdenado.map(item => (
                        <tr key={item.id}>
                            <td data-label="Veículo">
                                <span className="blue">
                                    {item.veiculo.marca} {item.veiculo.modelo} - {item.veiculo.placa}
                                </span>
                            </td>
                            <td data-label="Data">{item.data}</td>
                            <td data-label="Serviço">{item.servico}</td>
                            <td data-label="Peças">
                                {item.pecas.length > 0 ? (
                                    <ul>
                                        {item.pecas.map((p, index) => (
                                            <li key={index}>{p}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <em>Sem peças</em>
                                )}
                            </td>
                            <td data-label="Custo">{item.custo}</td>
                            <td className="status" data-label="Status">
                                <span className="status-bubble">{item.status}</span>
                            </td>
                            <td data-label="Ações">
                                <button
                                    className="btn-vermais"
                                    onClick={() => {
                                        setModalData(item);
                                        setModalOpen(true);
                                    }}
                                >
                                    Ver Detalhes
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalOpen && modalData && (
                <ModalHistorico
                    data={modalData}
                    user={user}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
};