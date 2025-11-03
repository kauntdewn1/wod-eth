# WODX Protocol

**Protocolo Descentralizado de Performance Atlética**

O WODX transforma desempenho físico em valor digital perpétuo e auditável através de blockchain.

## Arquitetura

### A Stack de Soberania

- **Alchemy Account Kit**: Login social e smart contract wallets
- **IPFS Storage**: NFT.Storage, Lighthouse ou IPFS Local (múltiplos provedores suportados)
- **Alchemy Pay**: On-ramp PIX para compra de $WOD
- **Smart Contracts (Polygon)**: Lógica on-chain 100% descentralizada

### Fase 1: A Arena

Mineração de $WOD através de desempenho validado por consenso descentralizado.

**Importante:** A Arena é para **desafios competitivos** (on-chain). Treinos diários são armazenados **off-chain** (gratuitos) e podem ser sincronizados quando necessário. Veja [ARQUITETURA_TREINOS.md](docs/ARQUITETURA_TREINOS.md).

### Fase 2: O Mercado

Bolsa de performance descentralizada com apostas em eventos esportivos.

## Estrutura do Projeto

```
wod-eth/
├── contracts/          # Smart Contracts Solidity
├── frontend/           # Aplicação Next.js
├── scripts/            # Scripts de deploy e testes
└── docs/               # Documentação técnica
```

## Início Rápido

### Opção 1: Com Makefile (Recomendado)

```bash
# Ver todos os comandos disponíveis
make help

# Setup inicial completo
make setup

# Desenvolvimento
make dev                    # Frontend
make dev-contracts          # Hardhat node local (em outro terminal)

# Deploy
make deploy-local           # Local
make deploy-mumbai          # Testnet
```

### Opção 2: Manual

### 1. Instalar Dependências

```bash
npm install
cd frontend && npm install
cd ../contracts && npm install
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

- `NEXT_PUBLIC_ALCHEMY_API_KEY`
- `NEXT_PUBLIC_LIGHTHOUSE_API_KEY`
- `NEXT_PUBLIC_CHAIN_ID` (Polygon: 137 ou Mumbai: 80001)

### 3. Compilar Contratos

```bash
npm run compile
```

### 4. Deploy Local

```bash
npx hardhat node  # Terminal 1
npm run deploy:local  # Terminal 2
```

### 5. Rodar Frontend

```bash
npm run dev
```

## Tecnologias

- **Blockchain**: Polygon (L2)
- **Frontend**: Next.js 14, React, TypeScript
- **Wallet**: Alchemy Account Kit (Account Abstraction)
- **Storage**: Lighthouse.storage (IPFS/Filecoin)
- **On-Ramp**: Alchemy Pay
- **Smart Contracts**: Solidity, Hardhat

## Status

🚧 **Em Desenvolvimento** - Fase 1 (Arena)

