const pool = require('../models/database')

exports.agendar = async (req, res) => {
  try {
    const { data, horario, servico, veiculo_id } = req.body

    // Validação simples
    if (!data || !horario || !servico || !veiculo_id) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios." })
    }

    // Verificar se o veículo existe
    const veiculo = await pool.query(
      "SELECT * FROM veiculo WHERE id = ?",
      [veiculo_id]
    )

    if (veiculo.length === 0) {
      return res.status(404).json({ error: "Veículo não encontrado." })
    }

    // Montar data + hora para salvar em datetime do MySQL
    const dataHora = `${data} ${horario}:00` // Ex: "2025-08-27 09:00:00"

    // Inserir agendamento no banco
    const [result] = await pool.query(
      "INSERT INTO agendamento (dataHora, servico, status, veiculo_id) VALUES (?, ?, ?, ?)",
      [dataHora, servico, "pendente", veiculo_id]
    )

    // Notificação Twilio e Email
    try {
      const [rows] = await pool.query(`
        SELECT u.telefone, u.email
        FROM veiculo v 
        JOIN cliente c ON v.cliente_id = c.id 
        JOIN usuario u ON c.id = u.id 
        WHERE v.id = ?
      `, [veiculo_id]);

      if (rows.length > 0) {
        const notificacaoController = require('./notificacao');
        await notificacaoController.notifyAppointment(rows[0].telefone, data, horario, rows[0].email);
      }
    } catch (err) {
      console.error("Erro ao enviar notificação de agendamento:", err);
    }

    return res.status(201).json({
      message: "Agendamento realizado com sucesso!",
      agendamento: {
        id: result.insertId,
        dataHora,
        servico,
        status: "pendente",
        veiculo_id
      }
    })

  } catch (error) {
    console.error("Erro ao agendar:", error)
    return res.status(500).json({ error: "Erro no servidor ao agendar." })
  }
}

exports.buscarAgendamentoById = async (req, res) => {
  try {
    const { id } = req.params

    // Validação simples
    if (!id) {
      return res.status(400).json({ error: "ID do agendamento é obrigatório." })
    }

    // Buscar o agendamento no banco
    const [rows] = await pool.query(
      `SELECT a.id, a.dataHora, a.servico, a.status, v.id AS veiculo_id, v.modelo, v.placa
             FROM agendamento a
             JOIN veiculo v ON a.veiculo_id = v.id
             WHERE a.id = ?`,
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado." })
    }

    return res.status(200).json({
      message: "Agendamento encontrado com sucesso.",
      agendamento: rows[0]
    })

  } catch (error) {
    console.error("Erro ao buscar agendamento:", error)
    return res.status(500).json({ error: "Erro no servidor ao buscar agendamento." })
  }
}

