const pool = require('../models/database');

// GET - Buscar mensagens de uma OS
exports.getMensagensOS = async (req, res) => {
    try {
        const { osId } = req.params;

        const [mensagens] = await pool.query(`
            SELECT 
                m.id,
                m.conteudo,
                m.dataHora,
                m.ordemServico_id,
                m.usuario_id,
                u.nome,
                u.perfil,
                COALESCE(f.funcao, 'Cliente') AS funcao
            FROM mensagem m
            INNER JOIN usuario u ON m.usuario_id = u.id
            LEFT JOIN funcionario f ON u.id = f.id
            WHERE m.ordemServico_id = ?
            ORDER BY m.dataHora ASC
        `, [osId]);

        res.json(mensagens);
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        res.status(500).json({ error: error.message });
    }
};

// POST - Enviar nova mensagem
exports.enviarMensagem = async (req, res) => {
    try {
        const { ordemServico_id, conteudo, usuario_id } = req.body;

        if (!ordemServico_id || !conteudo || !usuario_id) {
            return res.status(400).json({ error: 'Dados obrigatórios faltando.' });
        }

        // Inserir mensagem
        const [result] = await pool.query(
            `INSERT INTO mensagem (conteudo, ordemServico_id, usuario_id, dataHora) 
             VALUES (?, ?, ?, NOW())`,
            [conteudo, ordemServico_id, usuario_id]
        );

        // Buscar a mensagem recém-criada com dados completos
        const [novaMensagem] = await pool.query(`
            SELECT 
                m.id,
                m.conteudo,
                m.dataHora,
                m.ordemServico_id,
                m.usuario_id,
                u.nome,
                u.perfil,
                COALESCE(f.funcao, 'Cliente') AS funcao
            FROM mensagem m
            INNER JOIN usuario u ON m.usuario_id = u.id
            LEFT JOIN funcionario f ON u.id = f.id
            WHERE m.id = ?
        `, [result.insertId]);

        res.status(201).json(novaMensagem[0]);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(400).json({ error: error.message });
    }
};

// GET - Verificar se usuário tem acesso à OS
exports.verificarAcessoOS = async (req, res) => {
    try {
        const { osId, usuarioId, perfil } = req.params;

        if (perfil === 'cliente') {
            // Cliente só acessa se for dono da OS
            const [os] = await pool.query(`
                SELECT o.id
                FROM ordemservico o
                INNER JOIN agendamento a ON o.agendamento_id = a.id
                INNER JOIN veiculo v ON a.veiculo_id = v.id
                WHERE o.id = ? AND v.cliente_id = ?
            `, [osId, usuarioId]);

            return res.json({ acesso: os.length > 0 });
        } else if (perfil === 'funcionario') {
            // Funcionário tem acesso a qualquer OS
            return res.json({ acesso: true });
        }

        res.json({ acesso: false });
    } catch (error) {
        console.error('Erro ao verificar acesso:', error);
        res.status(500).json({ error: error.message });
    }
};