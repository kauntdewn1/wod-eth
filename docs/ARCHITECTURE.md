# Arquitetura WODX Protocol

## Visão Geral

O WODX é um protocolo descentralizado que transforma desempenho físico em valor digital perpétuo através de blockchain. Toda a lógica de negócio roda on-chain, eliminando a necessidade de bancos de dados tradicionais.

## A Stack de Soberania

### 1. Alchemy Account Kit (Login & Wallet)

- **Propósito**: Eliminar fricção de entrada com login social
- **Tecnologia**: Smart Contract Wallets (Account Abstraction)
- **Experiência**: Atleta loga com Google/e-mail, recebe wallet automaticamente
- **Benefício**: 100% de posse sem necessidade de gerenciar chaves privadas

### 2. Lighthouse.storage (Armazenamento Perpétuo)

- **Propósito**: Armazenar provas de esforço (vídeos) de forma permanente
- **Tecnologia**: IPFS + Filecoin
- **Experiência**: Upload de vídeo retorna CID que é registrado on-chain
- **Benefício**: Prova de desempenho sobrevive à própria plataforma

### 3. Alchemy Pay (On-Ramp PIX)

- **Propósito**: Permitir compra de $WOD com PIX
- **Tecnologia**: Fiat on-ramp
- **Experiência**: Clique em "Comprar $WOD", paga com PIX, tokens depositados na wallet
- **Benefício**: Acesso ao protocolo sem conhecimento de cripto

### 4. Smart Contracts (Polygon)

- **Propósito**: Lógica de negócio 100% on-chain
- **Tecnologia**: Solidity, Polygon L2
- **Contratos**:
  - `WODToken.sol`: Token ERC20 do protocolo
  - `ValidatorRegistry.sol`: Registro de validadores com stake
  - `Arena.sol`: Lógica de desafios, submissões e distribuição

## Fluxo de Operação - Fase 1: A Arena

### 1. Criação de Desafio
```
Admin → Arena.createChallenge()
→ Novo desafio criado on-chain
→ Taxa de entrada e período definidos
```

### 2. Entrada do Atleta
```
Atleta → Arena.enterChallenge(challengeId)
→ WODToken.transferFrom(atleta → Arena, entryFee)
→ Entry fee acumula no prize pool
→ Atleta adicionado à lista de participantes
```

### 3. Submissão de Prova
```
Atleta → Upload vídeo → Lighthouse.storage
→ Recebe CID (hash IPFS)
→ Arena.submitProof(challengeId, CID)
→ CID registrado on-chain vinculado ao atleta
```

### 4. Validação
```
Validadores (com stake) → Arena.vote(challengeId, athlete, approved)
→ Votos registrados on-chain
→ Consenso calculado (51% dos validadores devem aprovar)
```

### 5. Resolução e Distribuição
```
Após deadline → Arena.resolveChallenge(challengeId)
→ Contrato calcula vencedores baseado em consenso
→ WODToken.transfer(vencedor, prizePerWinner)
→ Distribuição automática e transparente
```

## Fluxo de Operação - Fase 2: O Mercado (Futuro)

### 1. Criação de Evento
```
Admin → Market.createEvent(eventId, participants)
→ Contrato de evento criado
→ Pool de apostas inicializada
```

### 2. Investimento (Aposta)
```
Espectador → Market.placeBet(eventId, outcome, amount)
→ WODToken.transferFrom(espectador → Market, amount)
→ Posição registrada on-chain
→ Liquidez acumulada no pool
```

### 3. Resolução via Oráculo
```
IA Validadora → Oracle.submitResult(eventId, winner)
→ Resultado publicado on-chain
→ Market.resolveEvent(eventId)
→ Distribuição automática baseada em odds
```

## Meta-Transactions e Gasless UX

Para eliminar fricção, o protocolo usa:

1. **Alchemy Account Abstraction**: Permite assinar transações sem gerenciar chaves
2. **Meta-Transactions**: Protocolo pode subsidiar gas inicialmente
3. **Batch Transactions**: Múltiplas ações em uma única transação

## Segurança e Descentralização

- **Zero Trust**: Nenhuma ação requer confiança em servidor central
- **Transparência**: Todas as regras estão no código dos contratos
- **Auditabilidade**: Qualquer pessoa pode verificar lógica e histórico
- **Imutabilidade**: Regras não podem ser alteradas sem consenso

## Custos Operacionais

- **Gas Subsidy**: Custo inicial para subsidiar transações de usuários
- **Lighthouse Storage**: Custo por upload (já pago pelo protocolo)
- **Oracle Fees**: Custo de oráculo para Fase 2

## Próximos Passos

1. ✅ Estrutura base do projeto
2. ✅ Smart contracts principais
3. ⏳ Integração completa Alchemy Account Kit
4. ⏳ Integração On-Ramp PIX
5. ⏳ Dashboard de validadores
6. ⏳ Sistema de oráculo para Fase 2

