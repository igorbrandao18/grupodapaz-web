# 🚀 Grupo da Paz Web - Docker & CI/CD Setup

Este projeto está configurado para deploy automatizado via Docker e GitHub Actions na DigitalOcean.

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Conta na DigitalOcean
- Repositório no GitHub
- Variáveis de ambiente configuradas

## 🛠️ Configuração Local

### 1. Configurar Variáveis de Ambiente

```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

### 2. Executar Localmente

```bash
# Tornar scripts executáveis
chmod +x scripts/*.sh

# Executar aplicação localmente
./scripts/dev.sh
```

### 3. Comandos Úteis

```bash
# Ver logs
docker-compose logs -f

# Parar aplicação
docker-compose down

# Reconstruir containers
docker-compose up --build

# Acessar banco de dados
docker-compose exec postgres psql -U postgres -d grupodapaz
```

## 🌐 Deploy na DigitalOcean

### 1. Configurar Servidor

Execute o script de configuração no servidor DigitalOcean:

```bash
# No servidor DigitalOcean
curl -fsSL https://raw.githubusercontent.com/SEU-USUARIO/grupodapaz-web/main/scripts/setup-server.sh | bash
```

### 2. Configurar GitHub Secrets

No seu repositório GitHub, adicione os seguintes secrets:

- `DO_HOST`: IP do seu servidor DigitalOcean
- `DO_USERNAME`: usuário SSH do servidor
- `DO_SSH_KEY`: chave privada SSH
- `GITHUB_TOKEN`: token de acesso pessoal do GitHub

### 3. Configurar Variáveis de Ambiente no Servidor

```bash
# No servidor DigitalOcean
sudo nano /opt/grupodapaz-web/.env
# Configure suas variáveis de ambiente
```

### 4. Atualizar docker-compose.prod.yml

```bash
# No servidor DigitalOcean
sudo nano /opt/grupodapaz-web/docker-compose.prod.yml
# Atualize o nome da imagem com seu usuário GitHub
```

## 🔄 CI/CD com GitHub Actions

O workflow está configurado para:

1. **Build**: Construir imagem Docker
2. **Push**: Enviar para GitHub Container Registry
3. **Deploy**: Deploy automático no servidor DigitalOcean

### Trigger do Deploy

- Push na branch `main` → Deploy automático
- Pull Request → Build de teste

## 📁 Estrutura de Arquivos

```
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions workflow
├── scripts/
│   ├── dev.sh                 # Script para desenvolvimento local
│   └── setup-server.sh        # Script de configuração do servidor
├── Dockerfile                 # Imagem Docker da aplicação
├── docker-compose.yml         # Docker Compose para desenvolvimento
├── docker-compose.prod.yml    # Docker Compose para produção
├── .dockerignore              # Arquivos ignorados pelo Docker
└── .env                       # Variáveis de ambiente (criar a partir do env.example)
```

## 🔧 Comandos de Manutenção

### No Servidor DigitalOcean

```bash
# Verificar status do serviço
sudo systemctl status grupodapaz-web

# Iniciar serviço
sudo systemctl start grupodapaz-web

# Parar serviço
sudo systemctl stop grupodapaz-web

# Ver logs da aplicação
docker-compose -f /opt/grupodapaz-web/docker-compose.prod.yml logs -f

# Atualizar aplicação manualmente
cd /opt/grupodapaz-web
./deploy.sh
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de permissão SSH**
   ```bash
   chmod 600 ~/.ssh/id_rsa
   ```

2. **Container não inicia**
   ```bash
   docker-compose logs app
   ```

3. **Erro de conexão com banco**
   - Verificar variável `DATABASE_URL` no `.env`

4. **Erro de build no GitHub Actions**
   - Verificar se todos os secrets estão configurados
   - Verificar se o Dockerfile está correto

### Logs Úteis

```bash
# Logs da aplicação
docker-compose logs -f app

# Logs do sistema
sudo journalctl -u grupodapaz-web -f

# Status dos containers
docker ps -a
```

## 📞 Suporte

Para problemas ou dúvidas:

1. Verifique os logs da aplicação
2. Consulte a documentação do Docker
3. Verifique a configuração das variáveis de ambiente
4. Teste localmente antes de fazer deploy

---

**🎉 Sua aplicação está pronta para deploy automatizado!**
