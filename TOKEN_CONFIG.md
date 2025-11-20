# Token Configuration - WOD X PRO

```yaml
token:
  name: "WOD X PRO"
  symbol: "WOD"
  decimals: 18
  total_supply: 0  # Supply inicial = 0 (mint progressivo)
  max_supply: 1000000000  # 1 bilhão de tokens (hard cap)
  standard: "ERC20"

  # Contract Addresses
  contracts:
    main: "0x888476eA56322CFd5D08DFf8F247b1ab6bd6bB3e"  # Polygon Mainnet
    arena: "0x9B2A87D4C28FA8aBEB14dE889764F66D54b775EE"
    validator_registry: "0xC802ceb791831949504E8CE5982F6D9625eA6cC1"
    
    # Testnet (Amoy)
    testnet:
      main: "0xA6081E450193a9184D9C7dDC9152d8b0aFBD7b8d"
      arena: "0xfdFDB88617F39C2FC0ca31d6f4847E6c0D9513cf"
      validator_registry: "0x3470Ef533399CEAEc3E76B3C0E909aC27b338BA9"

  # Network Information
  network:
    name: "Polygon Mainnet"
    chain_id: 137
    status: "unverified"  # ⚠️ OBSERVAÇÃO: Contratos deployados mas não verificados no Polygonscan
    # Verificação manual necessária devido a problemas com API V2 do Etherscan
    # Ver: wod-x-pro/VERIFICACAO_MANUAL_POLYGONSCAN.md

  # Metadata
  metadata:
    logo: "https://..."  # ⚠️ OBSERVAÇÃO: Logo não configurado ainda
    website: "https://wodx.pro"  # Domain planejado
    domain_ens: "wod.eth"  # Domain ENS planejado
    description: "Protocolo Descentralizado de Performance Atlética - Transforma desempenho físico em valor digital permanente e auditável através de blockchain"

# Project Status
project_status:
  contracts: "complete"  # ✅ Contratos deployados na Polygon Mainnet
  tests: "passing"  # ✅ 4 testes passando (Arena.test.ts)
  frontend: "in_progress"  # ⚠️ Build falhando (problema com WagmiProvider no Next.js)
  verification: "pending"  # ⚠️ Contratos não verificados no Polygonscan

# Tokenomics
tokenomics:
  max_supply: 1000000000  # 1 bilhão WOD (hard cap)
  distribution:
    treasury: "30% (300M WOD)"
    challenge_rewards: "25% (250M WOD) - Mint progressivo via Arena"
    founders: "15% (150M WOD) - Vesting 12 meses (off-chain)"
    partners: "10% (100M WOD) - Vesting 6 meses cliff (off-chain)"
    liquidity: "10% (100M WOD) - Pool Uniswap"
    dao: "10% (100M WOD) - Governança DAO"
  
  # ⚠️ OBSERVAÇÃO: Distribuição inicial ainda não executada
  # Ver: WODToken_Initial_Distribution.json
  # Script: wod-x-pro/scripts/initialDistribution.ts

# Pending Tasks
pending_tasks:
  - "Verificar contratos no Polygonscan (verificação manual necessária)"
  - "Executar distribuição inicial de tokens via Safe multisig"
  - "Conceder MINTER_ROLE à Arena para permitir mint de recompensas"
  - "Criar pool de liquidez no Uniswap (10% = 100M WOD)"
  - "Configurar logo do token (IPFS ou URL)"
  - "Atualizar metadata no Polygonscan (logo, website, descrição)"
  - "Corrigir build do frontend (problema com WagmiProvider)"
  - "Adicionar a CoinGecko (requer verificação e liquidez mínima)"
  - "Adicionar a CoinMarketCap (requer verificação e liquidez mínima)"
  - "Configurar domínios ENS (wod.eth) e website (wodx.pro)"

# Repository
repository:
  url: "https://github.com/kauntdewn1/wod-eth"
  main_contracts: "contracts/contracts/WODToken.sol"
  production_contracts: "wod-x-pro/contracts/WODToken.sol"

# Deployment Info
deployment:
  date: "2025-11-12T04:00:43.933Z"
  network: "Polygon Mainnet"
  deployer: "0x86485aA077F61909f15Fc8A5A1ba3167562C9A54"
  safe_multisig: "0xcd38CD02A7d04c283330162359C9c8E597Ed5068"
  compiler_version: "v0.8.20"
  license: "MIT"

# Security & Governance
security:
  owner: "Gnosis Safe Multisig (0xcd38CD02A7d04c283330162359C9c8E597Ed5068)"
  roles:
    MINTER_ROLE: "Safe multisig (e opcionalmente Arena.sol)"
    PAUSER_ROLE: "Safe multisig"
    DEFAULT_ADMIN_ROLE: "Safe multisig"
  features:
    - "Pausabilidade (emergência)"
    - "Burn público permitido"
    - "Max supply hard cap (1B WOD)"
    - "Mint controlado por roles"
```

