/**
 * Configuração do Alchemy Account Kit
 * 
 * O Gas Policy ID permite subsidiar transações dos usuários,
 * permitindo que eles usem o protocolo sem pagar gas fees.
 */

import { createAccountKit } from '@alchemy/aa-alchemy';
import { polygonMumbai } from 'wagmi/chains';

export function getAccountKit() {
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  const appId = process.env.NEXT_PUBLIC_ALCHEMY_APP_ID;
  const gasPolicyId = process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID;
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '80001');

  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_ALCHEMY_API_KEY não configurada');
  }

  if (!appId) {
    throw new Error('NEXT_PUBLIC_ALCHEMY_APP_ID não configurada');
  }

  // Configuração do Account Kit
  const accountKit = createAccountKit({
    chain: {
      id: chainId,
      // Se for Mumbai, usa a configuração específica
      ...(chainId === 80001 ? polygonMumbai : {}),
    },
    apiKey,
    appId,
    // Gas Manager: subsidia transações dos usuários
    // Se não tiver Policy ID, usuários pagarão suas próprias gas fees
    gasManagerConfig: gasPolicyId
      ? {
          policyId: gasPolicyId,
        }
      : undefined,
  });

  return accountKit;
}

/**
 * Verifica se o Gas Manager está configurado
 */
export function isGasManagerEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID;
}

