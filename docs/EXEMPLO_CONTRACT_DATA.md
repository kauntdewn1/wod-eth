# Exemplo: Package @wodxpro/contract-data

## Estrutura do Package

```
wod-protocol/
├── package.json          # Configuração do package
├── src/
│   └── index.ts         # Helper functions (TypeScript source)
├── dist/                # Transpiled output (gerado)
│   ├── index.js         # ESM
│   ├── index.cjs        # CommonJS
│   └── index.d.ts       # Type definitions
├── abis/                # ABIs gerados
│   ├── Arena.json
│   ├── WODToken.json
│   └── ValidatorRegistry.json
├── addresses/           # Endereços por chain
│   ├── amoy.json
│   ├── polygon.json
│   └── mumbai.json
└── scripts/             # Build scripts
    ├── extract-abis.js
    └── update-addresses.js
```

## package.json

```json
{
  "name": "@wodxpro/contract-data",
  "version": "1.0.0",
  "description": "ABIs and addresses for WOD Protocol smart contracts",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "abis/**/*",
    "addresses/**/*",
    "dist/**/*"
  ],
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./abis/*": "./abis/*.json",
    "./addresses/*": "./addresses/*.json"
  },
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "build": "npm run extract-abis && npm run update-addresses && npm run compile",
    "compile": "tsup src/index.ts --format cjs,esm --dts --out-dir dist",
    "extract-abis": "node scripts/extract-abis.js",
    "update-addresses": "node scripts/update-addresses.js",
    "prepublishOnly": "npm run build"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tsup": "^8.0.0"
  }
}
```

## src/index.ts

```typescript
/**
 * @wodxpro/contract-data
 * Helper functions to get contract ABIs and addresses
 */

export interface ContractData {
  abi: any[];
  address: string;
  chainName: ChainName;
}

export type ContractName = 'Arena' | 'WODToken' | 'ValidatorRegistry';
export type ChainName = 'amoy' | 'polygon' | 'mumbai';

// Chain ID mapping
const CHAIN_IDS: Record<number, ChainName> = {
  80002: 'amoy',
  137: 'polygon',
  80001: 'mumbai',
};

const CHAIN_NAMES: Record<ChainName, number> = {
  amoy: 80002,
  polygon: 137,
  mumbai: 80001,
};

/**
 * Get contract data (ABI + address) for a specific contract and chain
 * Uses dynamic imports for better compatibility with modern bundlers
 */
export async function getContractData(
  contractName: ContractName,
  chainId: number
): Promise<ContractData> {
  const chainName = getChainName(chainId);
  
  // Dynamic imports for ESM compatibility (Next.js, Vite, Edge Functions)
  const abiModule = await import(`./abis/${contractName}.json`);
  const addressesModule = await import(`./addresses/${chainName}.json`);
  
  const abi = abiModule.default || abiModule;
  const addresses = addressesModule.default || addressesModule;
  const address = addresses[contractName];
  
  if (!address) {
    throw new Error(
      `Contract ${contractName} not found for chain ${chainName} (${chainId})`
    );
  }
  
  return {
    abi,
    address,
    chainName,
  };
}

/**
 * Synchronous version (for environments that support require)
 * @deprecated Use getContractData() async version instead
 */
export function getContractDataSync(
  contractName: ContractName,
  chainId: number
): ContractData {
  const chainName = getChainName(chainId);
  
  // Fallback for Node.js environments
  if (typeof require !== 'undefined') {
    const abi = require(`./abis/${contractName}.json`);
    const addresses = require(`./addresses/${chainName}.json`);
    const address = addresses[contractName];
    
    if (!address) {
      throw new Error(
        `Contract ${contractName} not found for chain ${chainName} (${chainId})`
      );
    }
    
    return { abi, address, chainName };
  }
  
  throw new Error('Synchronous version requires Node.js require()');
}

/**
 * Get contract ABI only
 */
export async function getContractABI(contractName: ContractName): Promise<any[]> {
  const abiModule = await import(`./abis/${contractName}.json`);
  return abiModule.default || abiModule;
}

/**
 * Get contract address only
 */
export async function getContractAddress(
  contractName: ContractName,
  chainId: number
): Promise<string> {
  const chainName = getChainName(chainId);
  const addressesModule = await import(`./addresses/${chainName}.json`);
  const addresses = addressesModule.default || addressesModule;
  return addresses[contractName];
}

/**
 * Get all contract addresses for a chain
 */
export async function getAllAddresses(chainId: number): Promise<Record<ContractName, string>> {
  const chainName = getChainName(chainId);
  const addressesModule = await import(`./addresses/${chainName}.json`);
  return addressesModule.default || addressesModule;
}

/**
 * Get chain name from chain ID
 */
export function getChainName(chainId: number): ChainName {
  const chainName = CHAIN_IDS[chainId];
  if (!chainName) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return chainName;
}

/**
 * Get chain ID from chain name
 */
export function getChainId(chainName: ChainName): number {
  return CHAIN_NAMES[chainName];
}

/**
 * Check if chain is supported
 */
export function isChainSupported(chainId: number): boolean {
  return chainId in CHAIN_IDS;
}
```

