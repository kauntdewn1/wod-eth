# 💰 Como Comprar e Enviar POL para Polygon Amoy Testnet

## ⚠️ Importante: Rede Amoy (Testnet)

Você está comprando para **Polygon Amoy testnet** (chainId: 80002), não a mainnet.

---

## 📍 Endereço de Destino

```
0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F
```

**Rede**: Polygon Amoy (Testnet)  
**Token**: POL (ou MATIC - ambos funcionam)  
**Quantidade**: Mínimo 0.12 POL (recomendado)

---

## 🔄 Opções para Obter POL na Amoy

### Opção 1: Bridge de Outra Testnet (Recomendado)

Se você tem ETH em **Sepolia** ou tokens em outras testnets:

1. Acesse um bridge de testnet:
   - **ChainBridge**: https://bridge.chain.link/
   - **Polygon Bridge**: https://portal.polygon.technology/
   
2. Conecte sua wallet
3. Selecione:
   - **Origem**: Sepolia (ou outra testnet onde você tem tokens)
   - **Destino**: Polygon Amoy
4. Envie para o endereço acima

### Opção 2: Exchange Centralizada com Suporte a Testnet

Algumas exchanges permitem enviar diretamente para testnets:

1. **Binance** (se disponível):
   - Retirar → Selecionar rede "Polygon Amoy"
   - Enviar para: `0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F`

2. **Coinbase** (se disponível):
   - Verificar se suporta Amoy testnet

### Opção 3: Comprar MATIC/POL na Mainnet e Fazer Bridge

⚠️ **Cuidado**: Isso requer enviar da mainnet para testnet, o que pode não ser suportado diretamente.

1. Compre POL/MATIC na Polygon mainnet
2. Use um bridge que suporte mainnet → testnet (raros)
3. Ou envie para uma exchange que permita retirar para testnet

### Opção 4: Usar um Serviço de Testnet Token (Pago)

Alguns serviços vendem tokens de testnet diretamente:
- **QuickNode**: https://www.quicknode.com/
- **Alchemy**: Verificar se oferecem tokens de testnet

---

## ✅ Verificação Após Recebimento

Após enviar, verifique o saldo:

```bash
# No Hardhat console
cd contracts
npx hardhat console --network amoy
> const [signer] = await ethers.getSigners()
> await ethers.provider.getBalance(signer.address)
```

Ou verifique no explorer:
- **Polygon Amoy Explorer**: https://amoy.polygonscan.com/
- Endereço: `0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F`

---

## 🚀 Após Receber POL

Execute o deploy do Arena:

```bash
cd contracts
npm run deploy:amoy:arena
```

Ou pelo Makefile (se adicionado):

```bash
make deploy-amoy-arena
```

---

## 📝 Notas

- **Não confunda Amoy com Mumbai**: São testnets diferentes
- **Amoy** é a nova testnet oficial da Polygon (substituirá Mumbai)
- **ChainId**: 80002 (Amoy) vs 80001 (Mumbai)
- **POL** é o novo token da Polygon (equivalente a MATIC)

---

**Última atualização**: Preparação para deploy do Arena

