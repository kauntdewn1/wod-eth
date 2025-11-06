# Preparação para Deploy - WOD [X] PRO

**Domain**: `wod.eth` | **Token**: `WOD`

Este guia explica **exatamente** o que você precisa antes de fazer o deploy.

---

## 🎯 O Que Você Precisa

### 1. Wallet (Endereço Ethereum)

Você precisa de uma **wallet** com:
- **Chave privada** (para assinar transações)
- **MATIC** (para pagar gas fees)

### 2. Tokens MATIC para Gas

**Para Mumbai (Testnet)**:
- **Recomendado**: 0.1 - 0.5 MATIC
- **Mínimo**: 0.01 MATIC
- **Custo estimado do deploy**: ~0.001 - 0.01 MATIC

**Para Polygon (Mainnet)**:
- **Recomendado**: 1 - 5 MATIC
- **Mínimo**: 0.5 MATIC
- **Custo estimado do deploy**: ~0.1 - 0.5 MATIC

---

## 🔑 Passo 1: Escolher Wallet

### Opção A: Usar Wallet Existente (MetaMask, etc)

1. Abra sua wallet (MetaMask, Trust Wallet, etc)
2. Selecione a rede:
   - **Mumbai Testnet** (para testes)
   - **Polygon Mainnet** (para produção)
3. Copie a **chave privada**:
   - MetaMask: Settings → Security & Privacy → Export Private Key
   - ⚠️ **NUNCA compartilhe sua chave privada!**

### Opção B: Criar Nova Wallet (Recomendado para Testnet)

1. Crie uma nova wallet apenas para deploy
2. Use apenas para testes
3. Não use wallet principal

---

## 💰 Passo 2: Conseguir MATIC

### Para Mumbai (Testnet) - GRATUITO

**Faucets disponíveis**:

1. **Polygon Faucet** (Recomendado)
   - URL: https://faucet.polygon.technology/
   - Envia: 0.5 MATIC
   - Requisitos: Conta Alchemy (grátis)

2. **QuickNode Faucet**
   - URL: https://faucet.quicknode.com/polygon/mumbai
   - Envia: 0.1 MATIC
   - Requisitos: Conta QuickNode (grátis)

3. **Alchemy Faucet**
   - URL: https://www.alchemy.com/faucets/polygon-mumbai
   - Envia: 0.5 MATIC
   - Requisitos: Conta Alchemy (grátis)

**Como usar**:
1. Conecte sua wallet ao site
2. Cole seu endereço da wallet
3. Clique em "Send Me MATIC"
4. Aguarde alguns minutos
5. Verifique o saldo na sua wallet

### Para Polygon (Mainnet) - COMPRAR

**Onde comprar**:
- **Binance, Coinbase, etc**: Comprar MATIC
- **Bridges**: Trazer MATIC de outras blockchains
- **Exchanges descentralizados**: Trocar outros tokens por MATIC

---

## 📋 Passo 3: Configurar .env

### 1. Criar arquivo `.env` na raiz do projeto

```bash
cd contracts
cp .env.example .env
```

### 2. Editar `.env` com suas informações

```env
# Sua chave privada (sem 0x no início)
PRIVATE_KEY=sua_chave_privada_aqui

# RPC URLs (já configuradas, pode usar padrão ou suas próprias)
POLYGON_RPC_URL=https://polygon-rpc.com
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com

# Ou usar Alchemy RPC (melhor performance)
MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/SUA_API_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/SUA_API_KEY
```

### 3. Verificar saldo antes do deploy

O script de deploy já mostra o saldo:

```bash
cd contracts
npm run deploy:mumbai
```

Você verá:
```
Deploying contracts with account: 0x...
Account balance: 500000000000000000  # 0.5 MATIC
```

---

## ✅ Checklist Antes do Deploy

### Wallet
- [ ] Wallet criada ou existente
- [ ] Chave privada copiada
- [ ] Rede configurada (Mumbai ou Polygon)

### Tokens
- [ ] MATIC na wallet (testnet ou mainnet)
- [ ] Saldo suficiente (0.1+ MATIC para testnet)

### Configuração
- [ ] Arquivo `.env` criado
- [ ] `PRIVATE_KEY` configurado
- [ ] `MUMBAI_RPC_URL` ou `POLYGON_RPC_URL` configurado

