'use client';

import { useState, useEffect } from 'react';
import { useAuthenticate, useSignerStatus } from "@account-kit/react";
import { AlchemySignerStatus } from "@account-kit/signer";

type EmailMode = 'otp' | 'magicLink';

interface EmailAuthProps {
  mode?: EmailMode;
}

export function EmailAuth({ mode = 'otp' }: EmailAuthProps) {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const { authenticate } = useAuthenticate();
  const { status, isConnected } = useSignerStatus();

  // Handle redirect from magic link
  useEffect(() => {
    if (mode === 'magicLink') {
      const handleRedirect = () => {
        const url = new URL(window.location.href);
        const bundle = url.searchParams.get("bundle");

        if (bundle) {
          setLoading(true);
          authenticate(
            {
              type: "email",
              bundle,
            },
            {
              onSuccess: () => {
                console.log('✅ Magic link autenticado com sucesso');
                setLoading(false);
              },
              onError: (error) => {
                console.error('Erro ao autenticar magic link:', error);
                alert('Erro ao autenticar. Por favor, tente novamente.');
                setLoading(false);
              },
            }
          );
        }
      };

      handleRedirect();
    }
  }, [mode, authenticate]);

  // Enviar OTP ou Magic Link
  const handleSendEmail = async () => {
    if (!email) {
      alert('Por favor, digite seu e-mail');
      return;
    }

    setLoading(true);
    try {
      await authenticate(
        {
          type: "email",
          emailMode: mode,
          email: email.toLowerCase(),
        },
        {
          onSuccess: () => {
            if (mode === 'otp') {
              setShowOtpInput(true);
              console.log('✅ OTP enviado para:', email);
            } else {
              setMagicLinkSent(true);
              console.log('✅ Magic link enviado para:', email);
            }
          },
          onError: (error) => {
            console.error('Erro ao enviar:', error);
            alert(`Erro ao enviar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
          },
        }
      );
    } catch (error) {
      console.error('Erro ao enviar:', error);
      alert(`Erro ao enviar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  // Verificar OTP
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      alert('Por favor, digite o código de 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      await authenticate(
        {
          type: "otp",
          otpCode,
        },
        {
          onSuccess: () => {
            console.log('✅ OTP verificado com sucesso');
            setShowOtpInput(false);
            setOtpCode('');
          },
          onError: (error) => {
            console.error('Erro ao verificar OTP:', error);
            alert('Código inválido. Por favor, tente novamente.');
          },
        }
      );
    } catch (error) {
      console.error('Erro ao verificar OTP:', error);
      alert('Código inválido. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Se já está conectado
  if (isConnected) {
    return (
      <div className="px-6 py-3 bg-token/10 border border-token rounded-lg text-token text-center font-semibold">
        ✅ Conectado
      </div>
    );
  }

  // Magic Link: mostrar mensagem de confirmação
  if (mode === 'magicLink' && magicLinkSent) {
    return (
      <div className="flex flex-col gap-4 p-6 bg-arena border border-token/30 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-protocol mb-2">
            Verifique seu e-mail
          </h3>
          <p className="text-sm text-protocol/80 mb-4">
            Enviamos um link de verificação para <strong>{email}</strong>
          </p>
          <p className="text-xs text-protocol/60">
            Clique no link no seu e-mail para completar o login
          </p>
        </div>
        <button
          onClick={() => {
            setMagicLinkSent(false);
            setEmail('');
          }}
          className="px-4 py-2 text-sm bg-protocol/10 border border-protocol/20 rounded-lg hover:bg-protocol/20 text-protocol"
        >
          Usar outro e-mail
        </button>
      </div>
    );
  }

  // OTP: mostrar input de código
  if (mode === 'otp' && (status === AlchemySignerStatus.AWAITING_EMAIL_AUTH || showOtpInput)) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-protocol/70">
            Digite o código de 6 dígitos enviado para {email}
          </label>
          <input
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            maxLength={6}
            className="px-4 py-2 border border-token/30 rounded-lg bg-arena text-center text-2xl tracking-widest text-protocol font-mono"
            disabled={loading}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleVerifyOtp}
            disabled={loading || otpCode.length !== 6}
            className="px-6 py-3 bg-token text-arena rounded-lg hover:bg-[#e61912] disabled:opacity-50 flex-1 font-semibold shadow-md"
          >
            {loading ? 'Verificando...' : 'Verificar Código'}
          </button>
          <button
            onClick={() => {
              setShowOtpInput(false);
              setOtpCode('');
              setEmail('');
            }}
            disabled={loading}
            className="px-4 py-3 bg-protocol/10 border border-protocol/20 rounded-lg hover:bg-protocol/20 text-protocol disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
        <button
          onClick={handleSendEmail}
          disabled={loading}
          className="text-sm text-token hover:underline"
        >
          Reenviar código
        </button>
      </div>
    );
  }

  // Tela inicial: pedir email
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm text-protocol/70">
          {mode === 'otp' 
            ? 'Digite seu e-mail para receber um código de verificação'
            : 'Digite seu e-mail para receber um link de verificação'}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="px-4 py-3 border border-token/30 rounded-lg bg-arena text-protocol"
          disabled={loading}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendEmail();
            }
          }}
        />
      </div>
      <button
        onClick={handleSendEmail}
        disabled={loading || !email}
        className="px-6 py-3 bg-token text-arena rounded-lg hover:bg-[#e61912] disabled:opacity-50 font-semibold shadow-md"
      >
        {loading 
          ? 'Enviando...' 
          : mode === 'otp' 
            ? 'Receber Código' 
            : 'Receber Link'}
      </button>
    </div>
  );
}

