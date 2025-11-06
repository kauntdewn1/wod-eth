'use client';

import { useState } from 'react';
import { useConnect } from 'wagmi';
import { getAccountKit, isGasManagerEnabled } from '@/lib/alchemyAccountKit';

export function LoginButton() {
  const [loading, setLoading] = useState(false);
  const { connect } = useConnect();

  const handleSocialLogin = async (provider: 'google' | 'email') => {
    setLoading(true);
    try {
      // Configuração do Account Kit com Gas Manager (se Policy ID estiver configurada)
      const accountKit = getAccountKit();
      
      // Gas Manager configurado = transações subsidiadas (usuário não paga gas)
      // Gas Manager não configurado = usuário paga suas próprias gas fees
      if (isGasManagerEnabled()) {
        console.log('✅ Gas Manager ativado - transações serão subsidiadas');
      } else {
        console.warn('⚠️ Gas Manager não configurado - usuários pagarão gas fees');
      }

      // TODO: Implementar login social completo
      // Para Google: accountKit.connectSocial('google')
      // Para Email: accountKit.connectSocial('email')
      // Depois conectar à wallet via Wagmi
      
      console.log(`Login with ${provider}`);
      console.log('Account Kit configurado:', {
        hasGasManager: isGasManagerEnabled(),
        chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
      });
      
      // Por enquanto, apenas log
      alert(
        `Login com ${provider} será implementado.\n` +
        `Gas Manager: ${isGasManagerEnabled() ? '✅ Ativado' : '⚠️ Desativado'}`
      );
    } catch (error) {
      console.error('Login error:', error);
      alert(`Erro ao conectar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={() => handleSocialLogin('google')}
        disabled={loading}
        className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        {loading ? 'Conectando...' : 'Entrar com Google'}
      </button>
      <button
        onClick={() => handleSocialLogin('email')}
        disabled={loading}
        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? 'Conectando...' : 'Entrar com E-mail'}
      </button>
    </div>
  );
}

