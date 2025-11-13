# Troubleshooting - WOD [X] PRO

**Domain**: `wod.eth` | **Token**: `$WOD`

## Erros Comuns e Soluções

### 1. Erro: Lighthouse SDK versão incorreta

**Erro:**
```
No matching version found for @lighthouse-web3/sdk@^2.8.0
```

**Solução:**
```bash
# Já corrigido no package.json para versão 0.4.3
# Execute:
make fix-deps
```

---

### 2. Erro: Conflito de dependências (typechain)

**Erro:**
```
Could not resolve dependency:
peer @typechain/ethers-v6@"^0.4.0" from @nomicfoundation/hardhat-toolbox
```

**Solução:**
```bash
# Já corrigido no package.json
# Execute:
make fix-deps
```

---

### 3. Erro: React não encontrado

**Erro:**
```
Cannot find module 'react' or its corresponding type declarations
```

**Solução:**
```bash
# Reinstalar dependências
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Ou use o script:
make fix-deps
```

---

### 4. Erro: Next.js não encontra TypeScript

**Solução:**
```bash
cd frontend
npm install --save-dev typescript @types/react @types/react-dom @types/node
```

---

### 5. Todos os erros de uma vez

**Solução Completa:**
```bash
# Use o script de correção
make fix-deps

# Ou manualmente:
bash scripts/fix-dependencies.sh
```

---

## Comandos Úteis

```bash
# Limpar tudo e reinstalar
make clean-all
make install

# Verificar status
make status

# Verificar variáveis de ambiente
make check-env
```

---

## Se nada funcionar

1. **Limpeza Total:**
```bash
make clean-all
rm -rf node_modules package-lock.json
rm -rf contracts/node_modules contracts/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
```

2. **Reinstalar do Zero:**
```bash
make install
```

3. **Verificar Versões:**
```bash
node --version    # Deve ser v18+
npm --version     # Deve ser v9+
```

---

## Problemas Conhecidos

### Workspace do npm/yarn
Se estiver usando workspaces e houver conflitos:

```bash
# Desabilitar workspace temporariamente
npm install --legacy-peer-deps --no-workspaces

# Ou instalar em cada diretório separadamente
cd contracts && npm install --legacy-peer-deps
cd ../frontend && npm install --legacy-peer-deps
```

---

## Dependências Críticas

- **React**: ^18.2.0
- **Next.js**: 14.0.0
- **Hardhat**: ^2.19.0
- **Wagmi**: ^2.0.0 (requer viem ^2.0.0)
- **Lighthouse**: ^0.4.3 (não 2.8.0!)
- **Typechain**: ^0.4.0 (compatível com hardhat-toolbox)

---

## Precisou de ajuda?

1. Verifique o log: `npm error` mostra qual pacote está com problema
2. Execute `make status` para ver o estado geral
3. Use `make fix-deps` para correção automática

