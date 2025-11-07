const pool = require('./database'); // Importe a conexão do banco de dados

// Lista eventos em um intervalo de datas
exports.listEvents = async ({ start, end }) => {
    const query = 'SELECT id, title, start, end FROM events WHERE start >= ? AND end <= ?';
    const [rows] = await pool.execute(query, [start, end]);
    return rows;
};

// Cria um novo evento
exports.createEvent = async (eventData) => {
    const { title, start, end } = eventData;
    const query = 'INSERT INTO events (title, start, end) VALUES (?, ?, ?)';
    const [result] = await pool.execute(query, [title, start, end]);
    return { id: result.insertId, ...eventData };
};

// Atualiza um evento
exports.updateEvent = async (id, eventData) => {
    const { start, end } = eventData;
    const query = 'UPDATE events SET start = ?, end = ? WHERE id = ?';
    const [result] = await pool.execute(query, [start, end, id]);
    return result.affectedRows > 0;
};

// Deleta um evento
exports.deleteEvent = async (id) => {
    const query = 'DELETE FROM events WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
};