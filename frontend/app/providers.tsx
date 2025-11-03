'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { createConfig, http } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { createAccountKit } from '@alchemy/aa-alchemy';
import { alchemyProvider } from 'wagmi/providers/alchemy';

const queryClient = new QueryClient();

// Configuração Wagmi com Alchemy
const config = createConfig({
  chains: [polygonMumbai],
  providers: [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '',
    }),
  ],
  transports: {
    [polygonMumbai.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

