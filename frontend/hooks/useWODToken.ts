'use client';

import { useContractRead, useContractWrite, useWaitForTransaction, useAccount } from 'wagmi';
import { parseEther, formatEther } from 'ethers';
import { WODTokenABI } from '@/abis/WODTokenABI';

const WOD_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_WOD_TOKEN_ADDRESS || '0x0';

export function useWODToken() {
  const { address } = useAccount();

  // Ler saldo
  const balance = useContractRead({
    address: WOD_TOKEN_ADDRESS as `0x${string}`,
    abi: WODTokenABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address && WOD_TOKEN_ADDRESS !== '0x0',
  });

  // Aprovar gasto
  const approve = () => {
    const { data, write, isLoading } = useContractWrite({
      address: WOD_TOKEN_ADDRESS as `0x${string}`,
      abi: WODTokenABI,
      functionName: 'approve',
    });

    const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
    });

    return {
      approve: (spender: string, amount: string) => {
        if (write) {
          const amountWei = parseEther(amount);
          write({ args: [spender as `0x${string}`, amountWei] });
        }
      },
      isLoading: isLoading || isConfirming,
      isSuccess,
      hash: data?.hash,
    };
  };

  // Formatar saldo para exibição
  const formattedBalance = balance.data
    ? parseFloat(formatEther(balance.data as bigint)).toFixed(2)
    : '0.00';

  return {
    balance: balance.data ? formatEther(balance.data as bigint) : '0',
    formattedBalance,
    isLoading: balance.isLoading,
    approve,
  };
}

