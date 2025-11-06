# Como Rodar o Frontend - WOD [X] PRO

**Domain**: `wod.eth` | **Token**: `$WOD`

## 🚀 Início Rápido

### Opção 1: Makefile (Recomendado)

```bash
# Na raiz do projeto
make dev
```

### Opção 2: NPM Direto

```bash
# Na raiz do projeto
npm run dev

# Ou diretamente no frontend
cd frontend
npm run dev
```

---

## 📍 Onde Acessar

Após iniciar, o frontend estará disponível em:

**http://localhost:3000**

O Next.js mostrará no terminal:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
```

---

## ⚙️ Configuração Necessária

### 1. Variáveis de Ambiente

Certifique-se de ter um arquivo `frontend/.env` com:

```env
# Alchemy (obrigatório para conectar)
NEXT_PUBLIC_ALCHEMY_API_KEY=sua_key_aqui

# IPFS (pelo menos um)
NEXT_PUBLIC_NFTSTORAGE_API_KEY=sua_key_aqui
# OU
NEXT_PUBLIC_LIGHTHOUSE_API_KEY=sua_key_aqui

# Chain
NEXT_PUBLIC_CHAIN_ID=80001
```

### 2. Contratos Deployados (Opcional para teste)

Para testar funcionalidades completas, você precisa:

1. **Rodar Hardhat node** (Terminal 1):

```bash
make dev-contracts
# ou
cd contracts && npx hardhat node
```

2. **Deploy dos contratos** (Terminal 2):

```bash
make deploy-local
# ou
cd contracts && npm run deploy:local
```

3. **Copiar endereços** para `frontend/.env`:

```env
NEXT_PUBLIC_WOD_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_ARENA_ADDRESS=0x...
NEXT_PUBLIC_VALIDATOR_REGISTRY_ADDRESS=0x...
```

---

## 🎯 Modo de Desenvolvimento Completo

### Terminal 1: Hardhat Node

```bash
make dev-contracts
```
Deixa rodando - cria blockchain local.

### Terminal 2: Deploy Contratos

```bash
make deploy-local
```
Aguarda Terminal 1 estar rodando, depois executa.

### Terminal 3: Frontend

```bash
make dev
```
Acessa em http://localhost:3000

---

## 🔍 Verificar se Está Funcionando

1. **Abre o navegador**: http://localhost:3000
2. **Deve ver**: Tela do WOD [X] PRO
3. **Clica em "Entrar"**: Deve conectar (mesmo sem contratos deployados)

---

## ⚠️ Problemas Comuns

### "Cannot find module..."
```bash
cd frontend
npm install --legacy-peer-deps
```

### "Port 3000 already in use"
```bash
# Mata processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou use outra porta
PORT=3001 npm run dev
```

### "Erro de conexão com blockchain"
- Verifique se Hardhat node está rodando
- Verifique se contratos foram deployados
- Verifique variáveis de ambiente

---

## 🎨 O Que Você Verá

### Tela Principal

- **Header**: Logo WOD [X] PRO + Botão de login
- **IPFS Status**: Mostra provedores disponíveis
- **Treino Diário**: Formulário para registrar treinos
- **Arena Dashboard**: Lista de desafios (vazia se não houver contratos)
- **Validator Dashboard**: Painel para validadores

### Sem Contratos Deployados

- ✅ Frontend funciona normalmente
- ✅ Pode registrar treinos (off-chain)
- ✅ Pode fazer upload de vídeos (IPFS)
- ❌ Não pode participar de desafios (precisa de contratos)

---

## 💡 Dica

Para ver tudo funcionando:
1. Configure Alchemy API key (mínimo)
2. Configure NFT.Storage ou Lighthouse (para uploads)
3. Deploy contratos localmente (para testar desafios)

**Mas você pode ver o frontend rodando mesmo sem tudo isso!**

---

## 📝 Resumo

```bash
# 1. Na raiz do projeto
make dev

# 2. Abre navegador
open http://localhost:3000
# ou
http://localhost:3000
```

**Pronto!** 🎉

