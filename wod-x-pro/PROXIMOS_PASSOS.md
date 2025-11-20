# 📋 Próximos Passos Após o Deploy

Este documento detalha todos os passos que devem ser executados após o deploy dos contratos na Polygon Mainnet.

---

## 🎯 Resumo dos Próximos Passos

1. ✅ Verificar contratos no Polygonscan
2. ✅ Verificar ownership (CRÍTICO)
3. ✅ Executar distribuição inicial de tokens
4. ✅ Conceder MINTER_ROLE para Arena (via Safe)
5. ✅ Criar pool de liquidez no Uniswap
6. ✅ Atualizar frontend com endereços
7. ✅ Documentar endereços e transações

---

## 1️⃣ Verificar Contratos no Polygonscan

### Verificação Automática (Recomendado)

```bash
npm run verify:polygon
```

Isso verifica automaticamente todos os contratos deployados no Polygonscan.

### Verificação Manual

Acesse cada contrato no Polygonscan:

- **WODToken**: `https://polygonscan.com/address/{WOD_TOKEN_ADDRESS}`
- **ValidatorRegistry**: `https://polygonscan.com/address/{VALIDATOR_REGISTRY_ADDRESS}`
- **Arena**: `https://polygonscan.com/address/{ARENA_ADDRESS}`

**O que verificar:**
- ✅ Código fonte está visível
- ✅ Contrato foi verificado
- ✅ Transações de deploy aparecem corretamente
- ✅ Saldo inicial do token (se houver)

---

## 2️⃣ Verificar Ownership (CRÍTICO)

### Verificação Automática

O script de deploy já verifica automaticamente o ownership. Verifique no console se apareceu:

```
✅ All contracts owned by: {SAFE_ADDRESS}
✅ WODToken MINTER_ROLE: ✅
✅ WODToken PAUSER_ROLE: ✅
```

### Verificação Manual no Polygonscan

1. Acesse o contrato **WODToken** no Polygonscan
2. Vá na aba **"Contract"** → **"Read Contract"**
3. Execute a função `owner()` → Deve retornar o `SAFE_ADDRESS`
4. Execute `hasRole(MINTER_ROLE, {ARENA_ADDRESS})` → Deve retornar `false` inicialmente (será configurado no passo 4)

**⚠️ CRÍTICO:** Se o ownership não estiver com o Safe, execute:

```bash
npm run transfer-ownership
```

---

## 3️⃣ Executar Distribuição Inicial de Tokens

### Configurar Endereços de Distribuição

Edite o arquivo `.env` e configure os endereços:

```env
# Distribuição Inicial (opcional)
TREASURY_ADDRESS=0x...
FOUNDER_ADDRESS=0x...
PARTNER_ADDRESS=0x...
LIQUIDITY_ADDRESS=0x...
DAO_ADDRESS=0x...
```

### Executar Distribuição

```bash
npm run initial-distribution
```

**O que este script faz:**
- Conecta ao WODToken deployado
- Executa a distribuição conforme `WODToken_Initial_Distribution.json`
- Mint tokens para cada endereço configurado
- Valida que a distribuição foi bem-sucedida
- Atualiza o arquivo de distribuição com os hashes das transações

**Tokenomics:**
- Tesouraria: 300.000.000 WOD (30%)
- Recompensas de Arena: 250.000.000 WOD (25%) - mint progressivo
- Fundadores: 150.000.000 WOD (15%)
- Parceiros: 100.000.000 WOD (10%)
- Liquidez: 100.000.000 WOD (10%)
- DAO: 100.000.000 WOD (10%)

---

## 4️⃣ Conceder MINTER_ROLE para Arena (via Safe)

### Por que isso é necessário?

A Arena precisa da `MINTER_ROLE` para poder mint tokens como recompensas aos atletas.

### Como fazer (via Safe Multisig)

