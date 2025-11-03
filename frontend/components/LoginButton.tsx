'use client';

import { useState } from 'react';
import { useConnect } from 'wagmi';
import { createAccountKit } from '@alchemy/aa-alchemy';

export function LoginButton() {
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = async (provider: 'google' | 'email') => {
    setLoading(true);
    try {
      // TODO: Implementar Alchemy Account Kit Social Login
      // const accountKit = createAccountKit({
      //   chain: {
      //     id: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '80001'),
      //   },
      //   apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '',
      // });
      
      console.log(`Login with ${provider}`);
      alert('Login com Alchemy Account Kit será implementado');
    } catch (error) {
      console.error('Login error:', error);
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

