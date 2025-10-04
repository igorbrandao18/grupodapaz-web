# 🎯 Configuração Final - Deploy Automatizado

## ✅ O que foi configurado:

### 📦 Docker
- ✅ Dockerfile otimizado para produção
- ✅ docker-compose.yml para desenvolvimento
- ✅ docker-compose.prod.yml para produção
- ✅ .dockerignore configurado

### 🔄 CI/CD
- ✅ GitHub Actions workflow configurado
- ✅ Build automático de imagem Docker
- ✅ Push para GitHub Container Registry
- ✅ Deploy automático no servidor DigitalOcean

### 🖥️ Servidor DigitalOcean
- ✅ Script de configuração do servidor
- ✅ Sistema de serviço systemd
- ✅ Firewall configurado
- ✅ Scripts de deploy automatizado

## 🚀 Como usar:

### 1. Configurar Servidor (Execute uma vez)
```bash
./scripts/configure-server.sh
```

### 2. Configurar GitHub Secrets
No seu repositório GitHub, vá em Settings > Secrets and variables > Actions e adicione:

- `DO_HOST`: 104.131.19.89
- `DO_USERNAME`: root
- `DO_SSH_KEY`: Sua chave privada SSH
- `GITHUB_TOKEN`: Seu token de acesso pessoal do GitHub

### 3. Configurar Variáveis de Ambiente no Servidor
```bash
ssh root@104.131.19.89
nano /opt/grupodapaz-web/.env
# Configure suas variáveis de ambiente
```

### 4. Deploy Automático
Agora, a cada push na branch `main`, o deploy será automático!

## 🔧 Comandos Úteis:

### Desenvolvimento Local
```bash
./scripts/dev.sh
```

### Deploy Manual
```bash
ssh root@104.131.19.89
cd /opt/grupodapaz-web
./deploy.sh
```

### Verificar Status
```bash
ssh root@104.131.19.89
sudo systemctl status grupodapaz-web
docker ps
```

## 🌐 URLs:
- **Aplicação**: http://104.131.19.89:5000
- **Domínio**: http://logosfm.com.br:5000

## 📊 Monitoramento:
- **Logs da aplicação**: `docker-compose logs -f`
- **Logs do sistema**: `sudo journalctl -u grupodapaz-web -f`
- **Status dos containers**: `docker ps`

---

**🎉 Sua aplicação está pronta para deploy automatizado!**

Agora você pode fazer push para a branch `main` e o deploy será automático!
