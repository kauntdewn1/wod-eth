# Separação de Repositórios - Contratos vs Frontend

## 🎯 Por que Separar?

### Problemas do Monorepo Atual

1. **Conflitos de Dependências**
   - Workspaces causam conflitos de versões (ex: Hardhat 2.x vs 3.x)
   - Dependências pesadas do Hardhat no mesmo espaço do Next.js
   - `npm audit fix --force` pode quebrar ambos os projetos

2. **Deploy Independente**
   - Contratos são deployados em redes blockchain (testnet/mainnet)
   - Frontend é deployado em Vercel/Netlify
   - Ciclos de release diferentes

3. **Versionamento**
   - Contratos têm versões imutáveis (on-chain)
   - Frontend pode ter múltiplas versões simultâneas
   - ABIs precisam ser versionadas separadamente

4. **Equipes**
   - Backend/Blockchain trabalha com Solidity, Hardhat, testes
   - Frontend trabalha com React, Next.js, UI/UX
   - Permissões e acesso diferentes

5. **CI/CD**
   - Contratos: Compile → Test → Deploy → Verify
   - Frontend: Build → Test → Deploy → Preview
   - Pipelines completamente diferentes

6. **Segurança**
   - Contratos precisam de auditoria rigorosa
   - Frontend tem preocupações diferentes (XSS, CSRF, etc)
   - Secrets diferentes (chaves privadas vs API keys)

---

## 📦 Estrutura Proposta (Escalável)

### Repositório 1: `wod-protocol` (ou `wod-core`)

```
wod-protocol/
├── contracts/          # Solidity contracts
│   ├── Arena.sol
│   ├── WODToken.sol
│   └── ValidatorRegistry.sol
├── scripts/           # Deploy scripts
├── test/              # Hardhat tests
├── abis/             # ABIs gerados (separado para package)
│   ├── Arena.json
│   ├── WODToken.json
│   └── ValidatorRegistry.json
├── addresses/         # Endereços por chainId (separado para package)
│   ├── amoy.json      # { "Arena": "0x...", "WODToken": "0x..." }
│   ├── polygon.json
│   └── mumbai.json
├── artifacts/         # Compiled contracts (build)
├── typechain-types/   # TypeScript types
├── package.json       # Publica @wodxpro/contract-data
├── hardhat.config.ts
└── README.md
```

**Responsabilidades:**
- ✅ Smart contracts Solidity
- ✅ Compilação e testes
- ✅ Scripts de deploy
- ✅ Verificação de contratos
- ✅ Geração de ABIs e TypeChain types
- ✅ **Publicação de `@wodxpro/contract-data`** (ABIs + addresses)

### Repositório 2: `wod-app-web`
```
wod-app-web/
├── app/               # Next.js app
├── components/        # React components
├── hooks/            # Custom hooks
├── lib/              # Utilities
│   ├── ipfs.ts       # IPFS integration
│   ├── accountKitConfig.ts  # Wallet config
│   └── contractData.ts  # Helper para @wodxpro/contract-data
├── public/           # Assets estáticos
├── package.json      # Depende de @wodxpro/contract-data
├── next.config.js
└── README.md
```

**Responsabilidades:**
- ✅ Interface do usuário (React/Next.js)
- ✅ Integração com wallets (Alchemy Account Kit + wagmi)
- ✅ Consumo de contratos via `@wodxpro/contract-data`
- ✅ IPFS integration (multi-provider)
- ✅ Deploy frontend

**Futuro:** `wod-app-mobile`, `wod-app-admin`, etc.

### Repositório 3: `wod-docs`
```
wod-docs/
├── architecture/     # Documentação técnica
├── guides/          # Guias de uso
├── api/             # Documentação de API
├── contract-integration.md
└── README.md
```

---

## 🔄 Fluxo de Trabalho

### 1. Desenvolvimento de Contratos

```bash
# Repo: wod-contracts
git clone https://github.com/seu-org/wod-contracts
cd wod-contracts
npm install
npm run compile
npm test
npm run deploy:amoy
```

**Após deploy:**
- Copiar ABIs gerados para `wod-frontend/abis/`
- Ou publicar como package npm: `@wodxpro/contracts-abis`

### 2. Desenvolvimento de Frontend

```bash
# Repo: wod-frontend
git clone https://github.com/seu-org/wod-frontend
cd wod-frontend
npm install

# Atualizar ABIs (se necessário)
cp ../wod-contracts/artifacts/contracts/Arena.sol/Arena.json ./abis/ArenaABI.ts

npm run dev
```

### 3. Publicação de Contract Data (ABIs + Addresses)

**🎯 Solução Recomendada: Package `@wodxpro/contract-data`**

