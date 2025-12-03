const accountSid = 'AC050a6130836054237bd0656140061731';
const authToken = '4824ef8c742fda6be7a96294a9ad4c2e';
const client = require('twilio')(accountSid, authToken);
const nodemailer = require('nodemailer');

// Configuração do Nodemailer para Gmail
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true para 465, false para outras portas
    auth: {
        user: 'pjautomaster@gmail.com',
        pass: 'deat pndj rxdq nxvo'
    }
});

// Helper function to send WhatsApp messages
const sendWhatsAppMessage = async (to, body, contentSid = null, contentVariables = null) => {
    try {
        const messageOptions = {
            from: 'whatsapp:+14155238886',
            to: `whatsapp:${to}`
        };

        if (contentSid && contentVariables) {
            messageOptions.contentSid = contentSid;
            messageOptions.contentVariables = JSON.stringify(contentVariables);
        } else {
            messageOptions.body = body;
        }

        const message = await client.messages.create(messageOptions);
        console.log(`Mensagem WhatsApp enviada: ${message.sid}`);
        return message;
    } catch (error) {
        console.error('Erro ao enviar mensagem Twilio:', error);
        // Don't throw error to avoid breaking the main flow, just log it
        return null;
    }
};

// Helper function to send Emails
const sendEmail = async (to, subject, htmlContent) => {
    if (!to) {
        console.log('Email não enviado: Destinatário não informado.');
        return;
    }
    try {
        const info = await transporter.sendMail({
            from: '"PJ Automaster" <pjautomaster@gmail.com>',
            to: to,
            subject: subject,
            html: htmlContent
        });
        console.log(`Email enviado: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        return null;
    }
};

// Templates HTML Profissionais
const getHeader = () => `
    <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-family: Arial, sans-serif;">PJ Automaster</h1>
    </div>
`;

const getFooter = () => `
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; color: #666; font-family: Arial, sans-serif; font-size: 12px;">
        <p>© ${new Date().getFullYear()} PJ Automaster. Todos os direitos reservados.</p>
        <p>Este é um email automático, por favor não responda.</p>
    </div>
`;

const getBodyStyle = () => `
    font-family: Arial, sans-serif; 
    color: #333; 
    line-height: 1.6; 
    padding: 20px; 
    background-color: #ffffff;
`;

exports.notifyAppointment = async (clienteTelefone, data, hora, clienteEmail = null) => {
    // Formata o telefone para o padrão E.164 se necessário (ex: +55...)
    // Assumindo que o telefone já vem com DDI ou trataremos aqui
    const formattedPhone = clienteTelefone.startsWith('+') ? clienteTelefone : `+55${clienteTelefone}`;

    // Usando o template fornecido pelo usuário para agendamento
    // contentSid: 'HX350d429d32e64a552466cafecbe95f3c'
    // contentVariables: '{"1":"12/1","2":"3pm"}'

    const variables = {
        "1": data, // Data
        "2": hora  // Hora
    };

    // Enviar WhatsApp
    await sendWhatsAppMessage(formattedPhone, null, 'HX350d429d32e64a552466cafecbe95f3c', variables);

    // Enviar Email
    if (clienteEmail) {
        const html = `
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                ${getHeader()}
                <div style="${getBodyStyle()}">
                    <h2 style="color: #2c3e50;">Agendamento Confirmado!</h2>
                    <p>Olá,</p>
                    <p>Seu agendamento foi confirmado com sucesso.</p>
                    <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Data:</strong> ${data}</p>
                        <p style="margin: 5px 0;"><strong>Horário:</strong> ${hora}</p>
                    </div>
                    <p>Estamos ansiosos para atendê-lo!</p>
                </div>
                ${getFooter()}
            </div>
        `;
        await sendEmail(clienteEmail, 'Confirmação de Agendamento - PJ Automaster', html);
    }
};

exports.notifyReminder48h = async (clienteTelefone, data, hora, clienteEmail = null) => {
    const formattedPhone = clienteTelefone.startsWith('+') ? clienteTelefone : `+55${clienteTelefone}`;

    // Se tiver um template específico para lembrete, usar aqui.
    // Caso contrário, tentamos enviar texto livre (pode falhar se não for template aprovado fora da janela de 24h)
    const message = `Lembrete: Seu agendamento na Automaster é em 48 horas, dia ${data} às ${hora}.`;

    // Enviar WhatsApp
    await sendWhatsAppMessage(formattedPhone, message);

    // Enviar Email
    if (clienteEmail) {
        const html = `
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                ${getHeader()}
                <div style="${getBodyStyle()}">
                    <h2 style="color: #e67e22;">Lembrete de Agendamento</h2>
                    <p>Olá,</p>
                    <p>Este é um lembrete de que você tem um agendamento chegando em breve.</p>
                    <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Data:</strong> ${data}</p>
                        <p style="margin: 5px 0;"><strong>Horário:</strong> ${hora}</p>
                    </div>
                    <p>Caso precise reagendar, entre em contato conosco o mais breve possível.</p>
                </div>
                ${getFooter()}
            </div>
        `;
        await sendEmail(clienteEmail, 'Lembrete de Agendamento - PJ Automaster', html);
    }
};

exports.notifyStatusUpdate = async (clienteTelefone, status, veiculoInfo, clienteEmail = null) => {
    const formattedPhone = clienteTelefone.startsWith('+') ? clienteTelefone : `+55${clienteTelefone}`;
    let message = '';
    let emailSubject = '';
    let emailBody = '';
    let color = '#333';

    if (status === 'Aguardando Peças') {
        message = `Olá! O status do seu veículo ${veiculoInfo} mudou para: Aguardando Peças. Avisaremos assim que chegarem.`;
        emailSubject = 'Atualização de Status: Aguardando Peças';
        emailBody = `<p>O status do seu veículo <strong>${veiculoInfo}</strong> foi atualizado para <strong>Aguardando Peças</strong>.</p><p>Estamos aguardando a chegada dos componentes necessários para prosseguir com o serviço. Avisaremos assim que tivermos novidades.</p>`;
        color = '#f39c12';
    } else if (status === 'Pronto' || status === 'Concluído') { // Ajustar conforme os status reais do sistema
        message = `Olá! Seu veículo ${veiculoInfo} está pronto e já pode ser retirado na Automaster.`;
        emailSubject = 'Seu Veículo está Pronto!';
        emailBody = `<p>Boas notícias! O serviço no seu veículo <strong>${veiculoInfo}</strong> foi concluído.</p><p>Ele já está pronto e pode ser retirado em nossa oficina.</p>`;
        color = '#27ae60';
    } else {
        return; // Não notificar outros status por enquanto
    }

    // Enviar WhatsApp
    await sendWhatsAppMessage(formattedPhone, message);

    // Enviar Email
    if (clienteEmail) {
        const html = `
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                ${getHeader()}
                <div style="${getBodyStyle()}">
                    <h2 style="color: ${color};">${emailSubject}</h2>
                    <p>Olá,</p>
                    ${emailBody}
                    <p>Obrigado por confiar na PJ Automaster!</p>
                </div>
                ${getFooter()}
            </div>
        `;
        await sendEmail(clienteEmail, `${emailSubject} - PJ Automaster`, html);
    }
};
