'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlchemyAccountProvider } from "@account-kit/react";
import { accountKitConfig } from '@/lib/accountKitConfig';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AlchemyAccountProvider config={accountKitConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AlchemyAccountProvider>
  );
}

