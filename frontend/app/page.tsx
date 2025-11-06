'use client';

import { useSignerStatus, useUser } from '@account-kit/react';
import { LoginButton } from '@/components/LoginButton';
import { ArenaDashboard } from '@/components/ArenaDashboard';
import { DailyTraining } from '@/components/DailyTraining';
import { OnRampPIX } from '@/components/OnRampPIX';
import { ValidatorDashboard } from '@/components/ValidatorDashboard';
import { IPFSStatus } from '@/components/IPFSStatus';

export default function Home() {
  const { isConnected } = useSignerStatus();
  const { user } = useUser();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">WOD [X] PRO</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Transforme seu desempenho físico em valor digital perpétuo
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                wod.eth • Token: $WOD
              </p>
            </div>
            {isConnected ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : 'Conectado'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {user?.email || ''}
                </span>
              </div>
            ) : (
              <LoginButton />
            )}
          </div>
        </header>

        {/* Main Content */}
        {isConnected ? (
          <div className="space-y-6">
            <IPFSStatus />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <DailyTraining />
                <OnRampPIX />
              </div>
              <div>
                <ArenaDashboard />
              </div>
            </div>
            <ValidatorDashboard />
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">
              Conecte sua wallet para começar
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Use Alchemy Account Kit para login social e acesso sem fricção
            </p>
            <LoginButton />
          </div>
        )}
      </div>
    </main>
  );
}

