#!/bin/bash

# Script para configurar o domínio grupodapazbr.com.br na DigitalOcean
# Este script usa a API da DigitalOcean para criar os registros DNS

# Configurações
DOMAIN="grupodapazbr.com.br"
SERVER_IP="104.131.19.89"
DO_TOKEN="seu_token_aqui"  # Substitua pelo seu token da DigitalOcean

# Função para fazer requisições à API da DigitalOcean
api_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -n "$data" ]; then
        curl -s -X "$method" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $DO_TOKEN" \
            -d "$data" \
            "https://api.digitalocean.com/v2/$endpoint"
    else
        curl -s -X "$method" \
            -H "Authorization: Bearer $DO_TOKEN" \
            "https://api.digitalocean.com/v2/$endpoint"
    fi
}

echo "🌐 Configurando domínio $DOMAIN para apontar para $SERVER_IP..."

# Verificar se o domínio já existe
echo "📋 Verificando se o domínio já existe..."
response=$(api_request "GET" "domains/$DOMAIN")

if echo "$response" | grep -q '"message":"The resource you were accessing could not be found"' 2>/dev/null; then
    echo "❌ Domínio não encontrado na DigitalOcean"
    echo "📝 Você precisa:"
    echo "   1. Ir para https://cloud.digitalocean.com/networking/domains"
    echo "   2. Clicar em 'Add Domain'"
    echo "   3. Adicionar o domínio: $DOMAIN"
    echo "   4. Executar este script novamente"
    exit 1
else
    echo "✅ Domínio encontrado na DigitalOcean"
fi

# Listar registros existentes
echo "📋 Listando registros DNS existentes..."
api_request "GET" "domains/$DOMAIN/records" | jq '.domain_records[] | {type: .type, name: .name, data: .data}'

# Criar registro A para o domínio principal
echo "🔧 Criando registro A para @ (domínio principal)..."
record_data='{
    "type": "A",
    "name": "@",
    "data": "'$SERVER_IP'",
    "ttl": 3600
}'

response=$(api_request "POST" "domains/$DOMAIN/records" "$record_data")
if echo "$response" | grep -q '"id"' 2>/dev/null; then
    echo "✅ Registro A criado com sucesso"
else
    echo "⚠️  Erro ao criar registro A ou já existe"
fi

# Criar registro A para www
echo "🔧 Criando registro A para www..."
record_data='{
    "type": "A", 
    "name": "www",
    "data": "'$SERVER_IP'",
    "ttl": 3600
}'

response=$(api_request "POST" "domains/$DOMAIN/records" "$record_data")
if echo "$response" | grep -q '"id"' 2>/dev/null; then
    echo "✅ Registro A para www criado com sucesso"
else
    echo "⚠️  Erro ao criar registro A para www ou já existe"
fi

echo ""
echo "🎉 Configuração concluída!"
echo "🌐 Seu domínio estará disponível em:"
echo "   - http://$DOMAIN:5000"
echo "   - http://www.$DOMAIN:5000"
echo ""
echo "⏰ Nota: Pode levar até 24 horas para a propagação DNS completa"
echo "🔍 Para testar: nslookup $DOMAIN"
