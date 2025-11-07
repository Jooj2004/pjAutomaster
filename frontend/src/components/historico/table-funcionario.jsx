import { useState, useEffect } from "react";
import { ModalHistorico } from "./modal";

export const TableFunc = ({ user }) => {
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3001/historico")
            .then(res => res.json())
            .then(data => {
                setHistorico(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const historicoOrdenado = [...historico].sort((a, b) => {
        const [da, ma, ya] = a.data.split("/").map(Number);
        const [db, mb, yb] = b.data.split("/").map(Number);
        return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
    });

    if (loading) return <p>Carregando histórico...</p>;

    if (historico.length === 0) {
        return (
            <div className="table-func-empty">
                <h3>Nenhum serviço realizado ainda.</h3>
                <p>Assim que houver histórico, ele aparecerá aqui.</p>
            </div>
        );
    }

    return (
        <div className="table-func-container">
            <table className="table-func">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Cliente</th>
                        <th>Veículo</th>
                        <th>Serviço</th>
                        <th>Status</th>
                        <th className="blue">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {historicoOrdenado.map(item => (
                        <tr key={item.id}>
                            <td data-label="Data">{item.data}</td>
                            <td data-label="Cliente">{item.cliente}</td>
                            <td data-label="Veículo">{item.veiculo.marca}-{item.veiculo.modelo} {item.veiculo.placa}</td>
                            <td data-label="Serviço">{item.servico}</td>
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
                                    Ver mais
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {modalOpen && modalData &&
                <ModalHistorico
                    data={modalData}
                    user={user}
                    onClose={() => setModalOpen(false)}
                />
            }
        </div>
    );
};