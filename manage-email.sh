#!/bin/bash

# Script para gerenciar sistema de email corporativo
# Grupo da Paz

set -e

DOMAIN="grupodapazbr.com.br"
COMPOSE_FILE="docker-compose.email.yml"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Sistema de Email Corporativo${NC}"
    echo -e "${BLUE}  Grupo da Paz${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Função para iniciar o sistema de email
start_email_system() {
    print_header
    print_info "Iniciando sistema de email corporativo..."
    
    # Verificar se Docker está rodando
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker não está rodando!"
        exit 1
    fi
    
    # Iniciar containers
    docker-compose -f $COMPOSE_FILE up -d
    
    print_success "Sistema de email iniciado!"
    print_info "Aguardando inicialização dos serviços..."
    sleep 30
    
    show_access_info
}

# Função para parar o sistema de email
stop_email_system() {
    print_header
    print_info "Parando sistema de email..."
    
    docker-compose -f $COMPOSE_FILE down
    
    print_success "Sistema de email parado!"
}

# Função para mostrar informações de acesso
show_access_info() {
    print_header
    print_success "Sistema de email configurado com sucesso!"
    echo ""
    print_info "📧 ACESSOS DISPONÍVEIS:"
    echo ""
    echo -e "${GREEN}1. Interface Web de Email (Roundcube):${NC}"
    echo -e "   URL: http://$(hostname -I | awk '{print $1}'):8080"
    echo -e "   Usuário: admin@$DOMAIN"
    echo -e "   Senha: admin123456"
    echo ""
    echo -e "${GREEN}2. Interface de Administração:${NC}"
    echo -e "   URL: http://$(hostname -I | awk '{print $1}'):8081"
    echo -e "   Usuário: admin@$DOMAIN"
    echo -e "   Senha: admin123456"
    echo ""
    echo -e "${GREEN}3. Configurações de Cliente de Email:${NC}"
    echo -e "   Servidor IMAP: $(hostname -I | awk '{print $1}')"
    echo -e "   Porta IMAP: 143 (ou 993 para SSL)"
    echo -e "   Servidor SMTP: $(hostname -I | awk '{print $1}')"
    echo -e "   Porta SMTP: 587 (ou 25)"
    echo ""
    print_warning "IMPORTANTE: Configure os registros DNS do domínio $DOMAIN"
    print_warning "para apontar para este servidor!"
}

# Função para criar usuário de email
create_email_user() {
    print_header
    print_info "Criando usuário de email..."
    
    if [ $# -lt 2 ]; then
        print_error "Uso: $0 create-user <email> <senha> [nome]"
        echo "Exemplo: $0 create-user joao@grupodapazbr.com.br senha123 \"João Silva\""
        exit 1
    fi
    
    EMAIL=$1
    PASSWORD=$2
    NAME=${3:-"Usuário"}
    
    # Verificar se o container está rodando
    if ! docker ps | grep -q mailserver; then
        print_error "Sistema de email não está rodando!"
        print_info "Execute: $0 start"
        exit 1
    fi
    
    # Criar usuário no mailserver
    docker exec mailserver setup.sh email add $EMAIL $PASSWORD
    
    print_success "Usuário $EMAIL criado com sucesso!"
    print_info "Senha: $PASSWORD"
    print_info "O usuário pode acessar em: http://$(hostname -I | awk '{print $1}'):8080"
}

# Função para listar usuários
list_email_users() {
    print_header
    print_info "Listando usuários de email..."
    
    if ! docker ps | grep -q mailserver; then
        print_error "Sistema de email não está rodando!"
        exit 1
    fi
    
    docker exec mailserver setup.sh email list
}

# Função para alterar senha
change_password() {
    print_header
    print_info "Alterando senha do usuário..."
    
    if [ $# -lt 2 ]; then
        print_error "Uso: $0 change-password <email> <nova_senha>"
        exit 1
    fi
    
    EMAIL=$1
    NEW_PASSWORD=$2
    
    if ! docker ps | grep -q mailserver; then
        print_error "Sistema de email não está rodando!"
        exit 1
    fi
    
    docker exec mailserver setup.sh email update $EMAIL $NEW_PASSWORD
    
    print_success "Senha alterada para $EMAIL!"
}

# Função para mostrar status
show_status() {
    print_header
    print_info "Status do sistema de email..."
    
    echo ""
    echo -e "${GREEN}Containers:${NC}"
    docker-compose -f $COMPOSE_FILE ps
    
    echo ""
    echo -e "${GREEN}Logs recentes:${NC}"
    docker-compose -f $COMPOSE_FILE logs --tail=10
}

# Função para mostrar ajuda
show_help() {
    print_header
    echo "Comandos disponíveis:"
    echo ""
    echo "  start              - Iniciar sistema de email"
    echo "  stop               - Parar sistema de email"
    echo "  restart            - Reiniciar sistema de email"
    echo "  status             - Mostrar status do sistema"
    echo "  info               - Mostrar informações de acesso"
    echo "  create-user        - Criar usuário de email"
    echo "  list-users         - Listar usuários"
    echo "  change-password    - Alterar senha de usuário"
    echo "  logs               - Mostrar logs"
    echo "  help               - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 start"
    echo "  $0 create-user joao@grupodapazbr.com.br senha123 \"João Silva\""
    echo "  $0 change-password joao@grupodapazbr.com.br nova_senha"
    echo "  $0 list-users"
}

# Função principal
main() {
    case "${1:-help}" in
        start)
            start_email_system
            ;;
        stop)
            stop_email_system
            ;;
        restart)
            stop_email_system
            sleep 5
            start_email_system
            ;;
        status)
            show_status
            ;;
        info)
            show_access_info
            ;;
        create-user)
            shift
            create_email_user "$@"
            ;;
        list-users)
            list_email_users
            ;;
        change-password)
            shift
            change_password "$@"
            ;;
        logs)
            docker-compose -f $COMPOSE_FILE logs -f
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Comando desconhecido: $1"
            show_help
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@"
