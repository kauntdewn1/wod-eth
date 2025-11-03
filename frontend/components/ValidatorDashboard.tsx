'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useArena } from '@/hooks/useArena';
import { useWODToken } from '@/hooks/useWODToken';

export function ValidatorDashboard() {
  const { address } = useAccount();
  const arena = useArena();
  const { formattedBalance } = useWODToken();
  const [isValidator, setIsValidator] = useState(false);
  const [minStake, setMinStake] = useState('1000');
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([]);

  // Mock de submissões pendentes
  useEffect(() => {
    // TODO: Buscar submissões pendentes do contrato
    setPendingSubmissions([
      {
        challengeId: 1,
        athlete: '0x1234...5678',
        proofCID: 'QmABC123...',
        timestamp: Date.now() - 86400000,
      },
    ]);
  }, []);

  const handleVote = async (challengeId: number, athlete: string, approved: boolean) => {
    try {
      const voteAction = arena.vote();
      voteAction.vote(challengeId, athlete, approved);
    } catch (error) {
      console.error('Error voting:', error);
      alert('Erro ao votar');
    }
  };

  const handleRegisterValidator = async () => {
    // TODO: Implementar registro como validador
    alert('Registro de validador será implementado');
  };

  if (!isValidator) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">⚖️ Tornar-se Validador</h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm mb-2">
              <strong>Stake Mínimo:</strong> {minStake} $WOD
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Como validador, você avalia submissões e recebe parte das comissões dos desafios.
              O stake garante comprometimento e qualidade nas validações.
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Seu saldo: <strong>{formattedBalance} $WOD</strong>
            </p>
            {parseFloat(formattedBalance) < parseFloat(minStake) && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Saldo insuficiente. Você precisa de {minStake} $WOD.
              </p>
            )}
          </div>

          <button
            onClick={handleRegisterValidator}
            disabled={parseFloat(formattedBalance) < parseFloat(minStake)}
            className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Registrar como Validador
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">⚖️ Painel do Validador</h2>

      {pendingSubmissions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Nenhuma submissão pendente para validação</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingSubmissions.map((submission, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">Desafio #{submission.challengeId}</p>
                  <p className="text-sm text-gray-500">
                    Atleta: {submission.athlete}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    CID: {submission.proofCID}
                  </p>
                  <a
                    href={`https://ipfs.io/ipfs/${submission.proofCID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:underline mt-1 inline-block"
                  >
                    Ver vídeo no IPFS →
                  </a>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleVote(submission.challengeId, submission.athlete, true)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                  ✓ Rep (Aprovar)
                </button>
                <button
                  onClick={() => handleVote(submission.challengeId, submission.athlete, false)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  ✗ No-Rep (Rejeitar)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