## addresses/amoy.json

```json
{
  "Arena": "0x1234567890123456789012345678901234567890",
  "WODToken": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  "ValidatorRegistry": "0xfedcbafedcbafedcbafedcbafedcbafedcbafedc"
}
```

## addresses/polygon.json

```json
{
  "Arena": "0x0000000000000000000000000000000000000000",
  "WODToken": "0x0000000000000000000000000000000000000000",
  "ValidatorRegistry": "0x0000000000000000000000000000000000000000"
}
```

## Uso no Frontend

```typescript
// lib/contractData.ts
import { getContractData, getContractABI, getContractAddress } from '@wodxpro/contract-data';
import { useReadContract, useWriteContract } from 'wagmi';
import { useEffect, useState } from 'react';

const CHAIN_ID = 80002; // Amoy

// Exemplo 1: Usar helper completo (async)
export function useArena() {
  const [contractData, setContractData] = useState<{ abi: any[]; address: string } | null>(null);
  
  useEffect(() => {
    getContractData('Arena', CHAIN_ID).then(data => {
      setContractData({ abi: data.abi, address: data.address });
    });
  }, []);
  
  const { data } = useReadContract({
    address: contractData?.address as `0x${string}`,
    abi: contractData?.abi,
    functionName: 'getChallenge',
    args: [BigInt(1)],
    query: {
      enabled: !!contractData,
    },
  });
  
  return { data };
}

// Exemplo 1b: Hook otimizado com cache
export function useContractData(contractName: ContractName, chainId: number) {
  const [data, setData] = useState<ContractData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getContractData(contractName, chainId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [contractName, chainId]);
  
  return { data, loading };
}

// Exemplo 2: Usar apenas ABI (se address vem de env)
export function useWODToken() {
  const abi = getContractABI('WODToken');
  const address = process.env.NEXT_PUBLIC_WOD_TOKEN_ADDRESS as `0x${string}`;
  
  const { data: balance } = useReadContract({
    address,
    abi,
    functionName: 'balanceOf',
    args: [userAddress],
  });
  
  return { balance };
}

// Exemplo 3: Verificar se chain é suportada
import { isChainSupported, getChainName } from '@wodxpro/contract-data';

if (!isChainSupported(chainId)) {
  throw new Error(`Chain ${chainId} not supported`);
}

const chainName = getChainName(chainId);
console.log(`Using ${chainName} network`);
```

## Scripts de Build

### scripts/extract-abis.js

```javascript
const fs = require('fs');
const path = require('path');

const artifactsDir = path.join(__dirname, '../artifacts/contracts');
const abisDir = path.join(__dirname, '../abis');

// Criar diretório abis se não existir
if (!fs.existsSync(abisDir)) {
  fs.mkdirSync(abisDir, { recursive: true });
}

const contracts = ['Arena', 'WODToken', 'ValidatorRegistry'];

contracts.forEach(contract => {
  const artifactPath = path.join(artifactsDir, `${contract}.sol`, `${contract}.json`);
  const abiPath = path.join(abisDir, `${contract}.json`);
  
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
    console.log(`✅ Extracted ABI for ${contract}`);
  } else {
    console.warn(`⚠️  Artifact not found for ${contract}`);
  }
});
```

