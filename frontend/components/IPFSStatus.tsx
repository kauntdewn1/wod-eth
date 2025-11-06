'use client';

import { useState, useEffect } from 'react';
import { getAvailableProviders, IPFSProvider } from '@/lib/ipfs';

export function IPFSStatus() {
  const [availableProviders, setAvailableProviders] = useState<IPFSProvider[]>([]);
  const [localIPFSAvailable, setLocalIPFSAvailable] = useState(false);

  useEffect(() => {
    // Verificar provedores disponíveis
    const providers = getAvailableProviders({
      nftStorageApiKey: process.env.NEXT_PUBLIC_NFTSTORAGE_API_KEY,
      lighthouseApiKey: process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
      localIPFS: false, // Será verificado abaixo
    });

    setAvailableProviders(providers);

    // Verificar se IPFS local está rodando (com timeout)
    const checkLocalIPFS = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000); // 2s timeout
        
        await fetch('http://127.0.0.1:5001/api/v0/version', {
          signal: controller.signal,
        });
        
        clearTimeout(timeout);
        setLocalIPFSAvailable(true);
      } catch {
        setLocalIPFSAvailable(false);
      }
    };
    
    checkLocalIPFS();
  }, []);

  if (availableProviders.length === 0 && !localIPFSAvailable) {
    return (
      <div className="p-3 bg-token/10 border border-token/30 rounded-lg">
        <p className="text-sm text-token">
          ⚠️ Nenhum provedor IPFS configurado. Configure NFT.Storage ou Lighthouse no .env
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 bg-token/10 border border-token/30 rounded-lg">
      <p className="text-sm font-semibold text-token mb-1">
        ✅ Provedores IPFS Disponíveis:
      </p>
      <ul className="text-xs text-protocol/80 space-y-1">
        {availableProviders.includes('nftstorage') && (
          <li>• NFT.Storage (configurado)</li>
        )}
        {availableProviders.includes('lighthouse') && (
          <li>• Lighthouse (configurado)</li>
        )}
        {localIPFSAvailable && (
          <li>• IPFS Local (detectado)</li>
        )}
      </ul>
    </div>
  );
}

