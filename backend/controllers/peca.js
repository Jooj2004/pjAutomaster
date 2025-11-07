const pool = require('../models/database');

exports.createPeca = async (req, res) => {
  try {
    const { nome, quantidade, precoUnitario, ordemServico_id } = req.body;

    if (!nome || quantidade == null || precoUnitario == null || !ordemServico_id) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios: nome, quantidade, precoUnitario, ordemServico_id.' });
    }

    const qtd = parseInt(quantidade, 10);
    const preco = parseFloat(precoUnitario);

    if (Number.isNaN(qtd) || Number.isNaN(preco)) {
      return res.status(400).json({ error: 'Quantidade e precoUnitario devem ser números válidos.' });
    }

    // Opcional: verificar se a ordem de serviço existe (evita FK errors)
    const [osRows] = await pool.query('SELECT id FROM ordemservico WHERE id = ?', [ordemServico_id]);
    if (osRows.length === 0) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada.' });
    }

    const [result] = await pool.query(
      `INSERT INTO peca (nome, quantidade, precoUnitario, ordemServico_id)
       VALUES (?, ?, ?, ?)`,
      [nome, qtd, preco, ordemServico_id]
    );

    const novaPeca = {
      id: result.insertId,
      nome,
      quantidade: qtd,
      precoUnitario: preco,
      ordemServico_id
    };

    return res.status(201).json({ message: 'Peça criada com sucesso.', peca: novaPeca });
  } catch (error) {
    console.error('Erro ao criar peça:', error);
    return res.status(500).json({ error: 'Erro no servidor ao criar peça.' });
  }
};
