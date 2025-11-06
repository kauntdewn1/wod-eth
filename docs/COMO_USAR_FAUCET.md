# Como Usar o Polygon Faucet - Passo a Passo

**Site**: https://faucet.polygon.technology/

---

## ⚠️ IMPORTANTE: Rede Correta

O projeto está configurado para **Mumbai (chainId: 80001)**, mas o faucet pode mostrar **Polygon Amoy**.

### Opção 1: Usar Mumbai (Recomendado para agora)

Se o faucet permitir selecionar Mumbai:
- **Selecione**: "Polygon Mumbai" (não Amoy)
- **Token**: MATIC ou POL (ambos funcionam)

### Opção 2: Atualizar para Amoy (Futuro)

Se quiser usar Amoy (nova testnet da Polygon):
- Precisamos atualizar `chainId` de 80001 para 11155111
- Atualizar RPC URLs

**Por enquanto, vamos com Mumbai.**

---

## 📝 Passo a Passo Visual

### 1. Verificar Local ✅

Você está no site correto: **faucet.polygon.technology** ✅

### 2. Selecionar Rede

**No dropdown "Select Chain & Token":**

- **Se mostrar "Polygon Amoy"**: 
  - ⚠️ Tente mudar para "Polygon Mumbai" (se disponível)
  - Se não tiver opção, use Amoy mas precisaremos atualizar o projeto depois
  
- **Se mostrar "Polygon Mumbai"**: ✅ Perfeito!

### 3. Selecionar Token

**No dropdown do token:**
- Selecione **"MATIC"** ou **"POL"** (ambos funcionam)
- POL é o novo token da Polygon (equivale a MATIC)

### 4. Verificar Identidade

Você precisa verificar sua identidade com **uma das opções**:

#### Opção A: GitHub
1. Clique no botão **"GitHub"**
2. Autorize o acesso
3. Conecte sua conta GitHub

#### Opção B: X (Twitter)
1. Clique no botão **"X.COM"**
2. Autorize o acesso
3. Conecte sua conta X/Twitter

**Você só precisa de UMA verificação** (GitHub OU X).

### 5. Inserir Endereço da Wallet

**No campo "Enter Wallet Address":**

1. Abra sua wallet (MetaMask, etc)
2. Copie seu endereço (começa com `0x...`)
3. Cole no campo do faucet
4. Verifique se está correto (64 caracteres após `0x`)

**Exemplo**:
```
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

### 6. Adicionar Rede à Wallet (Se Necessário)

Se sua wallet não conhece a rede:
- Clique em **"Add Chain to Wallet"**
- A wallet perguntará se quer adicionar
- Clique em "Aprovar" ou "Add Network"

### 7. Reivindicar Tokens

Após preencher tudo:
1. Clique no botão grande roxo **"Claim"**
2. Aguarde alguns segundos
3. Tokens serão enviados para sua wallet

---

## ✅ Checklist de Preenchimento

- [ ] Site correto: `faucet.polygon.technology` ✅
- [ ] Rede selecionada: Mumbai (ou Amoy se não tiver opção)
- [ ] Token selecionado: MATIC ou POL
- [ ] Identidade verificada: GitHub OU X
- [ ] Endereço da wallet colado (começa com `0x`)
- [ ] Botão "Claim" clicado
- [ ] Tokens recebidos na wallet

---

## 🔍 Verificar Se Recebeu

### Na Wallet (MetaMask)

1. Abra MetaMask
2. Selecione a rede (Mumbai ou Amoy)
3. Verifique o saldo de MATIC/POL
4. Deve mostrar: **0.5 MATIC** (ou similar)

### No Faucet

- Após clicar "Claim", você verá uma confirmação
- Pode levar 1-5 minutos para chegar

---

## ⚠️ Problemas Comuns

### "You have already claimed today"

**Causa**: Você já recebeu tokens hoje

**Solução**: 
- Aguarde 24 horas
- Ou use outro faucet (Alchemy, QuickNode)

### "Invalid wallet address"

**Causa**: Endereço mal formatado

**Solução**:
- Verifique se começa com `0x`
- Verifique se tem 42 caracteres no total
- Copie e cole novamente

### "Verification failed"

**Causa**: Problema com GitHub/X

**Solução**:
- Tente outro método (GitHub se tentou X, ou vice-versa)
- Verifique se está logado na conta
- Tente novamente em alguns minutos

---

## 📊 Quanto Você Receberá

### Polygon Faucet Oficial

- **Quantidade**: 0.5 MATIC/POL
- **Frequência**: 1 vez por dia
- **Suficiente para**: Múltiplos deploys (cada deploy usa ~0.004 MATIC)

### Outros Faucets (Alternativas)

Se não conseguir no faucet oficial:

1. **Alchemy Faucet**
   - URL: https://www.alchemy.com/faucets/polygon-mumbai
   - Quantidade: 0.5 MATIC
   - Requisitos: Conta Alchemy (grátis)

2. **QuickNode Faucet**
   - URL: https://faucet.quicknode.com/polygon/mumbai
   - Quantidade: 0.1 MATIC
   - Requisitos: Conta QuickNode (grátis)

---

## 🎯 Próximo Passo Após Receber

Depois de receber os tokens:

1. ✅ Verifique saldo na wallet
2. ✅ Configure `contracts/.env` com `PRIVATE_KEY`
3. ✅ Execute deploy: `make deploy-mumbai`

---

## 📝 Resumo Rápido

1. **Site**: ✅ Correto (faucet.polygon.technology)
2. **Rede**: Selecione Mumbai (se disponível)
3. **Token**: MATIC ou POL
4. **Verificar**: GitHub OU X
5. **Endereço**: Cole seu endereço (0x...)
6. **Claim**: Clique no botão roxo
7. **Aguarde**: 1-5 minutos
8. **Pronto**: Tokens na wallet!

---

*Guia visual do faucet - Novembro 2024*

