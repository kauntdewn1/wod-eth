# Guia de Início Rápido - WODX Protocol

## Pré-requisitos

- Node.js 18+ e npm/yarn
- Conta Alchemy (https://www.alchemy.com/)
- Chave API do Lighthouse (https://lighthouse.storage/)
- Wallet com fundos para deploy (testnet ou mainnet)

## Passo 1: Instalação

```bash
# Instalar dependências da raiz
npm install

# Instalar dependências do frontend
cd frontend && npm install

# Instalar dependências dos contratos
cd ../contracts && npm install
```

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

Edite `frontend/.env`:
```env
NEXT_PUBLIC_ALCHEMY_API_KEY=sua_alchemy_api_key
NEXT_PUBLIC_ALCHEMY_APP_ID=sua_alchemy_app_id
NEXT_PUBLIC_LIGHTHOUSE_API_KEY=sua_lighthouse_api_key
NEXT_PUBLIC_CHAIN_ID=80001
```

## Passo 3: Deploy dos Contratos

### Desenvolvimento Local

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

```bash
cd contracts
npm run deploy:polygon
```

## Passo 4: Rodar o Frontend

```bash
cd frontend
npm run dev
```

Acesse: http://localhost:3000

## Passo 5: Testar o Fluxo Completo

### 1. Criar um Desafio (Admin)

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

### 2. Atleta Entra no Desafio

1. Conecte wallet via Alchemy Account Kit (login social)
2. Aprove gasto de $WOD (primeira vez)
3. Clique em "Entrar no Desafio"
4. Confirme transação (gasless via Account Abstraction)

### 3. Atleta Submete Prova

1. Clique em "Selecionar vídeo"
2. Escolha arquivo de vídeo
3. Clique em "Enviar para Lighthouse"
4. Após receber CID, a prova é registrada on-chain automaticamente

### 4. Validador Vota

1. Validador precisa fazer stake mínimo (1000 WOD)
2. Acessa submissões pendentes
3. Vota "Rep" ou "No-Rep" para cada atleta
4. Voto registrado on-chain

### 5. Resolver Desafio

Após deadline de validação (7 dias):
```typescript
await arena.resolveChallenge(challengeId);
// Distribui prêmios automaticamente baseado em consenso
```

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
│   ├── abis/              # ABIs dos contratos
│   └── package.json
└── docs/                  # Documentação
```

## Próximos Passos

1. ✅ Base do protocolo criada
2. ⏳ Integração completa Alchemy Account Kit (Social Login)
3. ⏳ Integração Alchemy Pay (On-Ramp PIX)
4. ⏳ Dashboard de validadores
5. ⏳ Sistema de oráculo para Fase 2 (Mercado)

## Troubleshooting

### Erro: "Cannot find module '@alchemy/aa-alchemy'"
```bash
cd frontend && npm install @alchemy/aa-alchemy@latest
```

### Erro: "Insufficient funds"
Certifique-se de ter MATIC na testnet para gas (use faucet):
- Mumbai: https://faucet.polygon.technology/

### Erro: "Lighthouse upload failed"
Verifique se a chave API está correta e tem créditos.

## Recursos

- [Documentação Alchemy Account Kit](https://accountkit.alchemy.com/)
- [Lighthouse.storage Docs](https://docs.lighthouse.storage/)
- [Hardhat Docs](https://hardhat.org/docs)

