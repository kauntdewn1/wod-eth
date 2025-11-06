# 📊 Status do Deploy - Polygon Amoy

## ✅ Contratos Deployados

- **WODToken**: `0xA6081E450193a9184D9C7dDC9152d8b0aFBD7b8d`
- **ValidatorRegistry**: `0x3470Ef533399CEAEc3E76B3C0E909aC27b338BA9`

## ❌ Pendente

- **Arena**: Falhou por falta de gas

## 💰 Análise de Gas

- **Saldo inicial**: 0.1 POL
- **Gasto (WODToken + ValidatorRegistry)**: ~0.092 POL
- **Saldo restante**: ~0.008 POL
- **Custo estimado Arena**: ~0.115 POL
- **Falta**: **~0.107 POL** (≈0.11 POL)

## 🚀 Próximos Passos

### Opção 1: Faucet (limite de 24h)
- **Solicitar mais POL no faucet**: https://faucet.polygon.technology/
  - Selecionar **Amoy** testnet
  - Endereço: `0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F`
  - Solicitar pelo menos **0.12 POL** para garantir

### Opção 2: Comprar POL (Recomendado se faucet bloqueado)
- **Ver guia completo**: `docs/COMPRAR_POL_AMOY.md`
- **Endereço para envio**: `0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F`
- **Rede**: Polygon Amoy (chainId: 80002)
- **Quantidade**: Mínimo 0.12 POL

### Após receber POL
Execute:
```bash
cd contracts
npm run deploy:amoy:arena
```

Ou pelo Makefile:
```bash
make deploy-amoy-arena
```

## 📝 Variáveis de Ambiente

Após o deploy completo, atualizar `frontend/.env`:
```env
NEXT_PUBLIC_WOD_TOKEN_ADDRESS=0xA6081E450193a9184D9C7dDC9152d8b0aFBD7b8d
NEXT_PUBLIC_VALIDATOR_REGISTRY_ADDRESS=0x3470Ef533399CEAEc3E76B3C0E909aC27b338BA9
NEXT_PUBLIC_ARENA_ADDRESS=<endereço após deploy>
```

---

**Última atualização**: Deploy parcial em Amoy testnet

