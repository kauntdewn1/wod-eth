# Análise Completa dos Contratos - WOD [X] PRO

**Domain**: `wod.eth` | **Token**: `WOD`

Este documento explica **exatamente** o que cada contrato faz, suas funções, e o que acontece durante o deploy.

---

## 📋 Resumo Executivo

São deployados **3 contratos** que trabalham juntos:

1. **WODToken** - Token ERC20 ($WOD)
2. **ValidatorRegistry** - Registro de validadores com stake
3. **Arena** - Contrato principal de desafios e mineração

---

## 🪙 Contrato 1: WODToken

### O Que É

Token ERC20 padrão do protocolo. Representa a moeda de valor do WOD [X] PRO.

### Funções Principais

#### 1. **Constructor**
```solidity
constructor(address initialOwner)
```
- **O que faz**: Cria o token com nome "WOD X PRO" e símbolo "WOD"
- **Quem é owner**: Endereço que fez o deploy (deployer)
- **Supply inicial**: 0 (token não tem supply pré-minteado)

#### 2. **mint(address to, uint256 amount)**
```solidity
function mint(address to, uint256 amount) external onlyOwner
```
- **O que faz**: Cria novos tokens e envia para um endereço
- **Quem pode**: Apenas o owner (deployer)
- **Uso**: 
  - On-ramp (Alchemy Pay): quando usuário compra $WOD com PIX
  - Distribuição inicial
  - Recompensas

#### 3. **burn(uint256 amount)**
```solidity
function burn(uint256 amount) external
```
- **O que faz**: Queima tokens do próprio endereço
- **Quem pode**: Qualquer um (pode queimar seus próprios tokens)
- **Uso**: Redução de supply, se necessário

### Segurança

- ✅ Usa OpenZeppelin (padrão da indústria)
- ✅ `onlyOwner` no mint (apenas owner pode criar tokens)
- ✅ Qualquer um pode queimar seus próprios tokens

### O Que Acontece no Deploy

1. Token é criado com nome "WOD X PRO" e símbolo "WOD"
2. Deployer vira owner
3. Supply inicial = 0
4. Owner pode mint tokens quando necessário

---

## 🛡️ Contrato 2: ValidatorRegistry

### O Que É

Registra validadores que fazem stake de $WOD para validar performances. Garante que apenas validadores comprometidos (com stake) podem votar.

### Funções Principais

#### 1. **Constructor**
```solidity
constructor(address _wodToken, address initialOwner, uint256 _minStakeAmount)
```
- **O que faz**: 
  - Conecta ao WODToken
  - Define stake mínimo (1000 WOD no deploy)
  - Define owner
- **Parâmetros no deploy**:
  - `_wodToken`: Endereço do WODToken
  - `initialOwner`: Deployer
  - `_minStakeAmount`: 1000 WOD (1000 * 10^18)

#### 2. **registerValidator(uint256 stakeAmount)**
```solidity
function registerValidator(uint256 stakeAmount) external nonReentrant
```
- **O que faz**: 
  - Registra um novo validador
  - Transfere $WOD do validador para o contrato (stake)
  - Adiciona à lista de validadores
- **Requisitos**:
  - `stakeAmount >= minStakeAmount` (mínimo 1000 WOD)
  - Não pode estar já registrado
  - Deve ter aprovação prévia do WODToken
- **O que acontece**:
  1. Validador aprova WODToken para o ValidatorRegistry
  2. Chama `registerValidator(amount)`
  3. Tokens são transferidos para o contrato
  4. Validador é marcado como ativo
  5. Evento `ValidatorRegistered` é emitido

#### 3. **updateStake(uint256 additionalStake)**
```solidity
function updateStake(uint256 additionalStake) external nonReentrant
```
- **O que faz**: Aumenta o stake de um validador
- **Uso**: Validador quer aumentar seu comprometimento

#### 4. **unregisterValidator()**
```solidity
function unregisterValidator() external nonReentrant
```
- **O que faz**: 
  - Remove validador
  - Retorna todo o stake
  - Remove da lista
- **O que acontece**:
  1. Stake é devolvido ao validador
  2. Validador é marcado como inativo
  3. Removido da lista de validadores ativos

#### 5. **isValidator(address validator)**
```solidity
function isValidator(address validator) external view returns (bool)
```
- **O que faz**: Verifica se um endereço é validador ativo
- **Uso**: Arena usa isso para verificar se pode votar

#### 6. **getValidatorCount()**
```solidity
function getValidatorCount() external view returns (uint256)
```
- **O que faz**: Retorna número de validadores ativos
- **Uso**: Arena usa para calcular consenso