Estrutura do package:
```
@wodxpro/contract-data/
├── abis/
│   ├── Arena.json
│   ├── WODToken.json
│   └── ValidatorRegistry.json
├── addresses/
│   ├── amoy.json      # { "Arena": "0x...", "WODToken": "0x..." }
│   ├── polygon.json
│   └── mumbai.json
└── index.ts           # Helper functions
```

**Implementação (com melhorias finais):**

```typescript
// @wodxpro/contract-data/src/index.ts
export interface ContractData {
  abi: any[];
  address: string;
  chainName: ChainName; // ✅ Melhoria: inclui chainName
}

export async function getContractData(
  contractName: ContractName,
  chainId: number
): Promise<ContractData> {
  const chainName = getChainName(chainId);
  
  // ✅ Melhoria: Dynamic imports (ESM compatible)
  const abiModule = await import(`./abis/${contractName}.json`);
  const addressesModule = await import(`./addresses/${chainName}.json`);
  
  const abi = abiModule.default || abiModule;
  const addresses = addressesModule.default || addressesModule;
  const address = addresses[contractName];
  
  return { abi, address, chainName };
}
```

**Uso no Frontend (async):**
```typescript
// wod-app-web/lib/contractData.ts
import { getContractData } from '@wodxpro/contract-data';
import { useEffect, useState } from 'react';

export function useArena() {
  const [contractData, setContractData] = useState<ContractData | null>(null);
  
  useEffect(() => {
    getContractData('Arena', 80002).then(setContractData);
  }, []);
  
  const { data } = useReadContract({
    address: contractData?.address as `0x${string}`,
    abi: contractData?.abi,
    functionName: 'getChallenge',
    args: [BigInt(1)],
    query: { enabled: !!contractData },
  });
  
  return { data };
}
```

**📋 Ver `docs/EXEMPLO_CONTRACT_DATA.md` para implementação completa com todas as melhorias.**

**CI/CD para Publicação:**
```yaml
# .github/workflows/publish-contract-data.yml em wod-protocol
name: Publish Contract Data
on:
  release:
    types: [published]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build contracts
        run: npm run compile
      - name: Extract ABIs
        run: |
          mkdir -p abis
          cp artifacts/contracts/Arena.sol/Arena.json abis/
          cp artifacts/contracts/WODToken.sol/WODToken.json abis/
      - name: Update addresses
        run: |
          mkdir -p addresses
          echo '{"Arena":"${{ env.ARENA_ADDRESS }}","WODToken":"${{ env.WOD_TOKEN_ADDRESS }}"}' > addresses/amoy.json
      - name: Set version from tag
        run: |
          VERSION=${GITHUB_REF#refs/tags/v}
          npm version $VERSION --no-git-tag-version
        env:
          GITHUB_REF: ${{ github.ref }}
      
      - name: Build package
        run: npm run build
      
      - name: Publish to npm
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 🏗️ Arquitetura: IPFS e Wallet Integration

### IPFS Integration

**Estado Atual:**
- ✅ Multi-provider support (NFT.Storage, Lighthouse, Local IPFS)
- ✅ Fallback automático entre provedores
- ✅ Upload client-side (browser)

**Arquitetura Proposta:**

```
┌─────────────────────────────────────────────────────────┐
│                    wod-app-web                          │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         IPFS Service (lib/ipfs.ts)                │  │
│  │  - Multi-provider abstraction                    │  │
│  │  - Fallback logic                                │  │
│  │  - Progress tracking                             │  │
│  └──────────────────────────────────────────────────┘  │
│                        │                                 │
│                        ▼                                 │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ NFT.Storage│ │ Lighthouse   │  │ Local IPFS   │    │
│  │ (Primary) │  │ (Fallback)   │  │ (Dev Only)   │    │
│  └──────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────┘
```

**Decisões Arquiteturais:**

1. **Onde fazer upload?**
   - ✅ **Cliente (browser)** - Implementado
   - ❌ Backend - Não necessário (aumenta custo/complexidade)
   - ✅ Usuário assina com wallet antes do upload

2. **Quem assina?**
   - ✅ **Wallet do usuário** (Alchemy Account Kit)
   - Upload é feito após autenticação
   - CID é enviado para contrato on-chain

3. **Provedores:**
   - **NFT.Storage** (Primary) - Gratuito, Filecoin backup
   - **Lighthouse** (Fallback) - Pago, mais rápido
   - **Local IPFS** (Dev) - Para desenvolvimento local

4. **Metadados:**
   - Armazenados como JSON no IPFS
   - Estrutura: `{ videoCID, timestamp, athlete, challengeId }`
   - CID do metadado vai para contrato

**Implementação Futura:**
```typescript
// lib/ipfs.ts - Estrutura atual (manter)
export async function uploadToIPFS(
  file: File,
  options: {
    provider?: IPFSProvider;
    onProgress?: (progress: number) => void;
  }
): Promise<UploadResult>

