/**
 * Configuração do Alchemy Account Kit
 * 
 * O Gas Policy ID permite subsidiar transações dos usuários,
 * permitindo que eles usem o protocolo sem pagar gas fees.
 */

import { createLightAccountAlchemyProvider, withAlchemyGasManager } from '@alchemy/aa-alchemy';
import { polygonMumbai } from 'wagmi/chains';

export function createAlchemyProvider(signer?: any) {
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

  // Chain config - usar Mumbai como padrão
  const chain = chainId === 80001 ? polygonMumbai : polygonMumbai;

  // Configuração base do provider
  // Nota: A implementação completa do social login requer configuração adicional
  // Por enquanto, apenas verificamos a configuração
  let provider: any = null;

  try {
    provider = createLightAccountAlchemyProvider({
      chain,
      apiKey,
      // entryPointAddress: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789', // EntryPoint v0.6
    });

    // Adicionar Gas Manager se Policy ID estiver configurado
    if (gasPolicyId && provider) {
      provider = withAlchemyGasManager(provider, {
        policyId: gasPolicyId,
      });
    }
  } catch (error) {
    console.warn('Erro ao criar provider (pode ser normal se não estiver implementado):', error);
  }

  return provider;
}

/**
 * Verifica se o Gas Manager está configurado
 */
export function isGasManagerEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID;
}