### scripts/update-addresses.js

```javascript
const fs = require('fs');
const path = require('path');

const addressesDir = path.join(__dirname, '../addresses');

// Criar diretório se não existir
if (!fs.existsSync(addressesDir)) {
  fs.mkdirSync(addressesDir, { recursive: true });
}

// Template para novos endereços
const template = {
  Arena: process.env.ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
  WODToken: process.env.WOD_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
  ValidatorRegistry: process.env.VALIDATOR_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000',
};

// Atualizar endereços por chain
const chains = ['amoy', 'polygon', 'mumbai'];

chains.forEach(chain => {
  const filePath = path.join(addressesDir, `${chain}.json`);
  
  // Se arquivo existe, preservar endereços existentes
  let addresses = template;
  if (fs.existsSync(filePath)) {
    addresses = { ...template, ...JSON.parse(fs.readFileSync(filePath, 'utf8')) };
  }
  
  fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));
  console.log(`✅ Updated addresses for ${chain}`);
});
```

## CI/CD Integration

```yaml
# .github/workflows/publish-contract-data.yml
name: Publish Contract Data

on:
  release:
    types: [published]
  workflow_dispatch:

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Compile contracts
        run: npm run compile
      
      - name: Extract ABIs
        run: npm run extract-abis
      
      - name: Update addresses from deployment
        env:
          ARENA_ADDRESS: ${{ secrets.ARENA_ADDRESS_AMOY }}
          WOD_TOKEN_ADDRESS: ${{ secrets.WOD_TOKEN_ADDRESS_AMOY }}
          VALIDATOR_REGISTRY_ADDRESS: ${{ secrets.VALIDATOR_REGISTRY_ADDRESS_AMOY }}
        run: npm run update-addresses
      
      - name: Set version from tag
        run: |
          VERSION=${GITHUB_REF#refs/tags/v}
          npm version $VERSION --no-git-tag-version
        env:
          GITHUB_REF: ${{ github.ref }}
      
      - name: Build package
        run: npm run build
      
      - name: Publish to npm
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 🔥 SDK Opcional: @wodxpro/sdk

Transformar `@wodxpro/contract-data` em um SDK completo com helpers para viem/wagmi:

```typescript
// @wodxpro/sdk/index.ts
import { getContractData, ContractName } from '@wodxpro/contract-data';
import { createPublicClient, http, PublicClient } from 'viem';
import { polygonAmoy, polygon } from 'viem/chains';

const CHAIN_CONFIG: Record<number, any> = {
  80002: polygonAmoy,
  137: polygon,
};

export interface ContractClient {
  read: (functionName: string, args: any[]) => Promise<any>;
  write: (functionName: string, args: any[]) => Promise<any>;
  address: string;
  abi: any[];
}

export async function getContractClient(
  contractName: ContractName,
  chainId: number,
  rpcUrl?: string
): Promise<ContractClient> {
  const { abi, address } = await getContractData(contractName, chainId);
  const chain = CHAIN_CONFIG[chainId];
  
  if (!chain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  
  const client = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
  
  return {
    read: async (functionName: string, args: any[]) => {
      return client.readContract({
        address: address as `0x${string}`,
        abi,
        functionName,
        args,
      });
    },
    write: async (functionName: string, args: any[]) => {
      // Para write, precisa de wallet client
      throw new Error('Use wallet client for write operations');
    },
    address,
    abi,
  };
}

// Hook para React
export function useContractClient(contractName: ContractName, chainId: number) {
  const [client, setClient] = useState<ContractClient | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getContractClient(contractName, chainId)
      .then(setClient)
      .finally(() => setLoading(false));
  }, [contractName, chainId]);
  
  return { client, loading };
}
```

**Uso:**
```typescript
import { getContractClient } from '@wodxpro/sdk';

const arena = await getContractClient('Arena', 80002);
const challenge = await arena.read('getChallenge', [BigInt(1)]);
```

---

**Última atualização:** Dezembro 2024

