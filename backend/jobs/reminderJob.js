const cron = require('node-cron');
const pool = require('../models/database');
const notificacaoController = require('../controllers/notificacao');

const checkReminders = async () => {
    console.log('Verificando lembretes de 48h...');
    try {
        // Calculate the time range: 48h from now
        const now = new Date();
        // Ajuste de fuso horário se necessário, mas assumindo que o servidor e o banco estão alinhados ou em UTC
        // O banco parece usar DATETIME sem timezone explícito, então assumimos local time do servidor

        const start = new Date(now.getTime() + 48 * 60 * 60 * 1000);
        const end = new Date(now.getTime() + 49 * 60 * 60 * 1000); // Janela de 1 hora

        // Formatar para SQL (YYYY-MM-DD HH:MM:SS)
        // Nota: toISOString usa UTC. Se o banco estiver em local time, isso pode dar errado.
        // Melhor usar uma biblioteca como date-fns ou moment, ou construir a string manualmente para garantir local time.
        // Vou construir manualmente para ser seguro com o ambiente local do usuário (Windows)

        const toSqlString = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        const startStr = toSqlString(start);
        const endStr = toSqlString(end);

        console.log(`Buscando agendamentos entre ${startStr} e ${endStr}`);

        const [rows] = await pool.query(`
      SELECT a.id, a.dataHora, u.telefone, u.email
      FROM agendamento a
      JOIN veiculo v ON a.veiculo_id = v.id
      JOIN cliente c ON v.cliente_id = c.id
      JOIN usuario u ON c.id = u.id
      WHERE a.dataHora BETWEEN ? AND ?
    `, [startStr, endStr]);

        if (rows.length > 0) {
            console.log(`Encontrados ${rows.length} agendamentos para lembrar.`);
            for (const row of rows) {
                const dataObj = new Date(row.dataHora);
                const data = dataObj.toLocaleDateString('pt-BR');
                const hora = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                await notificacaoController.notifyReminder48h(row.telefone, data, hora, row.email);
            }
        }
    } catch (error) {
        console.error('Erro ao verificar lembretes:', error);
    }
};

// Schedule to run every hour
const initJob = () => {
    // Executa a cada hora no minuto 0
    cron.schedule('0 * * * *', checkReminders);
    console.log('Job de lembretes iniciado.');
};

module.exports = initJob;
