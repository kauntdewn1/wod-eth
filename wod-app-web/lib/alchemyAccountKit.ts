/**
 * Configuração do Alchemy Account Kit
 * 
 * O Gas Policy ID permite subsidiar transações dos usuários,
 * permitindo que eles usem o protocolo sem pagar gas fees.
 * 
 * NOTA: A implementação completa do social login requer:
 * - Signer (owner) do Alchemy Account Kit
 * - Configuração do provider com owner
 * - Integração com wagmi para conectar wallet
 * 
 * Por enquanto, esta função apenas verifica se as configurações estão corretas.
 */

/**
 * Verifica se as configurações do Alchemy estão corretas
 */
export function verifyAlchemyConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!process.env.NEXT_PUBLIC_ALCHEMY_API_KEY) {
    errors.push('NEXT_PUBLIC_ALCHEMY_API_KEY não configurada');
  }
  
  if (!process.env.NEXT_PUBLIC_ALCHEMY_APP_ID) {
    errors.push('NEXT_PUBLIC_ALCHEMY_APP_ID não configurada');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Verifica se o Gas Manager está configurado
 */
export function isGasManagerEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID;
}

