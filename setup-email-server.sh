#!/bin/bash

echo "=========================================="
echo "  SERVIDOR DE EMAIL CORPORATIVO"
echo "  Grupo da Paz - Configuração Completa"
echo "=========================================="
echo ""

# Gerar chaves de segurança
echo "🔐 Gerando chaves de segurança..."
SECRET_KEY=$(openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -hex 16)
DB_ROOT_PASSWORD=$(openssl rand -hex 16)
REDIS_PASSWORD=$(openssl rand -hex 16)

echo "SECRET_KEY=$SECRET_KEY" > mailu.env
echo "MAILU_DB_PASSWORD=$DB_PASSWORD" >> mailu.env
echo "MAILU_DB_ROOT_PASSWORD=$DB_ROOT_PASSWORD" >> mailu.env
echo "MAILU_REDIS_PASSWORD=$REDIS_PASSWORD" >> mailu.env
echo "DOMAIN=grupodapazbr.com.br" >> mailu.env
echo "HOSTNAMES=mail.grupodapazbr.com.br" >> mailu.env
echo "POSTMASTER=admin@grupodapazbr.com.br" >> mailu.env
echo "TZ=America/Fortaleza" >> mailu.env
echo "INITIAL_ADMIN_ACCOUNT=admin@grupodapazbr.com.br" >> mailu.env
echo "INITIAL_ADMIN_PASSWORD=admin123456" >> mailu.env
echo "DEFAULT_QUOTA=1000000000" >> mailu.env
echo "ENABLE_SPAMASSASSIN=true" >> mailu.env
echo "ENABLE_CLAMAV=true" >> mailu.env
echo "ENABLE_RSPAMD=true" >> mailu.env
echo "BACKUP_RETENTION_DAYS=30" >> mailu.env

echo "✅ Chaves geradas e salvas em mailu.env"
echo ""

# Configurar DNS (instruções)
echo "🌐 CONFIGURAÇÃO DNS NECESSÁRIA:"
echo "Adicione estes registros DNS no seu provedor:"
echo ""
echo "Tipo: A     Nome: mail.grupodapazbr.com.br    Valor: 104.131.19.89"
echo "Tipo: MX    Nome: grupodapazbr.com.br         Valor: mail.grupodapazbr.com.br (Prioridade: 10)"
echo "Tipo: TXT   Nome: grupodapazbr.com.br         Valor: v=spf1 mx ~all"
echo "Tipo: TXT   Nome: _dmarc.grupodapazbr.com.br  Valor: v=DMARC1; p=quarantine; rua=mailto:admin@grupodapazbr.com.br"
echo ""

echo "📧 ACESSOS APÓS CONFIGURAÇÃO:"
echo ""
echo "1. 🌐 Site Principal:"
echo "   https://grupodapazbr.com.br"
echo ""
echo "2. ⚙️ Painel Admin (Criar usuários):"
echo "   https://grupodapazbr.com.br/admin"
echo "   Login: admin@grupodapazbr.com.br"
echo "   Senha: admin123456"
echo ""
echo "3. 📨 Webmail (Funcionários):"
echo "   https://grupodapazbr.com.br/webmail"
echo ""
echo "4. 📬 Configuração de Cliente de Email:"
echo "   Servidor SMTP: mail.grupodapazbr.com.br:587 (TLS)"
echo "   Servidor IMAP: mail.grupodapazbr.com.br:993 (SSL)"
echo "   Servidor POP3: mail.grupodapazbr.com.br:995 (SSL)"
echo ""

echo "🚀 Para iniciar o servidor:"
echo "docker-compose -f docker-compose.prod.yml up -d"
echo ""

echo "📋 FUNCIONALIDADES INCLUÍDAS:"
echo "✅ Criação de usuários pelo admin"
echo "✅ Webmail completo (Roundcube)"
echo "✅ Anti-spam e anti-vírus"
echo "✅ Backup automático"
echo "✅ Quotas por usuário"
echo "✅ SSL/TLS automático"
echo "✅ Interface similar ao G Suite"
echo ""

echo "⚠️ IMPORTANTE:"
echo "1. Configure os registros DNS antes de usar"
echo "2. O primeiro login será admin@grupodapazbr.com.br"
echo "3. Crie usuários através do painel admin"
echo "4. Configure certificados SSL para mail.grupodapazbr.com.br"
echo ""

echo "=========================================="
echo "✅ Configuração concluída!"
echo "=========================================="
