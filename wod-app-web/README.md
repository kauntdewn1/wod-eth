# WOD X PRO - Frontend Web App

**Aplicação Next.js para o protocolo WOD X PRO**

Este repositório contém a aplicação web frontend do WOD X PRO, construída com Next.js 14, React, TypeScript e integração com blockchain via Alchemy Account Kit.

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Alchemy (para Account Kit)
- Chave API do Lighthouse (opcional, para IPFS)

### Instalação

```bash
npm install
```

### Configuração

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Alchemy
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_ALCHEMY_POLICY_ID=your_policy_id

# Chain
NEXT_PUBLIC_CHAIN_ID=80002

# IPFS (Lighthouse - opcional)
NEXT_PUBLIC_LIGHTHOUSE_API_KEY=your_lighthouse_key

# Contract Addresses (serão obtidos do @wodxpro/contract-data)
# Opcional: sobrescrever se necessário
NEXT_PUBLIC_ARENA_ADDRESS=0x...
NEXT_PUBLIC_WOD_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_VALIDATOR_REGISTRY_ADDRESS=0x...
```

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Build para Produção

```bash
npm run build
npm start
```

## 📦 Dependências Principais

- **Next.js 14** - Framework React
- **wagmi** - Hooks para interação com blockchain
- **viem** - Cliente Ethereum
- **@wodxpro/contract-data** - ABIs e endereços dos contratos
- **@account-kit/react** - Alchemy Account Kit (Account Abstraction)
- **@lighthouse-web3/sdk** - Upload para IPFS

## 🏗️ Estrutura do Projeto

```
wod-app-web/
├── app/               # Next.js App Router
│   ├── layout.tsx     # Layout principal
│   ├── page.tsx       # Página inicial
│   └── ui/            # Componentes UI
├── components/         # Componentes React
│   ├── ArenaDashboard.tsx
│   ├── DailyTraining.tsx
│   └── ...
├── hooks/             # Custom hooks
│   ├── useArena.ts    # Hook para Arena contract
│   └── useWODToken.ts # Hook para WODToken
├── lib/               # Utilitários
│   ├── contractData.ts    # Helper para @wodxpro/contract-data
│   ├── accountKitConfig.ts
│   └── ipfs.ts
└── package.json
```

## 🔗 Integração com Contratos

O frontend usa o package `@wodxpro/contract-data` para obter ABIs e endereços dos contratos:

```typescript
import { getContractDataForChain } from '@/lib/contractData';

// Buscar dados do contrato Arena
const { abi, address } = await getContractDataForChain('Arena');
```

Os hooks (`useArena`, `useWODToken`) já estão configurados para usar este package automaticamente.

## 🎨 Componentes Principais

### ArenaDashboard

Dashboard principal para visualizar e participar de desafios.

### DailyTraining

Interface para registrar treinos diários (off-chain).

### ValidatorDashboard

Dashboard para validadores votarem em submissões.

### VideoUpload

Componente para upload de vídeos para IPFS.

## 🔐 Autenticação

O app usa **Alchemy Account Kit** para autenticação sem fricção:

- Login com email (OTP/Magic Link)
- Smart Contract Wallets
- Gasless transactions (via Gas Manager)

## 📡 IPFS Integration

O app suporta múltiplos provedores IPFS:

- **NFT.Storage** (primary)
- **Lighthouse** (fallback)
- **Local IPFS** (dev only)

Vídeos são armazenados permanentemente no IPFS/Filecoin.

## 🚀 Deploy

### Vercel (Recomendado)

```bash
vercel
```

### Outros Plataformas

O app pode ser deployado em qualquer plataforma que suporte Next.js:

- Netlify
- Railway
- AWS Amplify
- Docker

## 🔧 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Chave API do Alchemy | Sim |
| `NEXT_PUBLIC_ALCHEMY_POLICY_ID` | Policy ID do Gas Manager | Sim |
| `NEXT_PUBLIC_CHAIN_ID` | Chain ID (80002 = Amoy) | Sim |
| `NEXT_PUBLIC_LIGHTHOUSE_API_KEY` | Chave API do Lighthouse | Não |

## 📝 Scripts Disponíveis

- `npm run dev` - Desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Rodar build de produção
- `npm run lint` - Rodar ESLint

## 🔗 Links

- **Domain**: `wod.eth`
- **Token**: `$WOD`
- **Contratos**: [wod-x-pro](../wod-x-pro)
- **Package NPM**: `@wodxpro/contract-data`

## 📄 Licença

MIT

---

**Última atualização:** Dezembro 2024

