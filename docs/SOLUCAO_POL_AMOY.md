# ✅ Solução: Obter POL na Amoy Testnet

## 📊 Situação Atual

- ✅ **Polygon Mainnet**: 4.064 POL (disponível)
- ❌ **Polygon Amoy**: 0.008 POL (insuficiente - precisa ~0.12 POL)

## ⚠️ Limitação

**Não é possível fazer bridge direto** de Polygon Mainnet para Amoy Testnet. Os bridges geralmente só funcionam entre mainnets.

## 🎯 Melhores Soluções

### Opção 1: Faucet do Polygon (Grátis) ⭐ RECOMENDADO

Se já passou 24h desde a última solicitação:

1. Acesse: https://faucet.polygon.technology/
2. Selecione **Amoy testnet**
3. Endereço: `0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F`
4. Solicite POL (geralmente dá 0.1-0.5 POL)

**Vantagem**: Grátis  
**Desvantagem**: Limite de 24h entre solicitações

---

### Opção 2: Usar um Serviço de Testnet Token

Alguns serviços vendem tokens de testnet:

1. **QuickNode**: https://www.quicknode.com/
   - Compra testnet tokens diretamente
   - Preço geralmente baixo (alguns dólares)

2. **Alchemy**: Verificar se oferecem testnet tokens

**Vantagem**: Rápido, sem espera  
**Desvantagem**: Custo (geralmente pequeno)

---

### Opção 3: Bridge de Outra Testnet

Se você tem tokens em outra testnet (Sepolia, Goerli, etc):

1. **ChainBridge**: https://bridge.chain.link/
   - Conecte sua wallet
   - Selecione origem: Sepolia (ou outra testnet)
   - Selecione destino: Polygon Amoy
   - Envie para: `0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F`

**Vantagem**: Grátis (se já tem tokens em testnet)  
**Desvantagem**: Precisa ter tokens em outra testnet primeiro

---

### Opção 4: Trocar com Comunidade

Algumas comunidades têm grupos onde pessoas trocam tokens de testnet:

- Discord da Polygon
- Telegram groups
- Reddit r/ethereum ou r/polygonnetwork

**Vantagem**: Pode ser grátis  
**Desvantagem**: Dependente de encontrar alguém

---

## 🚀 Após Receber POL na Amoy

Execute o deploy do Arena:

```bash
make deploy-amoy-arena
```

Ou:

```bash
cd contracts
npm run deploy:amoy:arena
```

---

## 📝 Verificar Saldo

Use o script criado:

```bash
cd contracts
npm run check-balance
```

Ou verifique no explorer:
- **Amoy**: https://amoy.polygonscan.com/address/0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F

---

## 💡 Recomendação

**Para desenvolvimento/testes**: Use o faucet (Opção 1)  
**Para produção/urgência**: Use QuickNode ou serviço similar (Opção 2)

---

**Última atualização**: Solução para obter POL na Amoy

