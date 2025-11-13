'use client';

import { useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlchemyAccountProvider } from "@account-kit/react";
import { getAccountKitConfig } from '@/lib/accountKitConfig';

export function Providers({ children }: { children: React.ReactNode }) {
  // Criar QueryClient dentro do componente para evitar problemas de SSR
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minuto
        refetchOnWindowFocus: false,
      },
    },
  }));

  // Criar config do Account Kit no cliente
  const accountKitConfig = useMemo(() => getAccountKitConfig(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <AlchemyAccountProvider config={accountKitConfig} queryClient={queryClient}>
        {children}
      </AlchemyAccountProvider>
    </QueryClientProvider>
  );
}

