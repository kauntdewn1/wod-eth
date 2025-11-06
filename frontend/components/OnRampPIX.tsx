'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

export function OnRampPIX() {
  const { address } = useAccount();
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleBuyWOD = async () => {
    if (!address || !amount || parseFloat(amount) <= 0) {
      alert('Insira um valor válido');
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrar Alchemy Pay On-Ramp
      // Exemplo de integração:
      // const response = await alchemyPay.createPayment({
      //   amount: parseFloat(amount),
      //   currency: 'BRL',
      //   paymentMethod: 'PIX',
      //   recipientAddress: address,
      //   tokenAddress: WOD_TOKEN_ADDRESS,
      // });

      console.log(`Comprar ${amount} $WOD via PIX`);
      alert('On-Ramp PIX será implementado com Alchemy Pay');
    } catch (error) {
      console.error('Buy WOD error:', error);
      alert('Erro ao processar compra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-arena border border-token/20 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-protocol">💰 Comprar $WOD</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-protocol">
            Valor em R$ (PIX)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100.00"
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-token/30 rounded-lg bg-arena text-protocol focus:ring-2 focus:ring-token"
          />
        </div>

        {amount && parseFloat(amount) > 0 && (
          <div className="p-4 bg-token/10 border border-token/30 rounded-lg">
            <p className="text-sm text-protocol/80">
              Você receberá aproximadamente:{' '}
              <span className="font-semibold text-token font-mono">
                {parseFloat(amount) * 10} $WOD
              </span>
            </p>
            <p className="text-xs text-protocol/60 mt-1">
              * Taxa de câmbio estimada (1 BRL ≈ 10 WOD)
            </p>
          </div>
        )}

        <button
          onClick={handleBuyWOD}
          disabled={!address || !amount || parseFloat(amount) <= 0 || loading}
          className="w-full px-6 py-3 bg-token text-arena rounded-lg hover:bg-[#e61912] disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md"
        >
          {loading ? 'Processando...' : 'Pagar com PIX'}
        </button>

        <p className="text-xs text-protocol/60 text-center">
          Pagamento processado via Alchemy Pay. Os $WOD serão depositados automaticamente na sua wallet.
        </p>
      </div>
    </div>
  );
}

