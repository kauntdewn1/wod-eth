# 🥇 WOD X PRO - Arena & ValidatorRegistry

Este repositório contém os contratos responsáveis pela dinâmica principal de validação de esforço físico e recompensa com o token $WOD no ecossistema **WOD X PRO**.

---

## 🏟️ Arena.sol

### Função
Gerencia desafios, submissões, votos de validadores e distribuição de recompensas para atletas e validadores.

### Funcionalidades
- Criação de desafios com taxa de entrada em $WOD
- Participação de atletas
- Submissão de provas (CID/IPFS)
- Votação por validadores (Rep / No-Rep)
- Resolução de desafios baseada em consenso (>51%)
- Distribuição automática de prêmios e recompensas

### Eventos
- `ChallengeCreated`
- `ChallengeEntered`
- `SubmissionSubmitted`
- `VoteCast`
- `ChallengeResolved`

### Lógica de Prêmios
- **Entry Fee:** vai para o prize pool
- **10%:** reservado para validadores
- **90%:** distribuído entre vencedores

---

## 🛡️ ValidatorRegistry.sol

### Função
Registro de validadores com sistema de staking.

### Requisitos
- Stake mínimo (definido pelo owner)
- Registro com WOD via `transferFrom`
- Atualização de stake
- Desregistro com retorno do stake

### Funcionalidades
- Verificação de validadores ativos
- Contagem de validadores
- Acesso a lista de validadores ativos

### Eventos
- `ValidatorRegistered`
- `StakeUpdated`
- `ValidatorUnregistered`

---

## 🧠 Lógica de Validação

- Votação é registrada e hash armazenado para evitar duplicidade
- Votos acumulados na submissão (eficiência de gás)
- Para ser vencedor, atleta precisa de ≥51% de aprovação do total de validadores

---

## 🔐 Controle de Acesso

### Arena
- `onlyOwner` → Criação de desafios
- `ValidatorRegistry` → Verifica permissões

### ValidatorRegistry
- `onlyOwner` → Atualizar stake mínimo
- `msg.sender` → Stake, registro e remoção

---

## 🧪 Testes Recomendados

- ✅ Criação de desafio
- ✅ Entrada de atletas
- ✅ Submissão de provas
- ✅ Votação de validadores
- ✅ Resolução e distribuição de prêmios
- ✅ Registro e saída de validadores
- ✅ Casos de empate, ausência de votos, spam

---

## 📆 Última atualização
12/11/2025

---

Para deploy e integração com o token $WOD, certifique-se de:
- Conceder `MINTER_ROLE` para o contrato Arena
- Testar integração completa em testnet
- Auditar toda lógica de consenso e distribuição

---

🔗 Desenvolvido para o ecossistema **WOD X PRO**