#### 7. **getValidators()**
```solidity
function getValidators() external view returns (address[] memory)
```
- **O que faz**: Retorna lista de endereços de validadores ativos
- **Uso**: Arena usa para iterar sobre validadores

#### 8. **setMinStakeAmount(uint256 _minStakeAmount)**
```solidity
function setMinStakeAmount(uint256 _minStakeAmount) external onlyOwner
```
- **O que faz**: Atualiza stake mínimo (apenas owner)
- **Uso**: Ajustar barreira de entrada

### Estrutura de Dados

```solidity
struct Validator {
    address validatorAddress;  // Endereço do validador
    uint256 stakeAmount;       // Quanto de $WOD está em stake
    uint256 registeredAt;      // Timestamp do registro
    bool isActive;             // Se está ativo
}
```

### Segurança

- ✅ `nonReentrant` (previne reentrância)
- ✅ Verifica stake mínimo
- ✅ Verifica se já está registrado
- ✅ Apenas owner pode mudar `minStakeAmount`

### O Que Acontece no Deploy

1. Contrato é criado
2. Conectado ao WODToken
3. Stake mínimo = 1000 WOD
4. Deployer vira owner
5. Lista de validadores vazia (nenhum validador inicial)

---

## 🏟️ Contrato 3: Arena

### O Que É

Contrato principal que gerencia desafios, submissões, votação e distribuição de prêmios. É o "coração" do protocolo.

### Funções Principais

#### 1. **Constructor**
```solidity
constructor(address _wodToken, address _validatorRegistry, address initialOwner)
```
- **O que faz**: 
  - Conecta ao WODToken
  - Conecta ao ValidatorRegistry
  - Define owner
- **Constantes**:
  - `VALIDATION_DEADLINE = 7 days` (7 dias para validar após fim do desafio)
  - `MIN_CONSENSUS_PERCENT = 51` (51% dos validadores devem aprovar)

#### 2. **createChallenge(...)**
```solidity
function createChallenge(
    string memory name,
    string memory description,
    uint256 entryFee,
    uint256 startTime,
    uint256 endTime
) external onlyOwner returns (uint256)
```
- **O que faz**: Cria um novo desafio
- **Quem pode**: Apenas owner
- **Parâmetros**:
  - `name`: Nome do desafio (ex: "100 Burpees em 10min")
  - `description`: Descrição detalhada
  - `entryFee`: Taxa de entrada em $WOD
  - `startTime`: Quando o desafio começa
  - `endTime`: Quando o desafio termina
- **O que acontece**:
  1. Challenge ID é incrementado
  2. Novo challenge é criado
  3. `isActive = true`
  4. Evento `ChallengeCreated` é emitido
- **Exemplo**:
  ```solidity
  createChallenge(
      "100 Burpees Challenge",
      "Complete 100 burpees em 10 minutos",
      ethers.parseEther("100"),  // 100 WOD
      startTime,
      endTime
  )
  ```

#### 3. **enterChallenge(uint256 challengeId)**
```solidity
function enterChallenge(uint256 challengeId) external nonReentrant
```
- **O que faz**: Atleta entra no desafio pagando a taxa
- **Requisitos**:
  - Desafio deve estar ativo
  - Deve estar dentro do período (startTime <= now <= endTime)
  - Não pode ter entrado antes
  - Deve ter aprovação prévia do WODToken
- **O que acontece**:
  1. Taxa de entrada é transferida para o contrato
  2. Taxa é adicionada ao `prizePool`
  3. Atleta é adicionado à lista de participantes
  4. Evento `ChallengeEntered` é emitido

#### 4. **submitProof(uint256 challengeId, string memory proofCID)**
```solidity
function submitProof(uint256 challengeId, string memory proofCID) external
```
- **O que faz**: Atleta submete prova de esforço (CID do IPFS)
- **Requisitos**:
  - Desafio deve estar ativo
  - Deve ter entrado no desafio
  - Deve estar antes do endTime
- **O que acontece**:
  1. CID é armazenado no contrato
  2. Submissão é marcada como existente
  3. Timestamp é registrado
  4. Evento `SubmissionSubmitted` é emitido
- **Exemplo**:
  ```solidity
  submitProof(1, "QmXxxx...")  // CID do vídeo no IPFS
  ```

#### 5. **vote(uint256 challengeId, address athlete, bool approved)**
```solidity
function vote(uint256 challengeId, address athlete, bool approved) external
```
- **O que faz**: Validador vota em uma submissão
- **Quem pode**: Apenas validadores ativos
- **Parâmetros**:
  - `challengeId`: ID do desafio
  - `athlete`: Endereço do atleta
  - `approved`: `true` = Rep (aprovado), `false` = No-Rep (rejeitado)
