'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlchemyAccountProvider } from "@account-kit/react";
import { accountKitConfig } from '@/lib/accountKitConfig';

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

  return (
    <QueryClientProvider client={queryClient}>
      <AlchemyAccountProvider config={accountKitConfig}>
        {children}
      </AlchemyAccountProvider>
    </QueryClientProvider>
  );
}

