/**
 * Contract Data Helper
 * 
 * Wrapper around @wodxpro/contract-data for use in React hooks
 */

import { getContractData, getContractABI, getContractAddress, ContractName } from '@wodxpro/contract-data';

const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '80002', 10);

/**
 * Get contract data for a specific contract
 */
export async function getContractDataForChain(contractName: ContractName) {
  return getContractData(contractName, CHAIN_ID);
}

/**
 * Get contract ABI
 */
export async function getContractABIForChain(contractName: ContractName) {
  return getContractABI(contractName);
}

/**
 * Get contract address
 */
export async function getContractAddressForChain(contractName: ContractName) {
  return getContractAddress(contractName, CHAIN_ID);
}

/**
 * Get current chain ID
 */
export function getChainId(): number {
  return CHAIN_ID;
}