// Adicionar:
export async function uploadMetadata(
  metadata: TrainingMetadata,
  signer: Signer
): Promise<string> {
  // 1. Assinar metadado com wallet
  // 2. Upload para IPFS
  // 3. Retornar CID
}
```

### Wallet Integration

**Estado Atual:**
- ✅ Alchemy Account Kit (Email OTP/Magic Link)
- ✅ wagmi para interação com contratos
- ⚠️ Apenas Polygon Mumbai configurado

**Arquitetura Proposta:**

```
┌─────────────────────────────────────────────────────────┐
│                    wod-app-web                          │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │      Wallet Provider Layer                       │  │
│  │  ┌──────────────┐      ┌──────────────────┐     │  │
│  │  │ Alchemy      │      │ wagmi + viem     │     │  │
│  │  │ Account Kit  │◄─────┤ Contract Hooks   │     │  │
│  │  │ (Auth)       │      │ (useArena, etc)  │     │  │
│  │  └──────────────┘      └──────────────────┘     │  │
│  └──────────────────────────────────────────────────┘  │
│                        │                                 │
│                        ▼                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Chain Support                            │  │
│  │  - Polygon (137)                                 │  │
│  │  - Polygon Amoy (80002) - Primary                │  │
│  │  - Polygon Mumbai (80001) - Legacy               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Decisões Arquiteturais:**

1. **Stack de Wallet:**
   - ✅ **Alchemy Account Kit** - Account Abstraction, gasless
   - ✅ **wagmi** - Hooks para contratos, multi-chain
   - ❌ RainbowKit - Não necessário (Account Kit já tem UI)
   - ❌ Web3Modal - Redundante com Account Kit

2. **Multi-chain Support:**
   ```typescript
   // lib/accountKitConfig.ts
   const chains = {
     amoy: polygonAmoy,      // Primary testnet
     polygon: polygonMainnet, // Mainnet
   };
   
   // Suportar switch de chain no futuro
   export function getAccountKitConfig(chainId: number) {
     const chain = chains[chainId] || polygonAmoy;
     return createConfig({ transport: alchemy({ apiKey }), chain });
   }
   ```

3. **Gas Management:**
   - ✅ Alchemy Gas Manager (já configurado)
   - Subsidiar transações para melhor UX
   - Policy ID por chain

4. **Estrutura de Config:**
   ```typescript
   // lib/walletConfig.ts
   export const WALLET_CONFIG = {
     chains: [polygonAmoy, polygonMainnet],
     defaultChain: polygonAmoy,
     gasManager: {
       amoy: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID_AMOY,
       polygon: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID_POLYGON,
     },
   };
   ```

**Diagrama de Fluxo:**

```
User → Login (Email OTP) 
  → Alchemy Account Kit cria Smart Wallet
  → Gas Manager subsidia transações
  → wagmi hooks conectam com contratos
  → useArena, useWODToken consomem @wodxpro/contract-data
```

**Melhorias Futuras:**
- [ ] Suporte a múltiplas chains (switch)
- [ ] Social login (Google) via Account Kit
- [ ] Multi-sig para validadores
- [ ] WalletConnect para mobile apps

---

## 🚀 Migração Passo a Passo

### Fase 1: Preparação

1. **Criar novos repositórios**
   ```bash
   # Repositórios já criados:
   ✅ https://github.com/kauntdewn1/wod-protocol.git
   ✅ https://github.com/kauntdewn1/wod-app-web.git
   
   # Opcional (para documentação centralizada):
   - wod-docs (ou manter docs em cada repo)
   ```

2. **Backup do código atual**
   ```bash
   git tag v1.0.0-monorepo  # Marcar versão atual
   ```

### Fase 2: Separar Contratos

```bash
# 1. Criar novo repo local
mkdir wod-protocol
cd wod-protocol
git init
git remote add origin https://github.com/seu-org/wod-protocol

# 2. Copiar arquivos de contratos
cp -r ../wod-eth/contracts/* .
cp ../wod-eth/contracts/.env.example .env.example
cp ../wod-eth/contracts/.gitignore .gitignore

# 3. Ajustar package.json (remover workspace)
# 4. Criar README.md específico para contratos
# 5. Commit inicial
git add .
git commit -m "feat: initial contracts repository"
git push -u origin main
```

### Fase 3: Separar Frontend

```bash
# 1. Criar novo repo local
mkdir wod-app-web
cd wod-app-web
git init
git remote add origin https://github.com/seu-org/wod-app-web

# 2. Copiar arquivos do frontend
cp -r ../wod-eth/frontend/* .
cp ../wod-eth/frontend/.env.example .env.example
cp ../wod-eth/frontend/.gitignore .gitignore

# 3. Ajustar package.json (remover workspace)
# 4. Criar README.md específico para frontend
# 5. Commit inicial
git add .
git commit -m "feat: initial frontend repository"
git push -u origin main
```

