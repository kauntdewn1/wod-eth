'use client';

import { useContractRead, useContractWrite, useWaitForTransaction, useAccount } from 'wagmi';
import { parseEther, formatEther } from 'ethers';
import { ArenaABI } from '@/abis/ArenaABI';

const ARENA_ADDRESS = process.env.NEXT_PUBLIC_ARENA_ADDRESS || '0x0';

export function useArena() {
  const { address } = useAccount();

  // Ler desafios
  const getChallenge = (challengeId: number) => {
    return useContractRead({
      address: ARENA_ADDRESS as `0x${string}`,
      abi: ArenaABI,
      functionName: 'getChallenge',
      args: [BigInt(challengeId)],
      enabled: challengeId > 0 && ARENA_ADDRESS !== '0x0',
    });
  };

  // Entrar em desafio
  const enterChallenge = () => {
    const { data, write, isLoading } = useContractWrite({
      address: ARENA_ADDRESS as `0x${string}`,
      abi: ArenaABI,
      functionName: 'enterChallenge',
    });

    const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
    });

    return {
      enterChallenge: (challengeId: number) => {
        if (write) {
          write({ args: [BigInt(challengeId)] });
        }
      },
      isLoading: isLoading || isConfirming,
      isSuccess,
      hash: data?.hash,
    };
  };

  // Submeter prova
  const submitProof = () => {
    const { data, write, isLoading } = useContractWrite({
      address: ARENA_ADDRESS as `0x${string}`,
      abi: ArenaABI,
      functionName: 'submitProof',
    });

    const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
    });

    return {
      submitProof: (challengeId: number, proofCID: string) => {
        if (write) {
          write({ args: [BigInt(challengeId), proofCID] });
        }
      },
      isLoading: isLoading || isConfirming,
      isSuccess,
      hash: data?.hash,
    };
  };

  // Votar (validador)
  const vote = () => {
    const { data, write, isLoading } = useContractWrite({
      address: ARENA_ADDRESS as `0x${string}`,
      abi: ArenaABI,
      functionName: 'vote',
    });

    const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
    });

    return {
      vote: (challengeId: number, athlete: string, approved: boolean) => {
        if (write) {
          write({ args: [BigInt(challengeId), athlete as `0x${string}`, approved] });
        }
      },
      isLoading: isLoading || isConfirming,
      isSuccess,
      hash: data?.hash,
    };
  };

  return {
    getChallenge,
    enterChallenge,
    submitProof,
    vote,
  };
}

