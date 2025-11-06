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
      <div className="bg-arena border border-token/20 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-protocol">⚖️ Tornar-se Validador</h2>
        <div className="space-y-4">
          <div className="p-4 bg-token/10 border border-token/30 rounded-lg">
            <p className="text-sm mb-2 text-protocol">
              <strong>Stake Mínimo:</strong> <span className="font-mono text-token">{minStake} $WOD</span>
            </p>
            <p className="text-xs text-protocol/70">
              Como validador, você avalia submissões e recebe parte das comissões dos desafios.
              O stake garante comprometimento e qualidade nas validações.
            </p>
          </div>

          <div>
            <p className="text-sm text-protocol/70 mb-2">
              Seu saldo: <strong className="text-token font-mono">{formattedBalance} $WOD</strong>
            </p>
            {parseFloat(formattedBalance) < parseFloat(minStake) && (
              <p className="text-sm text-token">
                Saldo insuficiente. Você precisa de {minStake} $WOD.
              </p>
            )}
          </div>

          <button
            onClick={handleRegisterValidator}
            disabled={parseFloat(formattedBalance) < parseFloat(minStake)}
            className="w-full px-6 py-3 bg-token text-arena rounded-lg hover:bg-[#e61912] disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md"
          >
            Registrar como Validador
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-arena border border-token/20 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-protocol">⚖️ Painel do Validador</h2>

      {pendingSubmissions.length === 0 ? (
        <div className="text-center py-12 text-protocol/60">
          <p>Nenhuma submissão pendente para validação</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingSubmissions.map((submission, index) => (
            <div
              key={index}
              className="border border-token/30 rounded-lg p-4 bg-arena"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-protocol">Desafio #{submission.challengeId}</p>
                  <p className="text-sm text-protocol/70 font-mono">
                    Atleta: {submission.athlete}
                  </p>
                  <p className="text-xs text-protocol/60 mt-1 font-mono">
                    CID: {submission.proofCID}
                  </p>
                  <a
                    href={`https://ipfs.io/ipfs/${submission.proofCID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-token hover:underline mt-1 inline-block"
                  >
                    Ver vídeo no IPFS →
                  </a>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleVote(submission.challengeId, submission.athlete, true)}
                  className="flex-1 px-4 py-2 bg-token text-arena rounded-lg hover:bg-[#e61912] font-semibold shadow-md"
                >
                  ✓ Rep (Aprovar)
                </button>
                <button
                  onClick={() => handleVote(submission.challengeId, submission.athlete, false)}
                  className="flex-1 px-4 py-2 bg-protocol text-arena rounded-lg hover:bg-protocol/90 font-semibold shadow-md"
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

