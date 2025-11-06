'use client';

import { useState } from 'react';
import { useConnect } from 'wagmi';
import { verifyAlchemyConfig, isGasManagerEnabled } from '@/lib/alchemyAccountKit';

export function LoginButton() {
  const [loading, setLoading] = useState(false);
  const { connect } = useConnect();

  const handleSocialLogin = async (provider: 'google' | 'email') => {
    setLoading(true);
    try {
      // Verifica configuração do Alchemy
      const config = verifyAlchemyConfig();
      
      if (!config.valid) {
        alert(`Configuração incompleta:\n${config.errors.join('\n')}`);
        setLoading(false);
        return;
      }

      // Verifica se Gas Manager está configurado
      const hasGasManager = isGasManagerEnabled();
      
      if (hasGasManager) {
        console.log('✅ Gas Manager ativado - transações serão subsidiadas');
      } else {
        console.warn('⚠️ Gas Manager não configurado - usuários pagarão gas fees');
      }

      // TODO: Implementar login social completo com Alchemy Account Kit
      // A implementação completa requer:
      // 1. Usar @alchemy/aa-accounts para criar signer social
      // 2. Criar provider com createLightAccountAlchemyProvider(signer)
      // 3. Integrar com Wagmi para conectar wallet
      // 4. Configurar Gas Manager com withAlchemyGasManager
      
      console.log(`Login com ${provider}`);
      console.log('Configuração:', {
        hasGasManager,
        chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
        apiKey: '✅ Configurada',
        appId: '✅ Configurada',
      });
      
      // Por enquanto, apenas verificação de configuração
      alert(
        `Login com ${provider} será implementado em breve.\n\n` +
        `Status:\n` +
        `Gas Manager: ${hasGasManager ? '✅ Ativado' : '⚠️ Desativado'}\n` +
        `API Key: ✅\n` +
        `App ID: ✅`
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

