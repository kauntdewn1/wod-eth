# Arquitetura: Treinos vs Desafios

## O Problema

❓ **"Se é blockchain e IPFS, todo dia que tiver treino eu vou ter que atualizar?"**

## A Resposta: NÃO! 🎯

O WODX opera em **dois níveis diferentes**:

---

## 🏟️ **NÍVEL 1: A ARENA (On-Chain)**

### Quando usar?

- **Desafios competitivos** com entry fee e prize pool
- **Eventos de mineração de $WOD** (performance validada)
- **Competições oficiais** do protocolo

### Fluxo On-Chain:

1. Atleta **paga entrada** ($WOD) → **Transação on-chain**
2. Atleta **submete prova** (vídeo) → **CID registrado on-chain**
3. Validadores **votam** → **Votos on-chain**
4. **Distribuição automática** → **Transfer on-chain**

### Custo: Gas fees (mas só em DESAFIOS, não em treinos diários)

---

## 📝 **NÍVEL 2: TRAINING LOG (Off-Chain → Sync On-Demand)**

### Quando usar?

- **Treinos diários** pessoais
- **Histórico de performance**
- **Tracking progressivo**

### Fluxo Híbrido:

1. **Treino diário** → Armazenado **off-chain** (Lighthouse IPFS, mas sem registro on-chain)
2. **App guarda** histórico local + CIDs dos vídeos
3. **Sync on-chain opcional** apenas quando:
   - Atleta participa de um desafio
   - Atleta quer "certificar" um período de treinos
   - Batch update semanal/mensal (uma transação para múltiplos treinos)

### Benefícios:

- ✅ **Zero custo de gas** para treinos diários
- ✅ **Histórico completo** no IPFS (permanente)
- ✅ **Sync seletivo** apenas quando necessário
- ✅ **UX fluida** (não precisa esperar transação a cada treino)

---

## Arquitetura Proposta

```
┌─────────────────────────────────────┐
│     TREINO DIÁRIO (Off-Chain)       │
├─────────────────────────────────────┤
│ 1. Atleta completa treino           │
│ 2. Upload vídeo → Lighthouse IPFS   │
│ 3. CID armazenado localmente        │
│ 4. Histórico no app (sem blockchain)│
└─────────────────────────────────────┘
                │
                │ Quando participa de DESAFIO
                ▼
┌─────────────────────────────────────┐
│   DESAFIO ARENA (On-Chain)          │
├─────────────────────────────────────┤
│ 1. Atleta entra no desafio          │
│ 2. Paga entry fee (on-chain)        │
│ 3. Submete prova (CID on-chain)     │
│ 4. Validação e distribuição (on-chain)│
└─────────────────────────────────────┘
```

---

## Implementação: Training Log Service

### Opção 1: Completamente Off-Chain

- Vídeos vão para Lighthouse (IPFS permanente)
- CIDs ficam em banco local do app
- Zero interação com blockchain até participar de desafio

### Opção 2: Batch Sync Semanal

- Treinos acumulados durante a semana
- **Uma única transação** no final da semana
- Contrato `TrainingLog.sol` registra múltiplos CIDs de uma vez

### Opção 3: Sync On-Demand

- Atleta escolhe quais treinos quer "certificar"
- Sync apenas quando necessário (ex: antes de participar de desafio importante)

---

## Exemplo de Uso

### Cenário: Treino Diário

```
Segunda-feira:
- Atleta treina → Vídeo vai para IPFS
- CID: QmABC123...
- App guarda localmente
- Custo: R$ 0 (sem transação blockchain)

Terça-feira:
- Mesmo processo
- CID: QmXYZ789...
- Custo: R$ 0

...

Domingo:
- Atleta quer participar do "Desafio Arena #5"
- Escolhe qual treino usar como prova
- Apenas NESSE momento faz transação on-chain
- Custo: Gas fee (subsidiado ou ~$0.01)
```

---

## Vantagens Desta Arquitetura

1. **UX Perfeita**: Treino diário = zero fricção
2. **Custo Zero**: Sem gas fees para treinos normais
3. **Histórico Permanente**: IPFS garante que nada se perde
4. **Flexibilidade**: Sync quando fizer sentido
5. **Desafios Relevantes**: On-chain só para eventos com valor ($WOD)

---

## Conclusão

**Você NÃO precisa atualizar a blockchain todo dia.**

- 🏃 **Treinos diários** = Off-chain (IPFS + app local)
- 🏟️ **Desafios competitivos** = On-chain (quando há valor em jogo)

O WODX é sobre **certificar performance quando importa**, não sobre **toda sessão de treino**.

