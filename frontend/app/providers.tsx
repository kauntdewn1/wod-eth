'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { createConfig, http } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';

const queryClient = new QueryClient();

// Configuração Wagmi com Alchemy (via RPC URL)
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';
const alchemyRpcUrl = alchemyApiKey
  ? `https://polygon-mumbai.g.alchemy.com/v2/${alchemyApiKey}`
  : 'https://rpc-mumbai.maticvigil.com';

const config = createConfig({
  chains: [polygonMumbai],
  transports: {
    [polygonMumbai.id]: http(alchemyRpcUrl),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

