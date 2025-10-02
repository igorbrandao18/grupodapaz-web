import { sendWelcomeEmail } from '../lib/resend';

async function testEmail() {
  try {
    console.log('🧪 Testando envio de email para igorbrandao18@gmail.com...');
    
    await sendWelcomeEmail(
      'igorbrandao18@gmail.com',
      'SenhaTest123!',
      'Plano Básico'
    );
    
    console.log('✅ Email enviado com sucesso! Verifique sua caixa de entrada.');
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
  }
}

testEmail();
