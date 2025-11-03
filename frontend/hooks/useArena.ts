'use client';

import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { ArenaABI } from '@/abis/ArenaABI';

const ARENA_ADDRESS = process.env.NEXT_PUBLIC_ARENA_ADDRESS || '0x0';

export function useArena() {
  const { address } = useAccount();

  // Ler desafios
  const getChallenge = (challengeId: number) => {
    return useReadContract({
      address: ARENA_ADDRESS as `0x${string}`,
      abi: ArenaABI,
      functionName: 'getChallenge',
      args: [BigInt(challengeId)],
      query: {
        enabled: challengeId > 0 && ARENA_ADDRESS !== '0x0',
      },
    });
  };

  // Entrar em desafio
  const enterChallenge = () => {
    const { writeContract, data: hash, isPending } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
      hash,
    });

    return {
      enterChallenge: (challengeId: number) => {
        writeContract({
          address: ARENA_ADDRESS as `0x${string}`,
          abi: ArenaABI,
          functionName: 'enterChallenge',
          args: [BigInt(challengeId)],
        });
      },
      isLoading: isPending || isConfirming,
      isSuccess,
      hash,
    };
  };

  // Submeter prova
  const submitProof = () => {
    const { writeContract, data: hash, isPending } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
      hash,
    });

    return {
      submitProof: (challengeId: number, proofCID: string) => {
        writeContract({
          address: ARENA_ADDRESS as `0x${string}`,
          abi: ArenaABI,
          functionName: 'submitProof',
          args: [BigInt(challengeId), proofCID],
        });
      },
      isLoading: isPending || isConfirming,
      isSuccess,
      hash,
    };
  };

  // Votar (validador)
  const vote = () => {
    const { writeContract, data: hash, isPending } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
      hash,
    });

    return {
      vote: (challengeId: number, athlete: string, approved: boolean) => {
        writeContract({
          address: ARENA_ADDRESS as `0x${string}`,
          abi: ArenaABI,
          functionName: 'vote',
          args: [BigInt(challengeId), athlete as `0x${string}`, approved],
        });
      },
      isLoading: isPending || isConfirming,
      isSuccess,
      hash,
    };
  };

  return {
    getChallenge,
    enterChallenge,
    submitProof,
    vote,
  };
}
