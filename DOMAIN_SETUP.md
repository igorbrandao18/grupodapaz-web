# 🌐 Configuração do Domínio grupodapazbr.com.br

## 📋 **Passo a Passo para Configurar o Domínio**

### **1. Acessar a DigitalOcean**
- Vá para: https://cloud.digitalocean.com/networking/domains
- Faça login na sua conta

### **2. Adicionar o Domínio**
- Clique em **"Add Domain"**
- Digite: `grupodapazbr.com.br`
- Clique em **"Add Domain"**

### **3. Configurar Registros DNS**

#### **Registro A (Domínio Principal)**
- **Type**: A
- **Name**: @
- **Value**: `104.131.19.89`
- **TTL**: 3600

#### **Registro A (WWW)**
- **Type**: A  
- **Name**: www
- **Value**: `104.131.19.89`
- **TTL**: 3600

### **4. Verificar Configuração**
Após configurar, teste com:
```bash
nslookup grupodapazbr.com.br
```

### **5. URLs Finais**
Após a propagação DNS (pode levar até 24h):
- **Domínio Principal**: http://grupodapazbr.com.br:5000
- **WWW**: http://www.grupodapazbr.com.br:5000

## 🔧 **Configuração Automática (Opcional)**

Se você tiver o token da DigitalOcean, pode usar o script:

```bash
# Editar o script com seu token
nano scripts/configure-domain.sh

# Substituir "seu_token_aqui" pelo seu token real
# Executar o script
./scripts/configure-domain.sh
```

## 📊 **Status Atual**
- ✅ Servidor funcionando: http://104.131.19.89:5000
- ✅ Deploy automatizado funcionando
- ⏳ Aguardando configuração do domínio

## 🎯 **Próximos Passos**
1. Configure o domínio na DigitalOcean
2. Aguarde a propagação DNS
3. Teste o acesso via domínio
4. Configure SSL/HTTPS (opcional)
