# Guia de Início Rápido - WOD [X] PRO

**Domain**: `wod.eth` | **Token**: `WOD`

## Pré-requisitos

- Node.js 18+ e npm/yarn
- Conta Alchemy (https://www.alchemy.com/)
- Chave API do IPFS (NFT.Storage ou Lighthouse)
- Wallet com fundos para deploy (testnet ou mainnet)

---

## Passo 1: Instalação

### Opção 1: Com Makefile (Recomendado)

```bash
# Instalar todas as dependências
make install

# Ou instalar separadamente
make install-contracts  # Contratos
make install-frontend   # Frontend
```

### Opção 2: Manual

```bash
# Instalar dependências da raiz
npm install

# Instalar dependências do frontend
cd frontend && npm install --legacy-peer-deps

# Instalar dependências dos contratos
cd ../contracts && npm install --legacy-peer-deps
```

---

## Passo 2: Configuração de Variáveis de Ambiente

### Contratos (.env na raiz)

```bash
cp .env.example .env
```

Edite `.env`:
```env
PRIVATE_KEY=sua_chave_privada_aqui
POLYGON_RPC_URL=https://polygon-rpc.com
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
```

### Frontend (frontend/.env)

```bash
cd frontend
cp .env.example .env
```

Edite `frontend/.env` com todas as variáveis necessárias:

```env
# Alchemy (obrigatório)
NEXT_PUBLIC_ALCHEMY_API_KEY=sua_alchemy_api_key
NEXT_PUBLIC_ALCHEMY_APP_ID=seu_alchemy_app_id
NEXT_PUBLIC_ALCHEMY_POLICY_ID=seu_gas_policy_id
# Gas Policy ID: Subsidia transações dos usuários (opcional mas recomendado)

# IPFS Storage (escolha pelo menos um)
NEXT_PUBLIC_NFTSTORAGE_API_KEY=sua_nftstorage_api_key
# OU
NEXT_PUBLIC_LIGHTHOUSE_API_KEY=sua_lighthouse_api_key
# OU use IPFS local (se tiver instalado)
NEXT_PUBLIC_IPFS_PROVIDER=nftstorage
# Opções: nftstorage, lighthouse, local

# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=80001
NEXT_PUBLIC_CHAIN_NAME=Mumbai

# Contract Addresses (preencher após deploy)
NEXT_PUBLIC_WOD_TOKEN_ADDRESS=
NEXT_PUBLIC_ARENA_ADDRESS=
NEXT_PUBLIC_VALIDATOR_REGISTRY_ADDRESS=

# Alchemy Pay (On-Ramp PIX) - Opcional
NEXT_PUBLIC_ALCHEMY_PAY_PUBLIC_KEY=
```

---

## Passo 3: Deploy dos Contratos

### Desenvolvimento Local

#### Com Makefile:

```bash
# Terminal 1: Iniciar Hardhat node local
make dev-contracts

# Terminal 2: Deploy
make deploy-local
```

#### Manual:

```bash
# Terminal 1: Iniciar Hardhat node local
cd contracts
npx hardhat node

# Terminal 2: Deploy
npm run deploy:local
```

Após o deploy, copie os endereços dos contratos para `frontend/.env`:
```env
NEXT_PUBLIC_WOD_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_ARENA_ADDRESS=0x...
NEXT_PUBLIC_VALIDATOR_REGISTRY_ADDRESS=0x...
```

### Testnet (Mumbai/Polygon)

#### Com Makefile:

```bash
make deploy-mumbai   # Mumbai testnet
make deploy-polygon # Polygon mainnet
```

#### Manual:

```bash
cd contracts
npm run deploy:mumbai   # Mumbai testnet
npm run deploy:polygon  # Polygon mainnet
```

---

## Passo 4: Rodar o Frontend

### Com Makefile:

```bash
make dev
```

### Manual:

```bash
cd frontend
npm run dev
```

Acesse: **http://localhost:3000**

---

## Passo 5: Configurar Email Authentication

### No Dashboard da Alchemy

1. Acesse [Alchemy Dashboard](https://dashboard.alchemy.com/)
2. Vá em **Smart Wallets** → Selecione sua config → **Edit**
3. Na seção **Email**, escolha:
   - **One Time Password (OTP)** - Recomendado (3x maior conversão)
   - **Magic Link** - Alternativa (requer configurar Redirect URL)

Para mais detalhes, veja [EMAIL_AUTH_SETUP.md](EMAIL_AUTH_SETUP.md)

---

## Passo 6: Testar o Fluxo Completo

### 1. Login com Email

1. Acesse http://localhost:3000
2. Clique em "Entrar com E-mail"
3. Escolha entre "Código (OTP)" ou "Link Mágico"
4. Digite seu e-mail e complete a autenticação
5. ✅ Você está conectado!

### 2. Criar um Desafio (Admin)

Via script ou interface admin:
```typescript
await arena.createChallenge(
  "Desafio WOD #1",
  "100 burpees em 10 minutos",
  ethers.parseEther("100"), // Entry fee: 100 WOD
  startTime,
  endTime
);
```

### 3. Atleta Entra no Desafio

1. Conecte via Email OTP/Magic Link
2. Aprove gasto de $WOD (primeira vez)
3. Clique em "Entrar no Desafio"
4. Confirme transação (gasless via Gas Manager se configurado)

### 4. Atleta Submete Prova

1. Clique em "Selecionar vídeo"
2. Escolha arquivo de vídeo
3. Vídeo é enviado para IPFS (NFT.Storage, Lighthouse ou Local)
4. Após receber CID, a prova é registrada on-chain automaticamente

### 5. Validador Vota

1. Validador precisa fazer stake mínimo (1000 WOD)
2. Acessa submissões pendentes
3. Vota "Rep" ou "No-Rep" para cada atleta
4. Voto registrado on-chain

### 6. Resolver Desafio

Após deadline de validação (7 dias):
```typescript
await arena.resolveChallenge(challengeId);
// Distribui prêmios automaticamente baseado em consenso
```

---

## Estrutura de Arquivos

```
wod-eth/
├── contracts/              # Smart Contracts
│   ├── contracts/         # Código Solidity
│   ├── scripts/           # Scripts de deploy
│   ├── test/              # Testes
│   └── hardhat.config.ts  # Configuração Hardhat
├── frontend/              # Aplicação Next.js
│   ├── app/               # Pages (App Router)
│   ├── components/        # Componentes React
│   ├── lib/               # Utilitários (IPFS, Account Kit, etc)
│   └── package.json
├── docs/                  # Documentação
│   ├── ARCHITECTURE.md    # Arquitetura do protocolo
│   ├── EMAIL_AUTH_SETUP.md # Configuração de autenticação
│   ├── GAS_MANAGER.md     # Gas Manager setup
│   └── ...
└── Makefile               # Comandos automatizados
```

---

## Comandos Úteis (Makefile)

```bash
make help          # Ver todos os comandos disponíveis
make install       # Instalar todas as dependências
make dev           # Rodar frontend
make dev-contracts # Rodar Hardhat node local
make compile       # Compilar contratos
make test          # Rodar testes
make deploy-local  # Deploy local
make status        # Ver status do projeto
```

Para mais comandos, veja `make help`

---

## Status de Implementação

### ✅ Completo

- ✅ Smart Contracts (WODToken, Arena, ValidatorRegistry)
- ✅ Frontend base com Next.js
- ✅ Alchemy Account Kit integrado
- ✅ Email OTP Authentication
- ✅ Email Magic Link Authentication
- ✅ Multi-provider IPFS (NFT.Storage, Lighthouse, Local)
- ✅ Gas Manager (subsidiar transações)
- ✅ Documentação completa

### ⏳ Em Progresso

- ⏳ Integração Alchemy Pay (On-Ramp PIX)
- ⏳ Dashboard de validadores completo
- ⏳ Interface de criação de desafios

### 📋 Planejado

- 📋 Sistema de oráculo para Fase 2 (Mercado)
- 📋 Multi-Factor Authentication (TOTP)
- 📋 Social Login (Google)

---

## Troubleshooting

### Erro: "Cannot find module '@account-kit/react'"
```bash
cd frontend && npm install @account-kit/react @account-kit/infra --legacy-peer-deps
```

### Erro: "useUser is not a function"
Verifique se o `AlchemyAccountProvider` está configurado no `providers.tsx`

### Erro: "Insufficient funds"
Certifique-se de ter MATIC na testnet para gas (use faucet):
- Mumbai: https://faucet.polygon.technology/

### Erro: "IPFS upload failed"
- Verifique se a chave API está correta
- Verifique se tem créditos (NFT.Storage é gratuito)
- Para Lighthouse, verifique se tem créditos na conta
- Para IPFS local, verifique se o daemon está rodando: `ipfs daemon`

### Erro: "Gas Manager not working"
- Verifique se `NEXT_PUBLIC_ALCHEMY_POLICY_ID` está configurado
- Verifique se o Policy ID está correto no Alchemy Dashboard
- Verifique se a política tem créditos disponíveis

---

## Recursos

### Documentação do Projeto

- [README.md](../README.md) - Visão geral do projeto
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura técnica
- [EMAIL_AUTH_SETUP.md](EMAIL_AUTH_SETUP.md) - Setup de autenticação
- [GAS_MANAGER.md](GAS_MANAGER.md) - Gas Manager setup
- [IPFS_SETUP.md](IPFS_SETUP.md) - Configuração IPFS
- [FAQ.md](FAQ.md) - Perguntas frequentes

### Documentação Externa

- [Alchemy Account Kit](https://accountkit.alchemy.com/)
- [Alchemy Gas Manager](https://docs.alchemy.com/docs/gas-manager)
- [NFT.Storage Docs](https://nft.storage/docs/)
- [Lighthouse.storage Docs](https://docs.lighthouse.storage/)
- [Hardhat Docs](https://hardhat.org/docs)

---

## Próximos Passos

1. ✅ Configure Email Authentication no Alchemy Dashboard
2. ✅ Configure Gas Policy ID (opcional mas recomendado)
3. ✅ Teste o login com Email OTP
4. ✅ Faça deploy dos contratos (local ou testnet)
5. ✅ Teste o fluxo completo de desafios

---

*Última atualização: Novembro 2024*
