'use client';

import { AlchemyAccountProvider } from "@account-kit/react";
import { accountKitConfig } from '@/lib/accountKitConfig';

export function Providers({ children }: { children: React.ReactNode }) {
  // AlchemyAccountProvider já inclui QueryClientProvider internamente
  return (
    <AlchemyAccountProvider config={accountKitConfig}>
      {children}
    </AlchemyAccountProvider>
  );
}

