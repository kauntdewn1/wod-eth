# 📊 Status do Deploy - Polygon Amoy

## ✅ Contratos Deployados

- **WODToken**: `0xA6081E450193a9184D9C7dDC9152d8b0aFBD7b8d`
- **ValidatorRegistry**: `0x3470Ef533399CEAEc3E76B3C0E909aC27b338BA9`
- **Arena**: `0xfdFDB88617F39C2FC0ca31d6f4847E6c0D9513cf` ✅

## 🎉 Status: Deploy Completo!

Todos os contratos foram deployados com sucesso na rede Polygon Amoy.

## 📝 Variáveis de Ambiente

Atualizar `frontend/.env` com os endereços:
```env
NEXT_PUBLIC_WOD_TOKEN_ADDRESS=0xA6081E450193a9184D9C7dDC9152d8b0aFBD7b8d
NEXT_PUBLIC_VALIDATOR_REGISTRY_ADDRESS=0x3470Ef533399CEAEc3E76B3C0E909aC27b338BA9
NEXT_PUBLIC_ARENA_ADDRESS=0xfdFDB88617F39C2FC0ca31d6f4847E6c0D9513cf
```

## ✅ Próximos Passos

### 1. Verificar Contratos no PolygonScan

**⚠️ Nota Importante**: A verificação automática via Hardhat está com problemas devido à migração para API V2 do Etherscan. O plugin `@nomicfoundation/hardhat-verify` ainda não passa o parâmetro `chainid` corretamente para a API V2.

**Recomendação**: Use verificação manual (mais confiável para testnets).

#### Verificação Manual (Recomendado)

1. Acesse cada contrato no PolygonScan:
   - **WODToken**: https://amoy.polygonscan.com/address/0xA6081E450193a9184D9C7dDC9152d8b0aFBD7b8d#code
   - **ValidatorRegistry**: https://amoy.polygonscan.com/address/0x3470Ef533399CEAEc3E76B3C0E909aC27b338BA9#code
   - **Arena**: https://amoy.polygonscan.com/address/0xfdFDB88617F39C2FC0ca31d6f4847E6c0D9513cf#code

2. Clique em **"Contract"** → **"Verify and Publish"**

3. Selecione:
   - **Compiler Type**: Solidity (Single file) ou Standard JSON Input
   - **Compiler Version**: `v0.8.20+commit.a1b79de6`
   - **Open Source License**: MIT
   - **Optimization**: Yes (200 runs)

4. **Argumentos do Construtor**:
   - **WODToken**: `0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F` (owner)
   - **ValidatorRegistry**: `0xA6081E450193a9184D9C7dDC9152d8b0aFBD7b8d,0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F,1000000000000000000000` (wodToken, owner, minStake)
   - **Arena**: `0xA6081E450193a9184D9C7dDC9152d8b0aFBD7b8d,0x3470Ef533399CEAEc3E76B3C0E909aC27b338BA9,0xc2D0eb89Dbf0FEBab5497CED7Bf357fD911dE28F` (wodToken, validatorRegistry, owner)

5. Cole o código fonte do contrato e submeta

**Nota**: A API key do Etherscan está configurada no `.env`, mas a verificação automática ainda não funciona devido a limitações do plugin com API V2.

### 2. Testar os Contratos

Após verificar, você pode interagir com os contratos no PolygonScan:
- **WODToken**: https://amoy.polygonscan.com/address/0xA6081E450193a9184D9C7dDC9152d8b0aFBD7b8d
- **ValidatorRegistry**: https://amoy.polygonscan.com/address/0x3470Ef533399CEAEc3E76B3C0E909aC27b338BA9
- **Arena**: https://amoy.polygonscan.com/address/0xfdFDB88617F39C2FC0ca31d6f4847E6c0D9513cf

---

**Última atualização**: Deploy completo em Amoy testnet - Todos os contratos deployados! 🚀