- **Requisitos**:
  - Desafio deve estar ativo
  - Deve estar dentro do período de validação (endTime + 7 dias)
  - Submissão deve existir
  - Deve ser validador
  - Não pode ter votado antes neste atleta
- **O que acontece**:
  1. Voto é registrado com chave única: `keccak256(challengeId, validator, athlete)`
  2. Timestamp é salvo
  3. Evento `VoteCast` é emitido
- **Exemplo**:
  ```solidity
  vote(1, 0xAtleta..., true)   // Aprova
  vote(1, 0xAtleta..., false)  // Rejeita
  ```

#### 6. **resolveChallenge(uint256 challengeId)**
```solidity
function resolveChallenge(uint256 challengeId) external
```
- **O que faz**: Resolve o desafio e distribui prêmios
- **Quem pode**: Qualquer um (pode ser chamado por qualquer pessoa após deadline)
- **Requisitos**:
  - Desafio deve estar ativo
  - Deve ter passado o deadline de validação (endTime + 7 dias)
- **O que acontece**:
  1. Calcula vencedores baseado em consenso (51% aprovação)
  2. Divide prize pool igualmente entre vencedores
  3. Transfere $WOD para cada vencedor
  4. Marca desafio como inativo
  5. Evento `ChallengeResolved` é emitido

#### 7. **_calculateWinners(uint256 challengeId)** (internal)
```solidity
function _calculateWinners(uint256 challengeId) internal view returns (address[] memory)
```
- **O que faz**: Calcula quem são os vencedores
- **Lógica**:
  1. Para cada participante:
     - Conta votos de aprovação
     - Verifica se >= 51% dos validadores aprovaram
     - Se sim, adiciona à lista de vencedores
  2. Retorna lista de vencedores
- **Consenso**: 51% dos validadores devem aprovar

#### 8. **getChallenge(uint256 challengeId)** (view)
```solidity
function getChallenge(uint256 challengeId) external view returns (...)
```
- **O que faz**: Retorna informações do desafio (sem modificar estado)
- **Retorna**: ID, nome, descrição, entryFee, prizePool, startTime, endTime, isActive, participantCount

#### 9. **getSubmission(uint256 challengeId, address athlete)** (view)
```solidity
function getSubmission(uint256 challengeId, address athlete) external view returns (...)
```
- **O que faz**: Retorna submissão de um atleta
- **Retorna**: Endereço, CID, timestamp, exists

### Estruturas de Dados

```solidity
struct Challenge {
    uint256 id;
    string name;
    string description;
    uint256 entryFee;
    uint256 prizePool;        // Acumula taxas de entrada
    uint256 startTime;
    uint256 endTime;
    bool isActive;
    mapping(address => Submission) submissions;
    address[] participants;
}

struct Submission {
    address athlete;
    string proofCID;          // CID do IPFS
    uint256 timestamp;
    bool exists;
}

struct Vote {
    address validator;
    address athlete;
    bool approved;           // true = Rep, false = No-Rep
    uint256 timestamp;
}
```

### Fluxo Completo de um Desafio

1. **Owner cria desafio**:
   ```
   createChallenge("100 Burpees", "Descrição", 100 WOD, start, end)
   ```

2. **Atletas entram**:
   ```
   Atleta 1: enterChallenge(1) → Paga 100 WOD → Prize Pool = 100 WOD
   Atleta 2: enterChallenge(1) → Paga 100 WOD → Prize Pool = 200 WOD
   Atleta 3: enterChallenge(1) → Paga 100 WOD → Prize Pool = 300 WOD
   ```

3. **Atletas submetem provas**:
   ```
   Atleta 1: submitProof(1, "QmXxx...")
   Atleta 2: submitProof(1, "QmYyy...")
   Atleta 3: submitProof(1, "QmZzz...")
   ```

4. **Validadores votam** (7 dias após endTime):
   ```
   Validador 1: vote(1, Atleta1, true)   ✅ Aprova
   Validador 2: vote(1, Atleta1, true)   ✅ Aprova
   Validador 3: vote(1, Atleta1, false)  ❌ Rejeita
   
   Atleta 1: 2/3 aprovaram = 66.6% → ✅ Vencedor
   ```

5. **Resolver desafio**:
   ```
   resolveChallenge(1)
   → Calcula vencedores (Atleta 1)
   → Distribui 300 WOD para Atleta 1
   ```

### Segurança

- ✅ `nonReentrant` em funções que transferem tokens
- ✅ Verifica se desafio está ativo
- ✅ Verifica períodos de tempo
- ✅ Consenso de 51% (previne manipulação)
- ✅ Apenas owner pode criar desafios
- ✅ Apenas validadores podem votar

