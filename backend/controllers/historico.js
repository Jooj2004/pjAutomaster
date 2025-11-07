const pool = require('../models/database');

exports.getHistoricClient = async (req, res) => {
    const { cliente_id } = req.params; // agora bate com a rota

    if (!cliente_id) {
        return res.status(400).json({ error: "cliente_id é obrigatório." });
    }

    try {
        // 1️⃣ Buscar veículos do cliente
        const [veiculos] = await pool.execute(
            'SELECT id, placa, marca, modelo FROM veiculo WHERE cliente_id = ?',
            [cliente_id]
        );

        if (veiculos.length === 0) {
            return res.status(404).json({ error: "Nenhum veículo encontrado para este cliente." });
        }

        const historico = [];

        // 2️⃣ Para cada veículo, buscar agendamentos e ordens de serviço
        for (const veiculo of veiculos) {
            // Buscar ordens de serviço vinculadas aos agendamentos do veículo
            const [ordens] = await pool.execute(
                `SELECT os.id, os.diagnostico, os.custo, os.status, a.dataHora, a.servico
                 FROM ordemservico os
                 INNER JOIN agendamento a ON os.agendamento_id = a.id
                 WHERE a.veiculo_id = ?`,
                [veiculo.id]
            );

            for (const os of ordens) {
                // Buscar peças da ordem de serviço
                const [pecas] = await pool.execute(
                    'SELECT id, nome, quantidade, precoUnitario FROM peca WHERE ordemServico_id = ?',
                    [os.id]
                );

                // Formatar data no estilo dd/mm/yyyy
                const dataObj = new Date(os.dataHora);
                const dataFormatada = dataObj.toLocaleDateString('pt-BR');

                historico.push({
                    id: os.id,
                    data: dataFormatada,
                    veiculo: {
                        placa: veiculo.placa,
                        modelo: veiculo.modelo,
                        marca: veiculo.marca
                    },
                    servico: os.servico,
                    status: os.status,
                    custo: `R$ ${Number(os.custo || 0).toFixed(2)}`,
                    diagnostico: os.diagnostico || "",
                    pecas: pecas.length > 0
                        ? pecas.map(p => {
                            const nome = p.nome || "Peça desconhecida";
                            const quantidade = p.quantidade != null ? p.quantidade : 0;
                            const preco = p.precoUnitario != null ? Number(p.precoUnitario).toFixed(2) : "0.00";
                            return `${nome} - ${quantidade} un. (R$ ${preco})`;
                        })
                        : []
                });
            }
        }

        // Ordenar por data decrescente
        historico.sort((a, b) => {
            const [da, ma, ya] = a.data.split("/").map(Number);
            const [db, mb, yb] = b.data.split("/").map(Number);
            return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
        });

        return res.status(200).json(historico);

    } catch (err) {
        console.error("Erro ao buscar histórico:", err);
        return res.status(500).json({ error: "Erro no servidor ao buscar histórico." });
    }
}

exports.getHistoricAllClients = async (req, res) => {
    try {
        // 1️⃣ Buscar todos os clientes
        const [clientes] = await pool.execute(
            `SELECT id, nome FROM usuario WHERE perfil = 'cliente'`
        );

        const historico = [];

        // 2️⃣ Para cada cliente, buscar veículos e ordens de serviço
        for (const cliente of clientes) {
            const [veiculos] = await pool.execute(
                'SELECT id, placa, marca, modelo FROM veiculo WHERE cliente_id = ?',
                [cliente.id]
            );

            for (const veiculo of veiculos) {
                const [ordens] = await pool.execute(
                    `SELECT os.id, os.diagnostico, os.custo, os.status, a.dataHora, a.servico
                     FROM ordemservico os
                     INNER JOIN agendamento a ON os.agendamento_id = a.id
                     WHERE a.veiculo_id = ?`,
                    [veiculo.id]
                );

                for (const os of ordens) {
                    const [pecas] = await pool.execute(
                        'SELECT id, nome, quantidade, precoUnitario FROM peca WHERE ordemServico_id = ?',
                        [os.id]
                    );

                    const dataObj = new Date(os.dataHora);
                    const dataFormatada = dataObj.toLocaleDateString('pt-BR');

                    historico.push({
                        id: os.id,
                        data: dataFormatada,
                        cliente: cliente.nome,
                        veiculo: {
                            placa: veiculo.placa,
                            modelo: veiculo.modelo,
                            marca: veiculo.marca
                        },
                        servico: os.servico,
                        status: os.status,
                        custo: `R$ ${Number(os.custo || 0).toFixed(2)}`,
                        diagnostico: os.diagnostico || "",
                        pecas: pecas.length > 0
                            ? pecas.map(p => {
                                const nome = p.nome || "Peça desconhecida";
                                const quantidade = p.quantidade != null ? p.quantidade : 0;
                                const preco = p.precoUnitario != null ? Number(p.precoUnitario).toFixed(2) : "0.00";
                                return `${nome} - ${quantidade} un. (R$ ${preco})`;
                            })
                            : []
                    });
                }
            }
        }

        // Ordenar por data decrescente
        historico.sort((a, b) => {
            const [da, ma, ya] = a.data.split("/").map(Number);
            const [db, mb, yb] = b.data.split("/").map(Number);
            return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
        });

        return res.status(200).json(historico);

    } catch (err) {
        console.error("Erro ao buscar histórico:", err);
        return res.status(500).json({ error: "Erro no servidor ao buscar histórico." });
    }
};