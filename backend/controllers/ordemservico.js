const pool = require('../models/database');

exports.createOS = async (req, res) => {
    try {
        const { diagnostico, tempo, custo, status, agendamento_id, funcionario_id } = req.body;

        if (!diagnostico || !tempo || !custo || !status || !funcionario_id) {
            return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
        }

        const [result] = await pool.query(
            `INSERT INTO ordemservico
                (diagnostico, tempo, custo, status, agendamento_id, funcionario_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [diagnostico, tempo, custo, status, agendamento_id || null, funcionario_id]
        );

        res.status(201).json({
            message: "Ordem de Serviço criada com sucesso!",
            os: {
                id: result.insertId,
                diagnostico,
                tempo,
                custo,
                status,
                agendamento_id: agendamento_id || null,
                funcionario_id
            }
        });
    } catch (error) {
        console.error("Erro ao criar OS:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateOS = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnostico, tempo, custo, status, agendamento_id } = req.body;

    if (!id) return res.status(400).json({ error: "ID da OS é obrigatório." });

    const [result] = await pool.query(
      `UPDATE ordemservico
       SET diagnostico = ?, tempo = ?, custo = ?, status = ?, agendamento_id = ?
       WHERE id = ?`,
      [diagnostico, tempo, custo, status, agendamento_id || null, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "OS não encontrada." });

    res.json({ message: "Ordem de Serviço atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar OS:", error);
    res.status(500).json({ error: "Erro no servidor ao atualizar a OS." });
  }
};

exports.deleteOS = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "ID da OS é obrigatório." });

    const [result] = await pool.query(`DELETE FROM ordemservico WHERE id = ?`, [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "OS não encontrada." });

    res.json({ message: "Ordem de Serviço excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir OS:", error);
    res.status(500).json({ error: "Erro no servidor ao excluir a OS." });
  }
};

exports.getOSByFuncionario = async (req, res) => {
  try {
    const { funcionario_id } = req.params;

    if (!funcionario_id) {
      return res.status(400).json({ error: "ID do funcionário é obrigatório." });
    }

    const [rows] = await pool.query(
      `
      SELECT 
        id,
        diagnostico,
        tempo,
        custo,
        status,
        agendamento_id,
        funcionario_id
      FROM ordemservico
      WHERE funcionario_id = ?
      ORDER BY id DESC
      `,
      [funcionario_id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar Ordens de Serviço do funcionário:", error);
    res.status(500).json({ error: "Erro ao buscar Ordens de Serviço do funcionário." });
  }
};

exports.getOSByCliente = async (req, res) => {
    const { cliente_id } = req.params;

    if (!cliente_id) {
        return res.status(400).json({ error: "O ID do cliente é obrigatório." });
    }

    try {
        const [rows] = await pool.query(`
            SELECT 
                os.id AS os_id,
                os.diagnostico,
                os.tempo,
                os.custo,
                os.status,
                os.funcionario_id,
                a.id AS agendamento_id,
                a.dataHora AS agendamento_dataHora,
                a.servico AS agendamento_servico,
                v.id AS veiculo_id,
                v.marca,
                v.modelo,
                v.placa,
                v.cor
            FROM ordemservico os
            INNER JOIN agendamento a ON os.agendamento_id = a.id
            INNER JOIN veiculo v ON a.veiculo_id = v.id
            WHERE v.cliente_id = ?
            ORDER BY os.id DESC
        `, [cliente_id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Nenhuma OS encontrada para este cliente." });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao buscar OS do cliente:", error);
        res.status(500).json({ error: "Erro no servidor ao buscar OS do cliente." });
    }
};
