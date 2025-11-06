'use client';

import { useState } from 'react';
import { useConnect } from 'wagmi';
import { createAlchemyProvider, isGasManagerEnabled } from '@/lib/alchemyAccountKit';

export function LoginButton() {
  const [loading, setLoading] = useState(false);
  const { connect } = useConnect();

  const handleSocialLogin = async (provider: 'google' | 'email') => {
    setLoading(true);
    try {
      // Verifica se Gas Manager está configurado
      const hasGasManager = isGasManagerEnabled();
      
      if (hasGasManager) {
        console.log('✅ Gas Manager ativado - transações serão subsidiadas');
      } else {
        console.warn('⚠️ Gas Manager não configurado - usuários pagarão gas fees');
      }

      // TODO: Implementar login social completo com Alchemy
      // A implementação completa requer:
      // 1. Configurar provider com createAlchemyProvider()
      // 2. Integrar com Alchemy Account Kit para social login
      // 3. Conectar wallet via Wagmi
      
      console.log(`Login com ${provider}`);
      console.log('Configuração:', {
        hasGasManager,
        chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ? '✅ Configurada' : '❌ Não configurada',
        appId: process.env.NEXT_PUBLIC_ALCHEMY_APP_ID ? '✅ Configurada' : '❌ Não configurada',
      });
      
      // Por enquanto, apenas verificação de configuração
      alert(
        `Login com ${provider} será implementado em breve.\n\n` +
        `Status:\n` +
        `Gas Manager: ${hasGasManager ? '✅ Ativado' : '⚠️ Desativado'}\n` +
        `API Key: ${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ? '✅' : '❌'}\n` +
        `App ID: ${process.env.NEXT_PUBLIC_ALCHEMY_APP_ID ? '✅' : '❌'}`
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

