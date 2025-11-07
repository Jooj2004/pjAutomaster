const pool = require('../models/database');
const bcrypt = require('bcrypt');

async function getUserById(id) {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE id = ?', [id]);
    return rows[0];
}

exports.getUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT id, nome, email, telefone, endereco, perfil
            FROM usuario
            WHERE id = ?
        `;
        const [rows] = await pool.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const usuario = rows[0];

        // Se for cliente, busca dados extras
        if (usuario.perfil === "cliente") {
            const [clienteRows] = await pool.execute(
                "SELECT id FROM cliente WHERE id = ?",
                [id]
            );
            usuario.clienteId = clienteRows.length ? clienteRows[0].id : null;
        }

        // Se for funcionário, busca dados extras
        if (usuario.perfil === "funcionario") {
            const [funcRows] = await pool.execute(
                "SELECT id, agenda_id, funcao FROM funcionario WHERE id = ?",
                [id]
            );
            if (funcRows.length) {
                usuario.funcionarioId = funcRows[0].id;
                usuario.agendaId = funcRows[0].agenda_id;
                usuario.funcao = funcRows[0].funcao;
            }
        }

        return res.json(usuario);

    } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        return res.status(500).json({ error: "Erro no servidor ao buscar usuário." });
    }
};

exports.getAllClientes = async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.nome, u.email, u.telefone, u.endereco
            FROM usuario u
            WHERE u.perfil = 'cliente'
        `;
        const [rows] = await pool.query(query);

        return res.json(rows);
    } catch (err) {
        console.error("Erro ao buscar clientes:", err);
        return res.status(500).json({ error: "Erro no servidor ao buscar clientes." });
    }
};

exports.editPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha, telefone, endereco, perfil, funcao } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID do usuário é obrigatório' });
        }

        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Hash da senha se foi fornecida
        let hashedPassword = user.senha;
        if (senha) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(String(senha), salt);
        }

        // Atualiza tabela usuario
        const [resultUser] = await pool.query(
            `UPDATE usuario
             SET nome = ?, email = ?, senha = ?, telefone = ?, endereco = ?, perfil = ?
             WHERE id = ?`,
            [
                nome || user.nome,
                email || user.email,
                hashedPassword,
                telefone || user.telefone,
                endereco || user.endereco,
                perfil || user.perfil,
                id
            ]
        );

        if (resultUser.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Atualiza tabela cliente ou funcionario
        if ((perfil || user.perfil) === 'cliente') {
            await pool.query(
                `UPDATE cliente SET id = ? WHERE id = ?`,
                [id, id]
            );
        } else if ((perfil || user.perfil) === 'funcionario') {
            // Mantém agenda_id existente
            const [func] = await pool.query(
                "SELECT agenda_id FROM funcionario WHERE id = ?",
                [id]
            );
            const agendaId = func.length ? func[0].agenda_id : null;

            await pool.query(
                `UPDATE funcionario SET funcao = ?, agenda_id = ? WHERE id = ?`,
                [funcao || user.funcao || 'Padrão', agendaId, id]
            );
        }

        return res.status(200).json({ message: 'Perfil atualizado com sucesso' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
};