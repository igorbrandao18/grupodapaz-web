#!/bin/bash

# Script para configurar o servidor DigitalOcean automaticamente
# Execute este script localmente para configurar o servidor remoto

set -e

SERVER_IP="104.131.19.89"
SERVER_USER="root"

echo "🚀 Configurando servidor DigitalOcean para deploy..."

# Verificar se temos acesso SSH
echo "🔐 Verificando acesso SSH..."
if ! ssh -o ConnectTimeout=10 $SERVER_USER@$SERVER_IP "echo 'SSH OK'" > /dev/null 2>&1; then
    echo "❌ Erro: Não foi possível conectar ao servidor via SSH"
    echo "   Verifique se:"
    echo "   1. O servidor está rodando"
    echo "   2. Você tem a senha/chave SSH correta"
    echo "   3. O firewall permite conexões SSH"
    exit 1
fi

echo "✅ Conexão SSH estabelecida"

# Copiar script de configuração para o servidor
echo "📁 Copiando script de configuração..."
scp scripts/setup-server.sh $SERVER_USER@$SERVER_IP:/tmp/setup-server.sh

# Executar script de configuração no servidor
echo "⚙️ Executando configuração do servidor..."
ssh $SERVER_USER@$SERVER_IP "chmod +x /tmp/setup-server.sh && /tmp/setup-server.sh"

# Copiar arquivos de configuração
echo "📋 Copiando arquivos de configuração..."
scp docker-compose.prod.yml $SERVER_USER@$SERVER_IP:/opt/grupodapaz-web/
scp env.example $SERVER_USER@$SERVER_IP:/opt/grupodapaz-web/.env

echo ""
echo "🎉 Configuração do servidor concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. SSH no servidor: ssh $SERVER_USER@$SERVER_IP"
echo "2. Editar variáveis de ambiente:"
echo "   nano /opt/grupodapaz-web/.env"
echo "3. Atualizar docker-compose.prod.yml com seu usuário GitHub:"
echo "   nano /opt/grupodapaz-web/docker-compose.prod.yml"
echo "4. Configurar GitHub Secrets no seu repositório:"
echo "   - DO_HOST: $SERVER_IP"
echo "   - DO_USERNAME: $SERVER_USER"
echo "   - DO_SSH_KEY: (sua chave privada SSH)"
echo "   - GITHUB_TOKEN: (seu token GitHub)"
echo ""
echo "🌐 Sua aplicação estará disponível em: http://$SERVER_IP:5000"
echo ""
echo "💡 Para testar o deploy manualmente:"
echo "   ssh $SERVER_USER@$SERVER_IP"
echo "   cd /opt/grupodapaz-web"
echo "   ./deploy.sh"