exports.listarAgendamentos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.dataHora, a.servico, a.status,
                    v.id AS veiculo_id, v.modelo, v.placa
             FROM agendamento a
             JOIN veiculo v ON a.veiculo_id = v.id
             ORDER BY a.dataHora DESC`
    )

    return res.status(200).json({
      message: "Lista de agendamentos obtida com sucesso.",
      total: rows.length,
      agendamentos: rows
    })

  } catch (error) {
    console.error("Erro ao listar agendamentos:", error)
    return res.status(500).json({ error: "Erro no servidor ao listar agendamentos." })
  }
}

exports.buscarAgendamentosPorVeiculo = async (req, res) => {
  try {
    const { veiculo_id } = req.params

    if (!veiculo_id) {
      return res.status(400).json({ error: "O ID do veículo é obrigatório." })
    }

    const [rows] = await pool.query(
      `SELECT a.id, a.dataHora, a.servico, a.status
             FROM agendamento a
             WHERE a.veiculo_id = ?`,
      [veiculo_id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: "Nenhum agendamento encontrado para este veículo." })
    }

    return res.status(200).json(rows)
  } catch (error) {
    console.error("Erro ao buscar agendamentos do veículo:", error)
    return res.status(500).json({ error: "Erro no servidor ao buscar agendamentos do veículo." })
  }
}

exports.buscarAgendamentosPorCliente = async (req, res) => {
  try {
    const { cliente_id } = req.params;

    if (!cliente_id) {
      return res.status(400).json({ error: "O ID do cliente é obrigatório." });
    }

    // Busca todos os agendamentos dos veículos do cliente
    const [rows] = await pool.query(
      `SELECT a.id, a.dataHora, a.servico, a.status,
                    v.id AS veiculo_id, v.modelo, v.placa
             FROM agendamento a
             JOIN veiculo v ON a.veiculo_id = v.id
             WHERE v.cliente_id = ?
             ORDER BY a.dataHora DESC`,
      [cliente_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Nenhum agendamento encontrado para este cliente." });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar agendamentos do cliente:", error);
    return res.status(500).json({ error: "Erro no servidor ao buscar agendamentos do cliente." });
  }
};

exports.editarAgendamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, horario, servico, status } = req.body;

    if (!id) {
      return res.status(400).json({ error: "O ID do agendamento é obrigatório." });
    }

    const [rows] = await pool.query("SELECT * FROM agendamento WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    const agendamentoAtual = rows[0];

    // ✅ Monta dataHora corretamente, mesmo se não vier todos os campos
    let dataHora = agendamentoAtual.dataHora;
    if (data && horario) {
      dataHora = `${data} ${horario}:00`;
    }

    await pool.query(
      `UPDATE agendamento 
       SET dataHora = ?, servico = ?, status = ? 
       WHERE id = ?`,
      [
        dataHora,
        servico || agendamentoAtual.servico,
        status || agendamentoAtual.status,
        id,
      ]
    );

    // Retorna no mesmo formato que o front espera
    return res.status(200).json({
      message: "Agendamento atualizado com sucesso.",
      agendamento: {
        id,
        servico: servico || agendamentoAtual.servico,
        dataHora,
        status: status || agendamentoAtual.status,
        veiculo_id: agendamentoAtual.veiculo_id,
      },
    });
  } catch (error) {
    console.error("Erro ao editar agendamento:", error);
    return res.status(500).json({ error: "Erro no servidor ao editar agendamento." });
  }
};


exports.deletarAgendamento = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "O ID do agendamento é obrigatório." });
    }

    const [rows] = await pool.query("SELECT * FROM agendamento WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    await pool.query("DELETE FROM agendamento WHERE id = ?", [id]);

    return res.status(200).json({ message: "Agendamento excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir agendamento:", error);
    return res.status(500).json({ error: "Erro no servidor ao excluir agendamento." });
  }
};

// ➕ Registrar indisponibilidades
exports.setIndisponibilidade = async (req, res) => {
  try {
    const { funcionario_id, datas_indisponiveis } = req.body;

    if (!funcionario_id || !Array.isArray(datas_indisponiveis)) {
      return res.status(400).json({ error: "Dados inválidos." });
    }

    // Remove todas as indisponibilidades antigas do funcionário
    await pool.query(
      "DELETE FROM indisponibilidade_funcionario WHERE funcionario_id = ?",
      [funcionario_id]
    );

    // Insere novas indisponibilidades, se houver
    if (datas_indisponiveis.length > 0) {
      const sql =
        "INSERT INTO indisponibilidade_funcionario (funcionario_id, data) VALUES " +
        datas_indisponiveis.map(() => "(?, ?)").join(", ");

      const values = datas_indisponiveis.flatMap((date) => [funcionario_id, date]);

      await pool.query(sql, values);
    }

    return res.status(200).json({ message: "Indisponibilidades atualizadas com sucesso." });
  } catch (error) {
    console.error("Erro ao salvar indisponibilidades:", error);
    return res.status(500).json({ error: "Erro no servidor ao salvar indisponibilidades." });
  }
};

// 📅 Buscar indisponibilidades por funcionário
exports.getIndisponibilidade = async (req, res) => {
  try {
    const { funcionario_id } = req.params
    const [rows] = await pool.query(
      "SELECT data FROM indisponibilidade_funcionario WHERE funcionario_id = ? ORDER BY data",
      [funcionario_id]
    )

    return res.status(200).json(rows)
  } catch (error) {
    console.error("Erro ao buscar indisponibilidades:", error)
    return res.status(500).json({ error: "Erro no servidor ao buscar indisponibilidades." })
  }
}

// ❌ Remover uma data específica
exports.removerIndisponibilidade = async (req, res) => {
  try {
    const { funcionario_id, data } = req.params
    await pool.query(
      "DELETE FROM indisponibilidade_funcionario WHERE funcionario_id = ? AND data = ?",
      [funcionario_id, data]
    )
    return res.status(200).json({ message: "Indisponibilidade removida." })
  } catch (error) {
    console.error("Erro ao remover indisponibilidade:", error)
    return res.status(500).json({ error: "Erro no servidor ao remover indisponibilidade." })
  }
}