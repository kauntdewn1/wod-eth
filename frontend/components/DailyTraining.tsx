'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { uploadToIPFS, IPFSProvider } from '@/lib/ipfs';
import { saveTrainingLog, getTrainingLogs, TrainingLog } from '@/lib/trainingLog';

export function DailyTraining() {
  const { address } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [workoutType, setWorkoutType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>([]);
  const [ipfsProvider, setIpfsProvider] = useState<IPFSProvider>('nftstorage');

  // Carregar logs ao montar componente
  useEffect(() => {
    setTrainingLogs(getTrainingLogs());
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSaveTraining = async () => {
    if (!workoutType.trim()) {
      alert('Informe o tipo de treino');
      return;
    }

    setUploading(true);
    
    try {
      let videoCID: string | undefined;

      // Upload opcional (se houver vídeo)
      if (file) {
        setUploadProgress(0);
        
        const result = await uploadToIPFS(file, {
          provider: ipfsProvider,
          nftStorageApiKey: process.env.NEXT_PUBLIC_NFTSTORAGE_API_KEY,
          lighthouseApiKey: process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
          onProgress: (progress) => setUploadProgress(progress),
        });
        
        videoCID = result.cid;
        console.log(`✅ Upload concluído via ${result.provider}: ${result.cid}`);
      }

      // Salvar localmente (OFF-CHAIN - zero custo!)
      const training = saveTrainingLog({
        date: new Date().toISOString(),
        workoutType,
        description,
        videoCID,
      });

      // Atualizar lista (recarregar do localStorage)
      setTrainingLogs(getTrainingLogs());
      
      // Limpar form
      setFile(null);
      setWorkoutType('');
      setDescription('');
      
      alert('✅ Treino salvo! (Sem custo de gas - off-chain)');
    } catch (error) {
      console.error('Error saving training:', error);
      alert('Erro ao salvar treino');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-2">📝 Treino Diário</h2>
      <p className="text-sm text-gray-500 mb-6">
        Registre seus treinos diários - <strong>sem custo de gas!</strong> (Off-chain)
      </p>

      <div className="space-y-4">
        {/* Formulário */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tipo de Treino *
          </label>
          <input
            type="text"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            placeholder="Ex: CrossFit, Corrida, Musculação..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva seu treino..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              Vídeo (Opcional)
            </label>
            <select
              value={ipfsProvider}
              onChange={(e) => setIpfsProvider(e.target.value as IPFSProvider)}
              className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
            >
              <option value="nftstorage">NFT.Storage</option>
              <option value="lighthouse">Lighthouse</option>
              <option value="local">IPFS Local</option>
            </select>
          </div>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-50 file:text-primary-700
              hover:file:bg-primary-100"
            disabled={uploading}
          />
          {uploading && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enviando para {ipfsProvider === 'nftstorage' ? 'NFT.Storage' : ipfsProvider === 'lighthouse' ? 'Lighthouse' : 'IPFS Local'}... {uploadProgress}%
              </p>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Vídeo será armazenado no IPFS (permanente), mas não registrado on-chain ainda
          </p>
        </div>

        <button
          onClick={handleSaveTraining}
          disabled={uploading || !workoutType.trim()}
          className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-semibold"
        >
          {uploading ? 'Salvando...' : '💾 Salvar Treino (Gratuito!)'}
        </button>

        {/* Histórico */}
        {trainingLogs.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-4">Histórico de Treinos</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {trainingLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{log.workoutType}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.date).toLocaleDateString('pt-BR')}
                      </p>
                      {log.videoCID && (
                        <p className="text-xs text-primary-600 mt-1">
                          📹 IPFS: {log.videoCID.slice(0, 10)}...
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        log.syncedOnChain
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {log.syncedOnChain ? '✓ On-chain' : 'Off-chain'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              💡 Estes treinos estão off-chain (gratuitos). Quando participar de um desafio,
              você escolhe qual usar como prova e aí sim registramos on-chain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