### Verificação
- [ ] Saldo verificado (`npm run deploy:mumbai` mostra saldo)
- [ ] Rede correta selecionada

---

## 🚀 Comandos de Deploy

### Deploy Local (Gratuito, sem gas)

```bash
# Terminal 1: Iniciar Hardhat node
cd contracts
npx hardhat node

# Terminal 2: Deploy
npm run deploy:local
```

**Não precisa de MATIC** - Hardhat cria MATIC fake automaticamente.

### Deploy Mumbai (Testnet)

```bash
cd contracts
npm run deploy:mumbai
```

**Precisa de MATIC** - Use faucet para conseguir.

### Deploy Polygon (Mainnet)

```bash
cd contracts
npm run deploy:polygon
```

**Precisa de MATIC real** - Compre ou traga MATIC.

---

## 💡 Dicas Importantes

### 1. Segurança da Chave Privada

- ⚠️ **NUNCA** commite `.env` no Git
- ⚠️ **NUNCA** compartilhe sua chave privada
- ✅ Use `.gitignore` para proteger `.env`
- ✅ Para testnet, use wallet separada

### 2. Teste Primeiro

- ✅ **Sempre teste em Mumbai primeiro**
- ✅ Verifique se contratos funcionam
- ✅ Depois faça deploy em Polygon

### 3. Backup dos Endereços

Após deploy, salve os endereços:
- WODToken address
- ValidatorRegistry address
- Arena address

Você precisará deles para configurar o frontend.

---

## 📊 Custo Estimado do Deploy

### Mumbai (Testnet)

| Item | Gás Estimado | Custo (MATIC) |
|------|--------------|---------------|
| WODToken | ~1.200.000 | ~0.001 |
| ValidatorRegistry | ~1.500.000 | ~0.001 |
| Arena | ~2.500.000 | ~0.002 |
| **Total** | **~5.200.000** | **~0.004 MATIC** |

**Custo real**: Quase zero (testnet é gratuito via faucet)

### Polygon (Mainnet)

| Item | Gás Estimado | Custo (MATIC) |
|------|--------------|---------------|
| WODToken | ~1.200.000 | ~0.01 |
| ValidatorRegistry | ~1.500.000 | ~0.01 |
| Arena | ~2.500.000 | ~0.02 |
| **Total** | **~5.200.000** | **~0.04 MATIC** |

**Custo real**: ~$0.02-0.05 USD (MATIC é barato)

---

## 🔍 Como Verificar Se Está Pronto

### 1. Verificar Saldo

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network mumbai --dry-run
```

Ou verificar na sua wallet:
- MetaMask: Mostra saldo em MATIC
- Deve ter pelo menos 0.1 MATIC

### 2. Testar Conexão

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network mumbai
```

Se funcionar, você verá:
```
Deploying contracts with account: 0x...
Account balance: 500000000000000000
```

---

## ⚠️ Problemas Comuns

### "Insufficient funds"

**Causa**: Saldo insuficiente de MATIC

**Solução**:
1. Verifique saldo na wallet
2. Use faucet para conseguir MATIC (testnet)
3. Compre MATIC (mainnet)

### "Invalid private key"

**Causa**: PRIVATE_KEY mal formatado

**Solução**:
- Remova `0x` do início (se tiver)
- Certifique-se de que tem 64 caracteres hexadecimais

### "Network connection failed"

**Causa**: RPC URL incorreta ou indisponível

**Solução**:
1. Use RPC da Alchemy (mais confiável)
2. Verifique se a URL está correta
3. Tente outro RPC

---

## 📝 Resumo

### Para Deploy em Mumbai (Testnet)

1. ✅ Wallet criada
2. ✅ Conseguir MATIC via faucet (0.5 MATIC)
3. ✅ Configurar `.env` com `PRIVATE_KEY`
4. ✅ Rodar `npm run deploy:mumbai`

### Para Deploy em Polygon (Mainnet)

1. ✅ Wallet criada
2. ✅ Comprar MATIC (1-5 MATIC)
3. ✅ Configurar `.env` com `PRIVATE_KEY`
4. ✅ Rodar `npm run deploy:polygon`

---

## 🎯 Próximos Passos Após Deploy

1. **Copiar endereços** dos contratos
2. **Atualizar `frontend/.env`** com os endereços
3. **Testar contratos** no frontend
4. **Mint tokens iniciais** (se necessário)

---

*Guia de preparação - Novembro 2024*

