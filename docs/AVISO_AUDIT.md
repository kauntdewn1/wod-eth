# ⚠️ AVISO: NÃO USE `npm audit fix --force`

## Problema

O comando `npm audit fix --force` **pode quebrar seu projeto** porque:

1. **Atualiza versões major** sem verificar compatibilidade
2. **Substitui dependências** por versões incompatíveis
3. **Causa conflitos** que são difíceis de reverter

## O que aconteceu antes

Quando você rodou `npm audit fix --force`, ele:
- ❌ Atualizou Alchemy de v1.x para v3.x (breaking changes)
- ❌ Atualizou Next.js fora do range declarado
- ❌ Criou conflitos entre typechain versions

## ✅ Solução Correta

### Para instalar dependências:
```bash
make install
# ou
make fix-deps
```

### Para atualizar dependências:
```bash
# Atualizar pacote específico
npm update [pacote] --legacy-peer-deps

# Verificar atualizações
npm outdated
```

### Para vulnerabilidades:
```bash
# Ver apenas (não corrige automaticamente)
npm audit

# Corrigir SEM --force (só patches)
npm audit fix
```

## Vulnerabilidades no Projeto

O projeto tem algumas vulnerabilidades reportadas, mas:

- ✅ **Maioria são em dependências transitivas** (não usadas diretamente)
- ✅ **Não são críticas** para desenvolvimento/testnet
- ✅ **Já corrigidas nas versões mais recentes** (mas podem quebrar compatibilidade)

### Se precisar corrigir:

1. **Atualizar manualmente** cada dependência problemática
2. **Testar após cada atualização**
3. **Não usar --force**

## Comandos Seguros

```bash
# Instalar tudo
make install

# Limpar e reinstalar
make fix-deps

# Ver status
make status

# Verificar vulnerabilidades (sem corrigir)
npm audit
```

## Regra de Ouro

🔴 **NUNCA use `npm audit fix --force`**

✅ **SEMPRE use `npm audit fix` (sem --force)**

OU melhor ainda:
✅ **Use `make fix-deps` para correções controladas**

---

**Lembre-se:** Vulnerabilidades em dependências de desenvolvimento/testnet não são críticas. É melhor ter um projeto funcionando do que quebrado por correções automáticas.

