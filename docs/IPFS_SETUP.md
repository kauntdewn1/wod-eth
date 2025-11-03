# Configuração IPFS - WODX Protocol

## Opções de Provedores

O WODX suporta múltiplos provedores IPFS para armazenamento de vídeos:

1. **NFT.Storage** (Recomendado) - Gratuito, IPFS + Filecoin
2. **Lighthouse** - IPFS com armazenamento perpétuo
3. **IPFS Local** - Seu próprio nó IPFS rodando no Mac

---

## 📦 NFT.Storage (Recomendado)

### Por quê?
- ✅ **Gratuito** e sem limites (dentro do razoável)
- ✅ Armazenamento permanente no IPFS + Filecoin
- ✅ API simples e direta
- ✅ Você já tem a API key! 🎉

### Setup

1. **Obter API Key**
   - Acesse: https://nft.storage/
   - Faça login (GitHub/Google)
   - Vá em "API Keys"
   - Crie uma nova key

2. **Configurar no Frontend**
   ```env
   # frontend/.env
   NEXT_PUBLIC_NFTSTORAGE_API_KEY=sua_api_key_aqui
   NEXT_PUBLIC_IPFS_PROVIDER=nftstorage
   ```

3. **Pronto!** O app usará NFT.Storage automaticamente.

---

## 🪶 Lighthouse

### Setup

1. **Obter API Key**
   - Acesse: https://lighthouse.storage/
   - Faça login
   - Vá em "API Keys"
   - Crie uma nova key

2. **Configurar**
   ```env
   NEXT_PUBLIC_LIGHTHOUSE_API_KEY=sua_api_key_aqui
   ```

3. **Instalar SDK (opcional - já está no package.json)**
   ```bash
   cd frontend
   npm install @lighthouse-web3/sdk
   ```

---

## 🖥️ IPFS Local (Mac)

Se você já tem IPFS instalado no Mac, pode usar seu próprio nó!

### Verificar se IPFS está rodando

```bash
ipfs --version
# Deve retornar: ipfs version X.X.X
```

### Iniciar IPFS daemon

```bash
# Iniciar IPFS (se não estiver rodando)
ipfs daemon

# Deve mostrar:
# API server listening on /ip4/127.0.0.1/tcp/5001
# Gateway server listening on /ip4/127.0.0.1/tcp/8080
```

### Configurar no Frontend

1. **Garantir que IPFS está rodando**
   ```bash
   curl http://127.0.0.1:5001/api/v0/version
   # Deve retornar JSON com versão
   ```

2. **Usar no app**
   - O app detecta automaticamente se IPFS local está disponível
   - Ou selecione "IPFS Local" no seletor de provedor

### Vantagens do IPFS Local

- ✅ **Zero custo** (usa seu próprio armazenamento)
- ✅ **Controle total** sobre os dados
- ✅ **Acesso rápido** (não depende de rede externa)

### Desvantagens

- ⚠️ Precisa manter IPFS rodando
- ⚠️ Dados só disponíveis quando seu nó está online
- ⚠️ Recomendado para desenvolvimento/testes

---

## 🔄 Fallback Automático

O sistema tenta múltiplos provedores automaticamente:

1. Tenta o provedor escolhido
2. Se falhar, tenta os outros disponíveis
3. Erro só se nenhum funcionar

### Exemplo de Fluxo

```
Usuário escolhe: NFT.Storage
  ↓
Falha? → Tenta Lighthouse
  ↓
Falha? → Tenta IPFS Local
  ↓
Tudo falhou? → Erro para usuário
```

---

## 🎯 Qual Usar?

### Para Produção
- **NFT.Storage** ou **Lighthouse** (armazenamento permanente na nuvem)

### Para Desenvolvimento
- **IPFS Local** (mais rápido, zero latência)

### Para Máxima Confiabilidade
- Configure **ambos** NFT.Storage e Lighthouse
- O sistema usará fallback automático

---

## 📝 Variáveis de Ambiente Completas

```env
# Preferência do provedor
NEXT_PUBLIC_IPFS_PROVIDER=nftstorage
# Opções: nftstorage, lighthouse, local

# API Keys
NEXT_PUBLIC_NFTSTORAGE_API_KEY=sua_key_aqui
NEXT_PUBLIC_LIGHTHOUSE_API_KEY=sua_key_aqui

# IPFS Local (opcional)
NEXT_PUBLIC_IPFS_LOCAL_GATEWAY=http://127.0.0.1:5001
```

---

## 🧪 Testar Configuração

### Verificar se NFT.Storage está funcionando

```bash
curl -X POST \
  -H "Authorization: Bearer SUA_API_KEY" \
  -F "file=@test-video.mp4" \
  https://api.nft.storage/upload
```

### Verificar se Lighthouse está funcionando

```bash
# Use o SDK no código ou interface web
# https://lighthouse.storage/
```

### Verificar se IPFS Local está funcionando

```bash
# Versão
curl http://127.0.0.1:5001/api/v0/version

# Adicionar arquivo teste
ipfs add test-video.mp4

# Verificar gateway
curl http://127.0.0.1:8080/ipfs/QmYourCID
```

---

## 🚀 Pronto!

Agora você pode:

1. Configurar NFT.Storage (recomendado)
2. Ou usar Lighthouse
3. Ou usar IPFS local (dev)
4. Ou todos juntos com fallback automático!

O app detecta automaticamente quais provedores estão disponíveis e mostra no componente `IPFSStatus`.

---

## 💡 Dica Pro

Para máxima redundância em produção:
1. Configure NFT.Storage (backup principal)
2. Configure Lighthouse (backup secundário)
3. Mantenha IPFS local para desenvolvimento rápido

O sistema fará fallback automático se algum falhar! 🎯

