/**
 * IPFS Upload Service
 * Suporta múltiplos provedores: NFT.Storage e Lighthouse
 */

export type IPFSProvider = 'nftstorage' | 'lighthouse' | 'local';

interface UploadResult {
  cid: string;
  url: string;
  provider: IPFSProvider;
}

/**
 * Upload para NFT.Storage
 */
async function uploadToNFTStorage(file: File, apiKey: string): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://api.nft.storage/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`NFT.Storage upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  const cid = data.value.cid;

  return {
    cid,
    url: `https://ipfs.io/ipfs/${cid}`,
    provider: 'nftstorage',
  };
}

/**
 * Upload para Lighthouse
 */
async function uploadToLighthouse(file: File, apiKey: string): Promise<UploadResult> {
  // Dynamic import para evitar erro se não estiver instalado
  const lighthouse = await import('@lighthouse-web3/sdk');
  
  // API do Lighthouse mudou na versão 0.4.x
  const output = await lighthouse.default.upload(file, apiKey);

  // Lighthouse retorna { data: { Hash: string } } na versão 0.4.x
  const cid = (output as any)?.data?.Hash || (output as any)?.Hash || (output as any);

  if (!cid || typeof cid !== 'string') {
    throw new Error('Lighthouse upload failed: No CID returned');
  }

  return {
    cid,
    url: `https://ipfs.io/ipfs/${cid}`,
    provider: 'lighthouse',
  };
}

/**
 * Upload para IPFS local (se tiver rodando)
 */
async function uploadToLocalIPFS(file: File, gateway: string = 'http://127.0.0.1:5001'): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${gateway}/api/v0/add`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Local IPFS upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  const cid = data.Hash;

  return {
    cid,
    url: `http://127.0.0.1:8080/ipfs/${cid}`, // Gateway local
    provider: 'local',
  };
}

/**
 * Upload de arquivo para IPFS
 * Tenta múltiplos provedores em ordem de preferência
 */
export async function uploadToIPFS(
  file: File,
  options: {
    provider?: IPFSProvider;
    nftStorageApiKey?: string;
    lighthouseApiKey?: string;
    localGateway?: string;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<UploadResult> {
  const {
    provider = 'nftstorage', // Preferência: NFT.Storage primeiro
    nftStorageApiKey,
    lighthouseApiKey,
    localGateway,
    onProgress,
  } = options;

  // Simular progresso
  if (onProgress) {
    onProgress(10);
    setTimeout(() => onProgress(50), 100);
    setTimeout(() => onProgress(90), 500);
  }

  try {
    // Tentar provider preferido primeiro
    if (provider === 'nftstorage' && nftStorageApiKey) {
      try {
        const result = await uploadToNFTStorage(file, nftStorageApiKey);
        if (onProgress) onProgress(100);
        return result;
      } catch (error) {
        console.warn('NFT.Storage failed, trying fallback...', error);
        // Continuar para fallback
      }
    }

    if (provider === 'lighthouse' && lighthouseApiKey) {
      try {
        const result = await uploadToLighthouse(file, lighthouseApiKey);
        if (onProgress) onProgress(100);
        return result;
      } catch (error) {
        console.warn('Lighthouse failed, trying fallback...', error);
        // Continuar para fallback
      }
    }

    if (provider === 'local') {
      try {
        const result = await uploadToLocalIPFS(file, localGateway);
        if (onProgress) onProgress(100);
        return result;
      } catch (error) {
        console.warn('Local IPFS failed, trying fallback...', error);
      }
    }

    // Fallback automático: tentar todos os disponíveis
    if (nftStorageApiKey) {
      try {
        const result = await uploadToNFTStorage(file, nftStorageApiKey);
        if (onProgress) onProgress(100);
        return result;
      } catch (error) {
        console.warn('NFT.Storage fallback failed', error);
      }
    }

    if (lighthouseApiKey) {
      try {
        const result = await uploadToLighthouse(file, lighthouseApiKey);
        if (onProgress) onProgress(100);
        return result;
      } catch (error) {
        console.warn('Lighthouse fallback failed', error);
      }
    }

    throw new Error('Nenhum provedor IPFS disponível. Configure NFT.Storage ou Lighthouse.');
  } catch (error) {
    if (onProgress) onProgress(0);
    throw error;
  }
}

/**
 * Verifica qual provedor está disponível
 */
export function getAvailableProviders(env: {
  nftStorageApiKey?: string;
  lighthouseApiKey?: string;
  localIPFS?: boolean;
}): IPFSProvider[] {
  const available: IPFSProvider[] = [];

  if (env.nftStorageApiKey) {
    available.push('nftstorage');
  }

  if (env.lighthouseApiKey) {
    available.push('lighthouse');
  }

  if (env.localIPFS) {
    available.push('local');
  }

  return available;
}

/**
 * Retorna URL do gateway IPFS baseado no CID
 */
export function getIPFSGateway(cid: string, gateway: 'ipfs.io' | 'cloudflare' | 'local' = 'ipfs.io'): string {
  const gateways = {
    'ipfs.io': `https://ipfs.io/ipfs/${cid}`,
    'cloudflare': `https://cloudflare-ipfs.com/ipfs/${cid}`,
    'local': `http://127.0.0.1:8080/ipfs/${cid}`,
  };

  return gateways[gateway];
}