1. Acesse [Safe Wallet](https://app.safe.global/)
2. Conecte sua wallet (deve ser um dos signatários do Safe)
3. Selecione o Safe configurado
4. Clique em **"New Transaction"** → **"Contract Interaction"**
5. Cole o endereço do **WODToken**
6. Selecione a função: `grantRole(bytes32 role, address account)`
7. Preencha os parâmetros:
   - `role`: `0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6` (MINTER_ROLE)
   - `account`: `{ARENA_ADDRESS}`
8. Revise e assine a transação
9. Aguarde as outras assinaturas necessárias (se multisig)
10. Execute a transação

### Verificar após conceder

```bash
# No Polygonscan, execute:
hasRole(MINTER_ROLE, {ARENA_ADDRESS}) → deve retornar true
```

---

## 5️⃣ Criar Pool de Liquidez no Uniswap

### Pré-requisitos

- ✅ 100.000.000 WOD na `LIQUIDITY_ADDRESS`
- ✅ MATIC equivalente (para o par WOD/MATIC)
- ✅ Preço inicial definido (ex: $0.10/WOD)

### Passos

1. Acesse [Uniswap V3](https://app.uniswap.org/) na Polygon
2. Conecte a wallet que tem os tokens (LIQUIDITY_ADDRESS)
3. Vá em **"Pool"** → **"New Position"**
4. Selecione o par: **WOD / MATIC** (ou WOD / USDC)
5. Configure:
   - **Price Range**: Defina o range de preço inicial
   - **Amount**: 100.000.000 WOD + MATIC equivalente
6. Revise e crie o pool
7. Documente o endereço do pool e o preço inicial

### Exemplo de Configuração

- **Preço Inicial**: $0.10/WOD
- **Liquidez**: 100.000.000 WOD + 10.000.000 MATIC (ou equivalente em USDC)
- **Fee Tier**: 0.3% (padrão)

---

## 6️⃣ Atualizar Frontend com Endereços

### Arquivo de Endereços

Os endereços são salvos automaticamente em:

```
wod-x-pro/addresses/polygon.json
```

### Atualizar Frontend

1. Copie os endereços de `addresses/polygon.json`
2. Atualize o arquivo `.env` do frontend:

```env
# wod-app-web/.env
NEXT_PUBLIC_WOD_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_ARENA_ADDRESS=0x...
NEXT_PUBLIC_VALIDATOR_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=137
```

3. Reinicie o servidor de desenvolvimento:

```bash
cd wod-app-web
npm run dev
```

---

## 7️⃣ Documentar Endereços e Transações

### Informações para Documentar

Crie um documento (ou atualize o README) com:

```markdown
## Deploy Information

**Data:** {DATA_DO_DEPLOY}
**Rede:** Polygon Mainnet (Chain ID: 137)

### Contratos
- **WODToken**: `0x...`
- **ValidatorRegistry**: `0x...`
- **Arena**: `0x...`

### Ownership
- **Safe Multisig**: `0x...`
- **Deployer**: `0x...`

### Transações
- **WODToken Deploy**: `0x...`
- **ValidatorRegistry Deploy**: `0x...`
- **Arena Deploy**: `0x...`
- **Initial Distribution**: `0x...`
- **MINTER_ROLE Grant**: `0x...`

### Links
- **Polygonscan WODToken**: https://polygonscan.com/address/{WOD_TOKEN_ADDRESS}
- **Polygonscan ValidatorRegistry**: https://polygonscan.com/address/{VALIDATOR_REGISTRY_ADDRESS}
- **Polygonscan Arena**: https://polygonscan.com/address/{ARENA_ADDRESS}
- **Uniswap Pool**: https://app.uniswap.org/pools/{POOL_ID}
```

### Arquivos de Deploy

Os arquivos de deploy completos são salvos em:

```
wod-x-pro/deployments/polygon-mainnet-{timestamp}.json
```

---

## ✅ Checklist Final

Após completar todos os passos, verifique:

- [ ] Todos os contratos verificados no Polygonscan
- [ ] Ownership de todos os contratos está com Safe
- [ ] Distribuição inicial executada e validada
- [ ] MINTER_ROLE concedida para Arena
- [ ] Pool de liquidez criado no Uniswap
- [ ] Frontend atualizado com endereços
- [ ] Documentação completa criada
- [ ] Todos os endereços e transações documentados

---

## 🔗 Links Úteis

- **Polygonscan**: https://polygonscan.com
- **Safe Wallet**: https://app.safe.global/
- **Uniswap V3**: https://app.uniswap.org/
- **Alchemy Dashboard**: https://dashboard.alchemy.com/

---

## 📞 Suporte

Se tiver problemas em qualquer passo:

1. Verifique os logs do script executado
2. Confirme que todas as variáveis de ambiente estão configuradas
3. Verifique que a wallet tem saldo suficiente
4. Confirme que o Safe foi criado na Polygon Mainnet
5. Verifique a conexão RPC

---

**Última atualização:** Dezembro 2024  
**Rede:** Polygon Mainnet (Chain ID: 137)

