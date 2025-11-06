# 🔄 Como Transferir POL da Mainnet para Amoy Testnet

Se você já tem POL na **Polygon mainnet** (ou outra rede) na mesma carteira, você pode fazer bridge para **Amoy testnet**.

---

## ⚠️ Importante

**Não é possível fazer bridge direto** de mainnet para testnet em muitos casos. As opções são:

### Opção 1: Bridge Oficial (Limitado)

A maioria dos bridges não permite mainnet → testnet diretamente. Mas você pode tentar:

1. **Polygon Portal**: https://portal.polygon.technology/
   - Verificar se há opção de testnet
   - Geralmente só permite bridges entre mainnets

2. **ChainBridge**: https://bridge.chain.link/
   - Verificar se suporta testnet

### Opção 2: Vender na Mainnet e Comprar em Exchange (Não recomendado)

Não é prático para testnet.

### Opção 3: Usar um Serviço de Testnet Token (Recomendado)

Alguns serviços vendem tokens de testnet diretamente:

1. **QuickNode**: https://www.quicknode.com/
   - Oferece tokens de testnet
   - Você compra testnet tokens diretamente

2. **Alchemy**: Verificar se oferecem tokens de testnet

### Opção 4: Trocar com Alguém (Comunidade)

Algumas comunidades têm grupos onde pessoas trocam tokens de testnet:
- Discord da Polygon
- Telegram groups
- Reddit r/ethereum

---

## ✅ Solução Mais Prática: Usar o Faucet Novamente

Se você já esperou 24h desde a última solicitação:

1. Acesse: https://faucet.polygon.technology/
2. Selecione **Amoy testnet**
3. Endereço: `0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F`
4. Solicite POL

---

## 🔍 Verificar em Qual Rede Você Recebeu POL

### Opção 1: Script Automático (Recomendado)

```bash
cd contracts
npm run check-balance
```

Este script verifica o saldo em todas as redes configuradas (Mainnet, Mumbai, Amoy).

### Opção 2: Verificar Manualmente

```bash
# Verificar saldo na mainnet Polygon
cd contracts
npx hardhat console --network polygon
> const [signer] = await ethers.getSigners()
> await ethers.provider.getBalance(signer.address)
```

### Opção 3: Explorers

Ou verifique no explorer:

- **Polygon Mainnet**: https://polygonscan.com/address/0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F
- **Polygon Amoy**: https://amoy.polygonscan.com/address/0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F

---

## 📝 Endereço de Destino (Amoy)

```
0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F
```

**Rede**: Polygon Amoy (chainId: 80002)

---

## 🚨 Limitação dos Bridges

A maioria dos bridges **não permite** transferir de mainnet para testnet porque:
- São redes com propósitos diferentes
- Testnets são para desenvolvimento (grátis via faucets)
- Mainnets são para produção (valores reais)

**Recomendação**: Use o faucet do Polygon ou compre testnet tokens diretamente de um serviço como QuickNode.

---

**Última atualização**: Guia para transferir POL entre redes

