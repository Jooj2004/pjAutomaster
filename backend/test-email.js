const notificacao = require('./controllers/notificacao');

// Email para teste (substitua pelo seu email se quiser ver o resultado na caixa de entrada)
const emailUsuario = 'pjautomaster@gmail.com';
const telefoneUsuario = '6799646781';

const runTests = async () => {
    console.log('--- Iniciando Teste de Email ---');

    // 1. Teste de Agendamento
    console.log('1. Enviando email de Agendamento...');
    try {
        await notificacao.notifyAppointment(telefoneUsuario, '05/12/2025', '10:00', emailUsuario);
        console.log('✅ Email de Agendamento enviado (verifique o console para ID).');
    } catch (e) { console.error(e); }

    // 2. Teste de Status
    console.log('\n2. Enviando email de Status (Pronto)...');
    try {
        await notificacao.notifyStatusUpdate(telefoneUsuario, 'Pronto', 'Fiat Uno (ABC-1234)', emailUsuario);
        console.log('✅ Email de Status enviado (verifique o console para ID).');
    } catch (e) { console.error(e); }

    // 3. Teste de Lembrete 48h
    console.log('\n3. Enviando email de Lembrete 48h...');
    try {
        await notificacao.notifyReminder48h(telefoneUsuario, '07/12/2025', '10:00', emailUsuario);
        console.log('✅ Email de Lembrete enviado (verifique o console para ID).');
    } catch (e) { console.error(e); }

    console.log('\n--- Fim do Teste ---');
};

runTests();
