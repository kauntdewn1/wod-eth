# 🚨 NÃO FAÇA ISSO!

## ⛔ COMANDO PROIBIDO

```bash
❌ npm audit fix --force
```

**Este comando QUEBRA o projeto!**

---

## O que acontece quando você roda `npm audit fix --force`:

### 1. Atualiza versões MAJOR sem verificar compatibilidade

- Hardhat: `^2.19.0` → `3.0.10` (breaking changes!)
- Alchemy: `^1.x` → `3.x` (API completamente diferente!)
- Next.js: `14.0.0` → `14.2.33` (fora do range declarado)

### 2. Move dependências para lugares errados

- Dependências de produção vão para `devDependencies`
- Dependências de desenvolvimento vão para `dependencies`

### 3. Quebra tudo

- Contratos não compilam
- Frontend não funciona
- Erros de compatibilidade por todo lado

---

## ✅ O QUE FAZER AO INVÉS:

### Para instalar dependências:

```bash
make install
```

### Para corrigir problemas:

```bash
make fix-deps
```

### Para limpar e reinstalar:

```bash
make fix-all
```

### Para ver vulnerabilidades (SEM corrigir):

```bash
npm audit
```

---

## 🔧 Se você já rodou `npm audit fix --force`:

1. **Não commite as mudanças!**

2. Execute:

```bash
make fix-all
```

3. Isso vai limpar tudo e reinstalar corretamente

---

## 💡 Por que existem vulnerabilidades?

- **Maioria são em dependências transitivas** (não usadas diretamente)
- **Não são críticas** para desenvolvimento/testnet
- **São em bibliotecas de wallet connect** (wagmi, walletconnect)
- **Já corrigidas nas versões mais recentes**, mas atualizar quebraria tudo

**É melhor ter vulnerabilidades não-críticas do que um projeto quebrado!**

---

## 📋 Resumo

| Ação | Permitido? |
|------|------------|
| `npm audit` | ✅ Sim (só ver) |
| `npm audit fix` | ⚠️ Cuidado (pode quebrar) |
| `npm audit fix --force` | ❌ **NUNCA!** |
| `make install` | ✅ Sim |
| `make fix-deps` | ✅ Sim |
| `make fix-all` | ✅ Sim (limpa tudo) |

---

**LEMBRE-SE:** Vulnerabilidades em dependências de desenvolvimento/testnet não são críticas. É melhor ter um projeto funcionando!

