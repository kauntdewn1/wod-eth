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
  const { formattedBalance, approveToken } = useWODToken();
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
    <div className="bg-arena border border-token/20 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-protocol">🏟️ A Arena</h2>
        <div className="text-right">
          <p className="text-sm text-protocol/60">Seu saldo</p>
          <p className="text-xl font-bold text-token font-mono">{formattedBalance} $WOD</p>
        </div>
      </div>

      <div className="space-y-4">
        {challenges.length === 0 ? (
          <div className="text-center py-12 text-protocol/60">
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
                className="border border-token/30 rounded-lg p-4 bg-arena hover:shadow-token transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-protocol">{challenge.name}</h3>
                    <p className="text-protocol/70 text-sm">
                      {challenge.description}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isActive
                        ? 'bg-token/20 text-token border border-token/30'
                        : 'bg-protocol/10 text-protocol/60 border border-protocol/20'
                    }`}
                  >
                    {isActive ? 'Ativo' : 'Encerrado'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-protocol/60">Taxa de entrada</p>
                    <p className="font-semibold text-protocol font-mono">{challenge.entryFee} $WOD</p>
                  </div>
                  <div>
                    <p className="text-xs text-protocol/60">Prize Pool</p>
                    <p className="font-semibold text-token font-mono">{challenge.prizePool} $WOD</p>
                  </div>
                  <div>
                    <p className="text-xs text-protocol/60">Participantes</p>
                    <p className="font-semibold text-protocol">{challenge.participantCount.toString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-protocol/60">Encerra em</p>
                    <p className="font-semibold text-protocol">
                      {new Date(Number(challenge.endTime) * 1000).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleEnterChallenge(challenge.id, challenge.entryFee)}
                      disabled={parseFloat(formattedBalance) < parseFloat(challenge.entryFee)}
                      className="w-full px-4 py-2 bg-token text-arena rounded-lg hover:bg-[#e61912] disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md"
                    >
                      {parseFloat(formattedBalance) < parseFloat(challenge.entryFee)
                        ? 'Saldo insuficiente'
                        : 'Entrar no Desafio'}
                    </button>

                    {selectedChallenge === challenge.id && (
                      <div className="p-3 bg-arena border border-token/30 rounded-lg">
                        <p className="text-sm font-semibold mb-2 text-protocol">Submeter Prova de Esforço</p>
                        {trainingLogs.length === 0 ? (
                          <p className="text-sm text-protocol/60 mb-2">
                            Você precisa ter treinos com vídeo registrados
                          </p>
                        ) : (
                          <select
                            value={selectedTraining || ''}
                            onChange={(e) => setSelectedTraining(e.target.value)}
                            className="w-full px-3 py-2 border border-token/30 rounded-lg mb-2 bg-arena text-protocol"
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
                          className="w-full px-4 py-2 bg-token text-arena rounded-lg hover:bg-[#e61912] disabled:opacity-50 text-sm font-semibold shadow-md"
                        >
                          Submeter Prova
                        </button>
                      </div>
                    )}

                    {selectedChallenge !== challenge.id && (
                      <button
                        onClick={() => setSelectedChallenge(challenge.id)}
                        className="w-full px-4 py-2 bg-protocol/10 border border-protocol/20 text-protocol rounded-lg hover:bg-protocol/20 text-sm"
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