### O Que Acontece no Deploy

1. Contrato é criado
2. Conectado ao WODToken
3. Conectado ao ValidatorRegistry
4. Deployer vira owner
5. `challengeCount = 0` (nenhum desafio ainda)

---

## 🔗 Interações Entre Contratos

### WODToken ↔ ValidatorRegistry

```
Usuário → approve(ValidatorRegistry, 1000 WOD)
Usuário → ValidatorRegistry.registerValidator(1000)
         ↓
WODToken.transferFrom(usuário → ValidatorRegistry, 1000)
```

### WODToken ↔ Arena

```
Usuário → approve(Arena, 100 WOD)
Usuário → Arena.enterChallenge(1)
         ↓
WODToken.transferFrom(usuário → Arena, 100)
         ↓
Arena.prizePool += 100
```

### ValidatorRegistry ↔ Arena

```
Arena.vote(...)
  ↓
ValidatorRegistry.isValidator(msg.sender)  // Verifica se é validador
  ↓
ValidatorRegistry.getValidatorCount()     // Para calcular consenso
  ↓
ValidatorRegistry.getValidators()         // Para iterar votos
```

---

## 📊 O Que Acontece no Deploy (Script)

### Ordem de Deploy

1. **WODToken**
   - Deployer vira owner
   - Supply inicial = 0

2. **ValidatorRegistry**
   - Recebe endereço do WODToken
   - Stake mínimo = 1000 WOD
   - Deployer vira owner

3. **Arena**
   - Recebe endereço do WODToken
   - Recebe endereço do ValidatorRegistry
   - Deployer vira owner

### Output do Deploy

```
📋 Deployment Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WODToken: 0x...
ValidatorRegistry: 0x...
Arena: 0x...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Permissões Após Deploy

- **WODToken.owner**: Deployer (pode mint)
- **ValidatorRegistry.owner**: Deployer (pode mudar minStake)
- **Arena.owner**: Deployer (pode criar desafios)

---

## ⚠️ Pontos Importantes

### 1. Supply Inicial = 0

- **WODToken não tem tokens iniciais**
- **Owner precisa mint tokens** para:
  - On-ramp (Alchemy Pay)
  - Distribuição inicial
  - Testes

### 2. Stake Mínimo = 1000 WOD

- **Validadores precisam fazer stake mínimo**
- **No deploy**: 1000 WOD
- **Owner pode mudar** depois se necessário

### 3. Consenso = 51%

- **51% dos validadores devem aprovar**
- **Previne manipulação** se houver muitos validadores
- **Se houver poucos validadores**, pode ser problemático

### 4. Período de Validação = 7 Dias

- **Após endTime do desafio**, validadores têm 7 dias para votar
- **Depois disso**, qualquer um pode chamar `resolveChallenge()`

### 5. Prize Pool = Soma de Entry Fees

- **Cada atleta que entra** adiciona sua taxa ao prize pool
- **100% do pool** é distribuído entre vencedores
- **Protocolo não fica com taxa** (pode ser adicionado depois)

---

## 🧪 Testando Após Deploy

### 1. Mint Tokens Iniciais

```solidity
// Owner faz mint
WODToken.mint(owner, ethers.parseEther("10000"))
```

### 2. Registrar Validador

```solidity
// Validador aprova
WODToken.approve(ValidatorRegistry, ethers.parseEther("1000"))
// Validador registra
ValidatorRegistry.registerValidator(ethers.parseEther("1000"))
```

### 3. Criar Desafio

```solidity
// Owner cria desafio
Arena.createChallenge(
    "100 Burpees",
    "Complete 100 burpees",
    ethers.parseEther("100"),
    startTime,
    endTime
)
```

### 4. Atleta Entra

```solidity
// Atleta aprova
WODToken.approve(Arena, ethers.parseEther("100"))
// Atleta entra
Arena.enterChallenge(1)
```

---

## 📝 Resumo Final

### O Que Cada Contrato Faz

| Contrato | Função Principal | Permissões Especiais |
|----------|------------------|----------------------|
| **WODToken** | Token ERC20 ($WOD) | Owner pode mint |
| **ValidatorRegistry** | Registra validadores com stake | Owner pode mudar minStake |
| **Arena** | Gerencia desafios e prêmios | Owner pode criar desafios |

### Fluxo de Valor

```
Atletas pagam entryFee → Prize Pool → Vencedores recebem prêmios
```

### Segurança

- ✅ OpenZeppelin (padrão da indústria)
- ✅ ReentrancyGuard
- ✅ Consenso de 51%
- ✅ Verificações de tempo
- ✅ Verificações de permissões

---

*Documento criado para análise pré-deploy - Novembro 2024*

