'use client';

import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'ethers';
import { WODTokenABI } from '@/abis/WODTokenABI';

const WOD_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_WOD_TOKEN_ADDRESS || '0x0';

export function useWODToken() {
  const { address } = useAccount();

  // Ler saldo
  const balance = useReadContract({
    address: WOD_TOKEN_ADDRESS as `0x${string}`,
    abi: WODTokenABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && WOD_TOKEN_ADDRESS !== '0x0',
    },
  });

  // Aprovar gasto
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approveToken = {
    approve: (spender: string, amount: string) => {
      const amountWei = parseEther(amount);
      writeContract({
        address: WOD_TOKEN_ADDRESS as `0x${string}`,
        abi: WODTokenABI,
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
    balance: balance.data ? formatEther(balance.data as bigint) : '0',
    formattedBalance,
    isLoading: balance.isLoading,
    approveToken,
  };
}

