const pool = require('../models/database');

// Função para buscar cliente pelo ID
async function getClientById(id) {
    const [rows] = await pool.query('SELECT * FROM cliente WHERE id = ?', [id]);
    return rows[0]; // retorna cliente ou undefined
}

exports.getVeiculosByCliente = async (req, res) => {
    const { cliente_id } = req.params;

    if (!cliente_id) {
        return res.status(400).json({ error: "cliente_id é obrigatório." });
    }

    try {
        // Verifica se cliente existe
        const [clienteRows] = await pool.execute('SELECT * FROM cliente WHERE id = ?', [cliente_id]);
        if (clienteRows.length === 0) {
            return res.status(404).json({ error: "Cliente não encontrado." });
        }

        // Busca os veículos relacionados
        const [veiculos] = await pool.execute(
            'SELECT id, placa, marca, modelo, ano, cor FROM veiculo WHERE cliente_id = ?',
            [cliente_id]
        );

        return res.status(200).json(veiculos);
    } catch (err) {
        console.error('Erro ao buscar veículos:', err);
        return res.status(500).json({ error: 'Erro no servidor ao buscar veículos.' });
    }
};

exports.createVeiculo = async (req, res) => {
    const { marca, modelo, ano, placa, cor, client_id } = req.body;

    if (!placa || !marca) {
        return res.status(400).json({ error: 'Marca e placa são campos obrigatórios.' });
    }

    if (!client_id) {
        return res.status(400).json({ error: 'client_id é obrigatório.' });
    }

    try {
        // Verifica se o cliente existe
        const cliente = await getClientById(client_id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }

        // Insere o veículo
        const query = 'INSERT INTO veiculo (marca, modelo, ano, placa, cor, cliente_id) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await pool.execute(query, [marca, modelo, ano, placa, cor, cliente.id]);

        res.status(201).json({ message: 'Veículo registrado com sucesso!', id: result.insertId });
    } catch (err) {
        console.error('Erro ao registrar o veículo:', err);
        res.status(500).json({ error: 'Erro no servidor ao registrar o veículo.' });
    }
};

// Função para buscar veículo pelo ID
async function getVeiculoById(id) {
    const [rows] = await pool.query('SELECT * FROM veiculo WHERE id = ?', [id]);
    return rows[0]; // retorna veículo ou undefined
}

// Update do veículo
exports.updateVeiculo = async (req, res) => {
    const { id } = req.params;
    const { marca, modelo, ano, placa, cor, client_id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'ID do veículo é obrigatório.' });
    }

    try {
        // Verifica se o veículo existe
        const veiculo = await getVeiculoById(id);
        if (!veiculo) {
            return res.status(404).json({ error: 'Veículo não encontrado.' });
        }

        // Opcional: verifica se o cliente existe (se estiver atualizando client_id)
        let cliente = null;
        if (client_id) {
            cliente = await getClientById(client_id);
            if (!cliente) {
                return res.status(404).json({ error: 'Cliente não encontrado.' });
            }
        }

        // Atualiza os dados
        const [result] = await pool.execute(
            `UPDATE veiculo
             SET marca = ?, modelo = ?, ano = ?, placa = ?, cor = ?, cliente_id = ?
             WHERE id = ?`,
            [
                marca || veiculo.marca,
                modelo || veiculo.modelo,
                ano || veiculo.ano,
                placa || veiculo.placa,
                cor || veiculo.cor,
                client_id ? cliente.id : veiculo.cliente_id,
                id
            ]
        );

        return res.status(200).json({ message: 'Veículo atualizado com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar o veículo:', err);
        return res.status(500).json({ error: 'Erro no servidor ao atualizar o veículo.' });
    }
}

exports.deleteVeiculo = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'ID do veículo é obrigatório.' });
    }

    try {
        // Verifica se o veículo existe
        const veiculo = await getVeiculoById(id);
        if (!veiculo) {
            return res.status(404).json({ error: 'Veículo não encontrado.' });
        }

        // Deleta o veículo
        await pool.execute('DELETE FROM veiculo WHERE id = ?', [id]);

        return res.status(200).json({ message: 'Veículo removido com sucesso!' });
    } catch (err) {
        console.error('Erro ao remover o veículo:', err);
        return res.status(500).json({ error: 'Erro no servidor ao remover o veículo.' });
    }
};