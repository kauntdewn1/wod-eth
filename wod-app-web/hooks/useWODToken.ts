'use client';

import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'ethers';
import { useEffect, useState } from 'react';
import { getContractDataForChain } from '@/lib/contractData';

export function useWODToken() {
  const { address } = useAccount();
  const [contractData, setContractData] = useState<{ abi: any[]; address: string } | null>(null);

  // Load contract data on mount
  useEffect(() => {
    getContractDataForChain('WODToken').then(data => {
      setContractData({ abi: data.abi, address: data.address });
    }).catch(console.error);
  }, []);

  // Ler saldo
  const balance = useReadContract({
    address: contractData?.address as `0x${string}`,
    abi: contractData?.abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractData && contractData.address !== '0x0',
    },
  });

  // Aprovar gasto
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approveToken = {
    approve: (spender: string, amount: string) => {
      if (!contractData) return;
      const amountWei = parseEther(amount);
      writeContract({
        address: contractData.address as `0x${string}`,
        abi: contractData.abi,
        functionName: 'approve',
        args: [spender as `0x${string}`, amountWei],
      });
    },
    isLoading: isPending || isConfirming,
    isSuccess,
    hash,
  };

  // Formatar saldo para exibição
  const formattedBalance = balance.data
    ? parseFloat(formatEther(balance.data as bigint)).toFixed(2)
    : '0.00';

  return {
    contractData,
    balance: balance.data ? formatEther(balance.data as bigint) : '0',
    formattedBalance,
    isLoading: balance.isLoading,
    approveToken,
  };
}
