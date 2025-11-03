'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useArena } from '@/hooks/useArena';
import { useWODToken } from '@/hooks/useWODToken';
import { getTrainingLogs, TrainingLog } from '@/lib/trainingLog';

interface Challenge {
  id: number;
  name: string;
  description: string;
  entryFee: string;
  prizePool: string;
  startTime: bigint;
  endTime: bigint;
  isActive: boolean;
  participantCount: bigint;
}

export function ArenaDashboard() {
  const { address } = useAccount();
  const arena = useArena();
  const { formattedBalance, approve: approveToken } = useWODToken();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);
  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>([]);
  const [showTrainingSelector, setShowTrainingSelector] = useState(false);

  // Carregar treinos disponíveis
  useEffect(() => {
    setTrainingLogs(getTrainingLogs().filter(t => t.videoCID && !t.syncedOnChain));
  }, []);

  // Mock de desafios (em produção, buscar do contrato)
  useEffect(() => {
    // TODO: Buscar desafios ativos do contrato
    const mockChallenges: Challenge[] = [
      {
        id: 1,
        name: 'Desafio WOD #1',
        description: '100 burpees em 10 minutos',
        entryFee: '100',
        prizePool: '1500',
        startTime: BigInt(Math.floor(Date.now() / 1000)),
        endTime: BigInt(Math.floor(Date.now() / 1000) + 86400 * 7), // 7 dias
        isActive: true,
        participantCount: BigInt(12),
      },
    ];
    setChallenges(mockChallenges);
  }, []);

  const handleEnterChallenge = async (challengeId: number, entryFee: string) => {
    if (!address) {
      alert('Conecte sua wallet');
      return;
    }

    try {
      // Primeiro, aprovar gasto de tokens
      const arenaAddress = process.env.NEXT_PUBLIC_ARENA_ADDRESS || '';
      await approveToken.approve(arenaAddress, entryFee);
      
      // Aguardar aprovação
      // Depois entrar no desafio
      const enterAction = arena.enterChallenge();
      enterAction.enterChallenge(challengeId);
    } catch (error) {
      console.error('Error entering challenge:', error);
      alert('Erro ao entrar no desafio');
    }
  };

  const handleSubmitProof = async (challengeId: number) => {
    if (!selectedTraining) {
      alert('Selecione um treino para usar como prova');
      return;
    }

    const training = trainingLogs.find(t => t.id === selectedTraining);
    if (!training || !training.videoCID) {
      alert('Treino inválido');
      return;
    }

    try {
      const submitAction = arena.submitProof();
      submitAction.submitProof(challengeId, training.videoCID);
    } catch (error) {
      console.error('Error submitting proof:', error);
      alert('Erro ao submeter prova');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🏟️ A Arena</h2>
        <div className="text-right">
          <p className="text-sm text-gray-500">Seu saldo</p>
          <p className="text-xl font-bold text-primary-600">{formattedBalance} $WOD</p>
        </div>
      </div>

      <div className="space-y-4">
        {challenges.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Nenhum desafio ativo no momento</p>
            <p className="text-sm mt-2">Novos desafios aparecerão aqui</p>
          </div>
        ) : (
          challenges.map((challenge) => {
            const isPast = Number(challenge.endTime) * 1000 < Date.now();
            const isActive = challenge.isActive && !isPast;

            return (
              <div
                key={challenge.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{challenge.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {challenge.description}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {isActive ? 'Ativo' : 'Encerrado'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Taxa de entrada</p>
                    <p className="font-semibold">{challenge.entryFee} $WOD</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Prize Pool</p>
                    <p className="font-semibold text-primary-600">{challenge.prizePool} $WOD</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Participantes</p>
                    <p className="font-semibold">{challenge.participantCount.toString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Encerra em</p>
                    <p className="font-semibold">
                      {new Date(Number(challenge.endTime) * 1000).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleEnterChallenge(challenge.id, challenge.entryFee)}
                      disabled={parseFloat(formattedBalance) < parseFloat(challenge.entryFee)}
                      className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      {parseFloat(formattedBalance) < parseFloat(challenge.entryFee)
                        ? 'Saldo insuficiente'
                        : 'Entrar no Desafio'}
                    </button>

                    {selectedChallenge === challenge.id && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-semibold mb-2">Submeter Prova de Esforço</p>
                        {trainingLogs.length === 0 ? (
                          <p className="text-sm text-gray-500 mb-2">
                            Você precisa ter treinos com vídeo registrados
                          </p>
                        ) : (
                          <select
                            value={selectedTraining || ''}
                            onChange={(e) => setSelectedTraining(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg mb-2 bg-white dark:bg-gray-900"
                          >
                            <option value="">Selecione um treino...</option>
                            {trainingLogs.map((training) => (
                              <option key={training.id} value={training.id}>
                                {training.workoutType} - {new Date(training.date).toLocaleDateString('pt-BR')}
                              </option>
                            ))}
                          </select>
                        )}
                        <button
                          onClick={() => handleSubmitProof(challenge.id)}
                          disabled={!selectedTraining}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                        >
                          Submeter Prova
                        </button>
                      </div>
                    )}

                    {selectedChallenge !== challenge.id && (
                      <button
                        onClick={() => setSelectedChallenge(challenge.id)}
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                      >
                        Submeter Prova de Esforço
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
