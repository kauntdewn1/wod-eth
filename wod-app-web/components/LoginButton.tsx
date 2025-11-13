'use client';

import { useState } from 'react';
import { EmailAuth } from './EmailAuth';

type AuthMode = 'otp' | 'magicLink';

export function LoginButton() {
  const [selectedMode, setSelectedMode] = useState<AuthMode>('otp');

  return (
    <div className="flex flex-col gap-4">
      {/* Seletor de modo */}
      <div className="flex gap-2 p-1 bg-arena border border-token/20 rounded-lg">
        <button
          onClick={() => setSelectedMode('otp')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedMode === 'otp'
              ? 'bg-token text-arena shadow-sm'
              : 'text-protocol/60 hover:text-protocol'
          }`}
        >
          Código (OTP)
        </button>
        <button
          onClick={() => setSelectedMode('magicLink')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedMode === 'magicLink'
              ? 'bg-token text-arena shadow-sm'
              : 'text-protocol/60 hover:text-protocol'
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
