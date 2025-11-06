# Gas Manager - Alchemy Account Kit

## O Que É o Gas Policy ID?

O **Gas Policy ID** é uma configuração do Alchemy Gas Manager que permite **subsidiar transações dos usuários**.

### Como Funciona

1. **Sem Gas Policy ID**: Usuários pagam suas próprias gas fees
2. **Com Gas Policy ID**: Protocolo paga as gas fees (usuários não pagam nada)

---

## ✅ Vantagens

### Para Usuários
- ✅ **Zero fricção**: Não precisam ter ETH/MATIC para transações
- ✅ **Experiência Web2**: Usam o app sem saber o que é "gas"
- ✅ **Mass adoption**: Remove barreira de entrada

### Para o Protocolo
- ✅ **Onboarding fácil
- ✅ **Competitividade**: Usuários não precisam comprar tokens só para pagar gas
- ✅ **Controle**: Você define limites de gastos por política

---

## 🔧 Configuração

### 1. Obter Gas Policy ID

1. Acesse [Alchemy Dashboard](https://dashboard.alchemy.com/)
2. Vá em **Account Abstraction** → **Gas Manager**
3. Crie uma nova política ou use uma existente
4. Copie o **Policy ID**

### 2. Adicionar ao .env

```env
NEXT_PUBLIC_ALCHEMY_POLICY_ID=seu-policy-id-aqui
```

### 3. Verificar Status

O código em `lib/alchemyAccountKit.ts` verifica automaticamente se o Policy ID está configurado:

```typescript
// Se Policy ID existe → Gas Manager ativado
// Se não existe → Usuários pagam suas próprias gas fees
```

---

## 📊 Como Usar no Código

### Account Kit Configurado

```typescript
import { getAccountKit, isGasManagerEnabled } from '@/lib/alchemyAccountKit';

const accountKit = getAccountKit();

// Verifica se Gas Manager está ativo
if (isGasManagerEnabled()) {
  console.log('✅ Transações serão subsidiadas');
} else {
  console.warn('⚠️ Usuários pagarão gas fees');
}
```

### Transações Automáticas

Quando você usa o Account Kit com Gas Policy ID configurado:

1. **Usuário faz uma transação** (ex: entrar em desafio)
2. **Gas Manager intercepta** a transação
3. **Protocolo paga o gas** (não o usuário)
4. **Transação é executada** normalmente

---

## 💰 Custos

### Quem Paga?

- **Gas Policy ID configurado**: Protocolo (você) paga
- **Sem Gas Policy ID**: Usuários pagam suas próprias gas fees

### Limites

Você define limites na política do Alchemy:
- **Limite por transação**: Ex: máximo $0.10 por transação
- **Limite diário**: Ex: máximo $100/dia
- **Limite mensal**: Ex: máximo $1.000/mês

---

## 🎯 Casos de Uso

### Para WOD [X] PRO

1. **Login Social**: Usuário cria wallet sem pagar gas
2. **Entrar em Desafio**: Usuário não paga gas ao entrar
3. **Submeter Prova**: Upload de CID on-chain sem custo
4. **Validar**: Validadores podem validar sem custo

### Sem Gas Manager

- Usuários precisam ter MATIC/Polygon native token
- Experiência similar a qualquer dApp tradicional
- Barreira de entrada maior

---

## ⚠️ Importante

### Desenvolvimento
- Gas Manager pode ter **limites de teste**
- Teste com valores pequenos primeiro
- Verifique custos no dashboard da Alchemy

### Produção
- Configure limites adequados
- Monitore gastos regularmente
- Considere rate limiting por usuário

---

## 📝 Checklist

- [ ] Gas Policy ID configurado no `.env`
- [ ] `lib/alchemyAccountKit.ts` usando o Policy ID
- [ ] Testado em ambiente de desenvolvimento
- [ ] Limites configurados no Alchemy Dashboard
- [ ] Monitoramento de custos ativo

---

## 🔗 Referências

- [Alchemy Gas Manager Docs](https://docs.alchemy.com/docs/gas-manager)
- [Alchemy Account Kit Docs](https://docs.alchemy.com/docs/account-abstraction)
- [Dashboard Alchemy](https://dashboard.alchemy.com/)

---

*Última atualização: Novembro 2024*

