# 📧 Sistema de Email Corporativo - Grupo da Paz

Sistema completo de email corporativo com interface web para funcionários e painel administrativo.

## 🚀 Início Rápido

### 1. Iniciar o Sistema
```bash
./manage-email.sh start
```

### 2. Criar Usuários de Email
```bash
# Criar funcionário
./manage-email.sh create-user joao@grupodapazbr.com.br senha123 "João Silva"

# Criar gerente
./manage-email.sh create-user maria@grupodapazbr.com.br senha456 "Maria Santos"
```

### 3. Acessar Interface Web
- **URL**: `http://104.131.19.89:8080`
- **Usuário**: `joao@grupodapazbr.com.br`
- **Senha**: `senha123`

## 📋 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `./manage-email.sh start` | Iniciar sistema de email |
| `./manage-email.sh stop` | Parar sistema de email |
| `./manage-email.sh restart` | Reiniciar sistema |
| `./manage-email.sh status` | Ver status dos containers |
| `./manage-email.sh info` | Mostrar informações de acesso |
| `./manage-email.sh create-user <email> <senha> [nome]` | Criar usuário |
| `./manage-email.sh list-users` | Listar usuários |
| `./manage-email.sh change-password <email> <nova_senha>` | Alterar senha |
| `./manage-email.sh logs` | Ver logs do sistema |

## 🌐 Acessos Disponíveis

### 1. Interface Web de Email (Roundcube)
- **URL**: `http://104.131.19.89:8080`
- **Função**: Interface web para funcionários acessarem seus emails
- **Recursos**: Enviar/receber emails, calendário, contatos, etc.

### 2. Painel Administrativo
- **URL**: `http://104.131.19.89:8081`
- **Usuário Admin**: `admin@grupodapazbr.com.br`
- **Senha Admin**: `admin123456`
- **Função**: Gerenciar usuários, domínios, configurações

## 📧 Configuração de Cliente de Email

### Outlook, Thunderbird, Apple Mail, etc.

**Configurações IMAP (Receber):**
- Servidor: `104.131.19.89`
- Porta: `143` (ou `993` para SSL)
- Segurança: `STARTTLS` (ou `SSL/TLS`)

**Configurações SMTP (Enviar):**
- Servidor: `104.131.19.89`
- Porta: `587` (ou `25`)
- Segurança: `STARTTLS`
- Autenticação: `Sim`

## 🔧 Configuração DNS

Para funcionar completamente, configure os seguintes registros DNS no domínio `grupodapazbr.com.br`:

```
# Registros MX (Mail Exchange)
grupodapazbr.com.br.    IN    MX    10    mail.grupodapazbr.com.br.

# Registro A para o servidor de email
mail.grupodapazbr.com.br.    IN    A    104.131.19.89

# Registros SPF (Sender Policy Framework)
grupodapazbr.com.br.    IN    TXT   "v=spf1 mx a ip4:104.131.19.89 ~all"

# Registros DKIM (serão gerados automaticamente)
# Registros DMARC
_dmarc.grupodapazbr.com.br.    IN    TXT   "v=DMARC1; p=quarantine; rua=mailto:admin@grupodapazbr.com.br"
```

## 👥 Gerenciamento de Usuários

### Criar Funcionários
```bash
# Funcionário comum
./manage-email.sh create-user funcionario1@grupodapazbr.com.br senha123 "Funcionário 1"

# Gerente
./manage-email.sh create-user gerente@grupodapazbr.com.br senha456 "Gerente"

# Administrador
./manage-email.sh create-user admin@grupodapazbr.com.br admin123 "Administrador"
```

### Listar Usuários
```bash
./manage-email.sh list-users
```

### Alterar Senhas
```bash
./manage-email.sh change-password funcionario1@grupodapazbr.com.br nova_senha
```

## 🔒 Segurança

- ✅ **Antivírus**: ClamAV integrado
- ✅ **Antispam**: SpamAssassin integrado
- ✅ **Firewall**: Fail2ban integrado
- ✅ **TLS/SSL**: Criptografia de transporte
- ✅ **Quotas**: Limite de espaço por usuário (1GB)

## 📊 Monitoramento

### Ver Status
```bash
./manage-email.sh status
```

### Ver Logs
```bash
./manage-email.sh logs
```

### Logs Específicos
```bash
# Logs do servidor de email
docker logs mailserver

# Logs da interface web
docker logs roundcube

# Logs do painel admin
docker logs mailu-admin
```

## 🆘 Solução de Problemas

### Sistema não inicia
```bash
# Verificar se Docker está rodando
docker info

# Verificar logs de erro
docker-compose -f docker-compose.email.yml logs
```

### Usuário não consegue acessar
```bash
# Verificar se usuário existe
./manage-email.sh list-users

# Recriar usuário
./manage-email.sh create-user email@grupodapazbr.com.br senha "Nome"
```

### Emails não chegam
1. Verificar configuração DNS
2. Verificar logs do servidor: `docker logs mailserver`
3. Verificar se portas estão abertas: `netstat -tlnp | grep :25`

## 📞 Suporte

Para suporte técnico:
- Email: `admin@grupodapazbr.com.br`
- Logs: `./manage-email.sh logs`
- Status: `./manage-email.sh status`

---

**Grupo da Paz** - Sistema de Email Corporativo
