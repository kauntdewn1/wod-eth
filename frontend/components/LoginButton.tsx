'use client';

import { useState } from 'react';
import { EmailAuth } from './EmailAuth';

type AuthMode = 'otp' | 'magicLink';

export function LoginButton() {
  const [selectedMode, setSelectedMode] = useState<AuthMode>('otp');

  return (
    <div className="flex flex-col gap-4">
      {/* Seletor de modo (opcional - pode remover se quiser usar apenas um modo) */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <button
          onClick={() => setSelectedMode('otp')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedMode === 'otp'
              ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Código (OTP)
        </button>
        <button
          onClick={() => setSelectedMode('magicLink')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedMode === 'magicLink'
              ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Link Mágico
        </button>
      </div>

      {/* Componente de autenticação */}
      <EmailAuth mode={selectedMode} />
    </div>
  );
}
