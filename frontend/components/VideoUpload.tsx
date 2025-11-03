'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import lighthouse from '@lighthouse-web3/sdk';

export function VideoUpload() {
  const { address } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cid, setCid] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadToLighthouse = async () => {
    if (!file || !address) {
      alert('Selecione um arquivo e conecte sua wallet');
      return;
    }

    setUploading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY || '';
      
      // Upload para Lighthouse (IPFS com Filecoin)
      const output = await lighthouse.upload(
        file,
        apiKey,
        undefined,
        undefined,
        (progressData: any) => {
          const percentageDone =
            100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
          console.log('Progress:', percentageDone);
        }
      );

      if (output.data?.Hash) {
        setCid(output.data.Hash);
        console.log('CID (Proof of Effort):', output.data.Hash);
        alert(`Vídeo enviado! CID: ${output.data.Hash}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erro ao fazer upload do vídeo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">📹 Prova de Esforço</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Selecione seu vídeo de performance
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-50 file:text-primary-700
              hover:file:bg-primary-100
              dark:file:bg-primary-900 dark:file:text-primary-300"
          />
        </div>

        {file && (
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Arquivo: {file.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tamanho: {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        {cid && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">
              ✅ Upload concluído!
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 break-all">
              CID: {cid}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Este CID será registrado on-chain como prova de esforço
            </p>
          </div>
        )}

        <button
          onClick={uploadToLighthouse}
          disabled={!file || uploading || !address}
          className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Enviando para Lighthouse...' : 'Enviar para Lighthouse (IPFS)'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          O vídeo será armazenado permanentemente no IPFS via Lighthouse.storage
        </p>
      </div>
    </div>
  );
}