### Fase 4: Atualizar Documentação

```bash
# Mover docs para repo separado ou manter em cada repo
# Atualizar links e referências
```

---

## 📋 Checklist de Migração

### Contratos (`wod-protocol`)
- [ ] Criar repositório vazio
- [ ] Copiar `contracts/` completo
- [ ] Copiar `scripts/` de deploy
- [ ] Copiar `test/`
- [ ] Ajustar `package.json` (remover workspace)
- [ ] Criar `.github/workflows/deploy.yml` (CI/CD)
- [ ] Criar `README.md` com instruções de deploy
- [ ] Configurar secrets no GitHub (chaves privadas)
- [ ] Testar deploy em testnet
- [ ] Configurar publicação de `@wodxpro/contract-data`
- [ ] Criar estrutura `abis/` e `addresses/`
- [ ] Implementar `getContractData()` helper
- [ ] Publicar package no npm

### Frontend (`wod-app-web`)
- [ ] Criar repositório vazio
- [ ] Copiar `frontend/` completo
- [ ] Ajustar `package.json` (remover workspace)
- [ ] Instalar `@wodxpro/contract-data` via npm
- [ ] Atualizar hooks para usar `getContractData()`
- [ ] Remover ABIs hardcoded (usar package)
- [ ] Criar `.github/workflows/deploy.yml` (CI/CD)
- [ ] Criar `README.md` com instruções
- [ ] Configurar variáveis de ambiente
- [ ] Testar build e deploy
- [ ] Atualizar documentação de integração

### Documentação
- [ ] Atualizar `README.md` principal (ou arquivar)
- [ ] Criar guia de integração entre repos
- [ ] Documentar processo de atualização de ABIs
- [ ] Atualizar links em documentação

---

## 🔗 Integração Entre Repos

### Variáveis de Ambiente

**Frontend precisa de:**
```env
NEXT_PUBLIC_ARENA_ADDRESS=0x...
NEXT_PUBLIC_WOD_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_VALIDATOR_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=80002
```

**Solução:** Documentar endereços deployados em cada repo e criar script de sincronização.

### CI/CD Integration

**Contratos:** Após deploy bem-sucedido, atualizar arquivo de endereços
```yaml
# .github/workflows/deploy.yml em wod-contracts
- name: Update contract addresses
  run: |
    echo "ARENA_ADDRESS=${{ env.ARENA_ADDRESS }}" >> addresses.env
    # Publicar como artifact ou atualizar package
```

**Frontend:** Buscar endereços atualizados
```yaml
# .github/workflows/deploy.yml em wod-frontend
- name: Get contract addresses
  run: |
    # Baixar addresses.env do repo de contratos
    # Ou usar package npm com endereços
```

---

## ✅ Benefícios da Separação

1. **Independência Total**
   - Atualizar Hardhat não afeta Next.js
   - Deploy de contratos não quebra frontend
   - Equipes trabalham sem conflitos

2. **Versionamento Claro**
   - Contratos: tags semânticas (v1.0.0, v1.1.0)
   - Frontend: releases independentes
   - ABIs versionadas separadamente

3. **CI/CD Específico**
   - Contratos: Hardhat compile → test → deploy → verify
   - Frontend: Next.js build → test → deploy → preview

4. **Segurança**
   - Secrets isolados por repo
   - Permissões granulares
   - Auditoria focada

5. **Escalabilidade**
   - Fácil adicionar novos frontends (mobile, admin)
   - Múltiplos contratos podem compartilhar ABIs
   - Reutilização de contratos em outros projetos

---

## 🛠️ Ferramentas Úteis

### Para Sincronização de ABIs

**Atualizar package (automático via CI/CD):**
```bash
# Após deploy, o package @wodxpro/contract-data é atualizado
# Frontend só precisa: npm update @wodxpro/contract-data
```

**GitHub Action (já documentado acima na seção "Publicação de Contract Data")**

---

## 📝 Próximos Passos

1. **Decidir estrutura final**
   - 2 repos (contratos + frontend) ou 3 repos (+ docs)?
   - Package npm para ABIs ou cópia manual?

2. **Criar repositórios**
   - GitHub/GitLab organizations
   - Configurar permissões

3. **Migrar código**
   - Seguir checklist acima
   - Testar cada repo isoladamente

4. **Atualizar documentação**
   - README de cada repo
   - Guias de integração

5. **Configurar CI/CD**
   - GitHub Actions para cada repo
   - Integração entre repos (se necessário)

---

**Última atualização:** Dezembro 2024

