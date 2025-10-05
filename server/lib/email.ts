import nodemailer from 'nodemailer';

// Configuração do transporter SMTP
const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST || 'localhost';
  const smtpPort = parseInt(process.env.SMTP_PORT || '1025');
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPass = process.env.SMTP_PASS || '';
  const smtpFrom = process.env.SMTP_FROM || 'noreply@grupodapazbr.com.br';

  return nodemailer.createTransporter({
    host: smtpHost,
    port: smtpPort,
    secure: false, // true para 465, false para outras portas
    auth: smtpUser && smtpPass ? {
      user: smtpUser,
      pass: smtpPass,
    } : undefined,
    tls: {
      rejectUnauthorized: false // Para desenvolvimento/testes
    }
  });
};

export async function sendWelcomeEmail(email: string, password: string, planName: string) {
  try {
    const transporter = createTransporter();
    const smtpFrom = process.env.SMTP_FROM || 'noreply@grupodapazbr.com.br';

    const mailOptions = {
      from: smtpFrom,
      to: email,
      subject: 'Bem-vindo ao Grupo da Paz - Acesso ao Portal do Cliente',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #28803d; text-align: center;">Grupo da Paz</h1>
          <h2 style="color: #333;">Bem-vindo!</h2>
          
          <p>Olá,</p>
          
          <p>Seu pagamento foi confirmado com sucesso! Você agora tem acesso ao <strong>${planName}</strong>.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #28803d;">Seus Dados de Acesso</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Senha:</strong> ${password}</p>
          </div>
          
          <p>Acesse o Portal do Cliente clicando no botão abaixo:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://grupodapazbr.com.br/portal" 
               style="background-color: #28803d; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Acessar Portal do Cliente
            </a>
          </div>
          
          <p><strong>Importante:</strong> Por segurança, recomendamos que você altere sua senha no primeiro acesso.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            Grupo da Paz - Há mais de 30 anos cuidando de você e sua família<br>
            Em caso de dúvidas, entre em contato conosco: (85) 3456-7890
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de boas-vindas enviado:', email, 'Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Falha ao enviar email de boas-vindas:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  try {
    const transporter = createTransporter();
    const smtpFrom = process.env.SMTP_FROM || 'noreply@grupodapazbr.com.br';

    const mailOptions = {
      from: smtpFrom,
      to: email,
      subject: 'Redefinição de Senha - Grupo da Paz',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #28803d; text-align: center;">Grupo da Paz</h1>
          <h2 style="color: #333;">Redefinição de Senha</h2>
          
          <p>Olá,</p>
          
          <p>Você solicitou a redefinição de sua senha. Clique no botão abaixo para criar uma nova senha:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://grupodapazbr.com.br/reset-password?token=${resetToken}" 
               style="background-color: #28803d; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Redefinir Senha
            </a>
          </div>
          
          <p><strong>Importante:</strong> Este link expira em 1 hora por motivos de segurança.</p>
          
          <p>Se você não solicitou esta redefinição, ignore este email.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            Grupo da Paz - Há mais de 30 anos cuidando de você e sua família<br>
            Em caso de dúvidas, entre em contato conosco: (85) 3456-7890
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de redefinição enviado:', email, 'Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Falha ao enviar email de redefinição:', error);
    throw error;
  }
}

export async function sendContactEmail(name: string, email: string, message: string) {
  try {
    const transporter = createTransporter();
    const smtpFrom = process.env.SMTP_FROM || 'noreply@grupodapazbr.com.br';

    const mailOptions = {
      from: smtpFrom,
      to: 'contato@grupodapazbr.com.br', // Email da empresa
      subject: `Nova mensagem de contato de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #28803d; text-align: center;">Grupo da Paz</h1>
          <h2 style="color: #333;">Nova Mensagem de Contato</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #28803d;">Dados do Cliente</h3>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Mensagem</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            Grupo da Paz - Há mais de 30 anos cuidando de você e sua família<br>
            Responda diretamente para: ${email}
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de contato enviado:', email, 'Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Falha ao enviar email de contato:', error);
    throw error;
  }
}

// Função para testar a conexão SMTP
export async function testEmailConnection() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Conexão SMTP verificada com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Falha na verificação SMTP:', error);
    return false;
  }
}
