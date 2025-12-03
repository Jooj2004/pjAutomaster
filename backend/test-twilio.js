const notificacao = require('./controllers/notificacao');

const telefoneUsuario = '6799646781'; // Seu número sem o +55, pois o controller adiciona se faltar
// Se quiser testar com outro número, altere aqui.

const runTests = async () => {
    console.log('--- Iniciando Teste Twilio ---');

    // 1. Teste de Agendamento (Usa Template)
    console.log('1. Enviando notificação de Agendamento...');
    try {
        const result1 = await notificacao.notifyAppointment(telefoneUsuario, '30/11/2025', '14:00');
        if (result1) console.log('✅ Agendamento enviado com sucesso! SID:', result1.sid);
        else console.log('❌ Falha ao enviar Agendamento.');
    } catch (e) { console.error(e); }

    // 2. Teste de Status (Texto livre ou Template dependendo da implementação)
    console.log('\n2. Enviando notificação de Status (Aguardando Peças)...');
    try {
        const result2 = await notificacao.notifyStatusUpdate(telefoneUsuario, 'Aguardando Peças', 'Fiat Uno (ABC-1234)');
        if (result2) console.log('✅ Status enviado com sucesso! SID:', result2.sid);
        else console.log('❌ Falha ao enviar Status.');
    } catch (e) { console.error(e); }

    // 3. Teste de Lembrete 48h
    console.log('\n3. Enviando Lembrete de 48h...');
    try {
        const result3 = await notificacao.notifyReminder48h(telefoneUsuario, '02/12/2025', '14:00');
        if (result3) console.log('✅ Lembrete enviado com sucesso! SID:', result3.sid);
        else console.log('❌ Falha ao enviar Lembrete.');
    } catch (e) { console.error(e); }

    console.log('\n--- Fim do Teste ---');
};

runTests();
