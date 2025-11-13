'use client';

import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { useEffect, useState } from 'react';
import { getContractDataForChain, getChainId } from '@/lib/contractData';

const CHAIN_ID = getChainId();

export function useArena() {
  const { address } = useAccount();
  const [contractData, setContractData] = useState<{ abi: any[]; address: string } | null>(null);

  // Load contract data on mount
  useEffect(() => {
    getContractDataForChain('Arena').then(data => {
      setContractData({ abi: data.abi, address: data.address });
    }).catch(console.error);
  }, []);

  // Ler desafios
  const getChallenge = (challengeId: number) => {
    return useReadContract({
      address: contractData?.address as `0x${string}`,
      abi: contractData?.abi,
      functionName: 'getChallenge',
      args: [BigInt(challengeId)],
      query: {
        enabled: challengeId > 0 && !!contractData && contractData.address !== '0x0',
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
        if (!contractData) return;
        writeContract({
          address: contractData.address as `0x${string}`,
          abi: contractData.abi,
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
        if (!contractData) return;
        writeContract({
          address: contractData.address as `0x${string}`,
          abi: contractData.abi,
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
        if (!contractData) return;
        writeContract({
          address: contractData.address as `0x${string}`,
          abi: contractData.abi,
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
    contractData,
    getChallenge,
    enterChallenge,
    submitProof,
    vote,
  };
}
