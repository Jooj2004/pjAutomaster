import { useState, useEffect } from "react";
import { ClienteItem } from "./cliente-item";

export const ClientesList = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3001/clientes")
            .then(res => res.json())
            .then(data => {
                setClientes(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Carregando clientes...</p>;
    }

    if (clientes.length === 0) {
        return (
            <div className="func-list-no-client">
                <h3>Nenhum cliente cadastrado ainda.</h3>
                <p>Assim que houver clientes, eles aparecerão aqui.</p>
            </div>
        );
    }

    return (
        <div className="func-list">
            <h3>Lista de Clientes</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Endereço</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map(cliente => (
                        <ClienteItem key={cliente.id} cliente={cliente} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};