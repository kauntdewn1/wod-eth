# 🚀 Migração: Monorepo → Microrepos

Este documento descreve a separação do monorepo `wod-eth` em dois repositórios independentes.

## 📦 Estrutura Nova

### 1. `wod-x-pro/` - Smart Contracts

**Package NPM:** `@wodxpro/contract-data`

**Conteúdo:**

- Contratos Solidity (`contracts/`)
- Scripts de deploy (`scripts/`)
- Testes Hardhat (`test/`)
- Package npm com ABIs e endereços (`src/`, `dist/`, `abis/`, `addresses/`)

**Responsabilidades:**

- Desenvolvimento e deploy de contratos
- Publicação do package `@wodxpro/contract-data`
- Versionamento de ABIs e endereços

### 2. `wod-app-web/` - Frontend Next.js

**Package NPM:** `@wodxpro/frontend` (privado)

**Conteúdo:**

- Aplicação Next.js completa
- Componentes React
- Hooks customizados
- Integração com `@wodxpro/contract-data`

**Responsabilidades:**

- Interface do usuário
- Deploy frontend (Vercel)
- Consumo de contratos via package npm

## 🔄 Mudanças Principais

### Antes (Monorepo)

```
wod-eth/
├── contracts/
├── frontend/
└── package.json (workspaces)
```

### Depois (Microrepos)

```
wod-x-pro/          # Repositório independente
├── contracts/
├── scripts/
├── src/            # Package npm
└── package.json

wod-app-web/        # Repositório independente
├── app/
├── components/
└── package.json
```

## 📋 Checklist de Migração

### Para `wod-x-pro/`

- [x] Criar estrutura de pastas
- [x] Mover contratos Solidity
- [x] Mover scripts de deploy
- [x] Mover testes
- [x] Configurar `package.json` com `@wodxpro/contract-data`
- [x] Configurar `tsup` para build do package
- [x] Criar `src/index.ts` com helpers
- [x] Criar scripts `extract-abis.js` e `update-addresses.js`
- [x] Configurar estrutura `abis/` e `addresses/`
- [x] Atualizar script de deploy para salvar endereços
- [x] Criar README.md
- [x] Configurar CI/CD (GitHub Actions)
- [x] Configurar `.gitignore` e `.npmignore`

### Para `wod-app-web/`

- [x] Copiar arquivos do frontend
- [x] Atualizar `package.json` com `@wodxpro/contract-data`
- [x] Remover pasta `abis/` (agora usa package)
- [x] Atualizar hooks para usar `@wodxpro/contract-data`
- [x] Criar `lib/contractData.ts` helper
- [x] Criar README.md
- [x] Configurar CI/CD (GitHub Actions)
- [x] Configurar `.env.example`

## 🚀 Próximos Passos

### 1. Criar Repositórios Git Separados

```bash
# Para wod-x-pro
cd wod-x-pro
git init
git remote add origin https://github.com/kauntdewn1/wod-x-pro.git
git add .
git commit -m "feat: initial contracts repository"
git push -u origin main

# Para wod-app-web
cd wod-app-web
git init
git remote add origin https://github.com/kauntdewn1/wod-app-web.git
git add .
git commit -m "feat: initial frontend repository"
git push -u origin main
```

### 2. Publicar Package NPM

```bash
cd wod-x-pro
npm login
npm publish --access public
```

### 3. Instalar Package no Frontend

```bash
cd wod-app-web
npm install @wodxpro/contract-data@latest
```

### 4. Configurar Secrets no GitHub

**Para `wod-x-pro`:**

- `NPM_TOKEN` - Token do npm para publicação
- `ARENA_ADDRESS_AMOY` - Endereço do Arena (após deploy)
- `WOD_TOKEN_ADDRESS_AMOY` - Endereço do WODToken
- `VALIDATOR_REGISTRY_ADDRESS_AMOY` - Endereço do ValidatorRegistry

**Para `wod-app-web`:**

- `VERCEL_TOKEN` - Token do Vercel
- `VERCEL_ORG_ID` - ID da organização
- `VERCEL_PROJECT_ID` - ID do projeto
- `NEXT_PUBLIC_ALCHEMY_API_KEY` - Chave API do Alchemy

### 5. Criar Primeira Release

```bash
cd wod-x-pro
git tag v1.0.0
git push origin v1.0.0
```

Isso vai disparar o workflow de publicação no npm.

## 🔧 Desenvolvimento Local

### Trabalhando com Contratos

```bash
cd wod-x-pro
npm install
npm run compile
npm test
npm run deploy:local
```

### Trabalhando com Frontend

```bash
cd wod-app-web
npm install
npm run dev
```

**Nota:** O frontend precisa do package `@wodxpro/contract-data` publicado ou linkado localmente:

```bash
# Link local (desenvolvimento)
cd wod-x-pro
npm link

cd ../wod-app-web
npm link @wodxpro/contract-data
```

## 📦 Versionamento

### Contratos (`wod-x-pro`)

- Versionamento semântico (SemVer)
- Tags Git: `v1.0.0`, `v1.1.0`, etc.
- Cada release publica nova versão no npm

### Frontend (`wod-app-web`)

- Versionamento independente
- Deploy contínuo via Vercel
- Não precisa de versionamento rigoroso (app web)

## 🔗 Integração Entre Repos

### Fluxo de Trabalho

1. **Desenvolver contratos** em `wod-x-pro`
2. **Fazer deploy** em testnet/mainnet
3. **Atualizar endereços** em `addresses/`
4. **Publicar package** no npm
5. **Atualizar frontend** com `npm update @wodxpro/contract-data`

### Sincronização Automática

O CI/CD do `wod-x-pro` automaticamente:

- Extrai ABIs após compilação
- Atualiza endereços após deploy
- Publica package no npm após release

O frontend sempre usa a versão mais recente do package.

## ⚠️ Breaking Changes

### Imports no Frontend

**Antes:**

```typescript
import { ArenaABI } from '@/abis/ArenaABI';
const ARENA_ADDRESS = process.env.NEXT_PUBLIC_ARENA_ADDRESS;
```

**Depois:**

```typescript
import { getContractDataForChain } from '@/lib/contractData';
const { abi, address } = await getContractDataForChain('Arena');
```

### Hooks

Os hooks (`useArena`, `useWODToken`) agora carregam dados do package automaticamente. Não é mais necessário passar ABIs e endereços manualmente.

## 📝 Notas Importantes

1. **ABIs removidos do frontend** - Agora vêm do package npm
2. **Endereços centralizados** - Gerenciados no `wod-x-pro`
3. **Build independente** - Cada repo tem seu próprio CI/CD
4. **Deploy independente** - Contratos e frontend podem ser deployados separadamente

## 🎯 Benefícios da Separação

1. **Isolamento** - Mudanças em contratos não quebram frontend
2. **Versionamento claro** - ABIs versionadas no npm
3. **CI/CD específico** - Pipelines otimizadas para cada tipo de projeto
4. **Escalabilidade** - Fácil adicionar novos frontends (mobile, admin)
5. **Reutilização** - Package pode ser usado em outros projetos

---

**Data da migração:** Dezembro 2025
**Status:** ✅ Completo

