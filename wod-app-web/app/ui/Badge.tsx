'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'token' | 'success' | 'warning' | 'info' | 'protocol';
  className?: string;
}

export function Badge({ children, variant = 'token', className = '' }: BadgeProps) {
  const variants = {
    token: 'bg-token/20 text-token border border-token/30',
    success: 'bg-token/20 text-token border border-token/30',
    warning: 'bg-token/10 text-token border border-token/20',
    info: 'bg-protocol/10 text-protocol/80 border border-protocol/20',
    protocol: 'bg-protocol/10 text-protocol/60 border border-protocol/20',
  };
  
  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-semibold
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Badges específicos para casos de uso comuns
export function TokenBadge({ amount, className = '' }: { amount: string; className?: string }) {
  return (
    <Badge variant="token" className={`font-mono ${className}`}>
      {amount} $WOD
    </Badge>
  );
}

export function ValidatedBadge({ className = '' }: { className?: string }) {
  return (
    <Badge variant="success" className={className}>
      ✓ Validado
    </Badge>
  );
}

export function TopBadge({ rank, className = '' }: { rank?: string; className?: string }) {
  return (
    <Badge variant="token" className={className}>
      🏆 Top {rank || '1%'}
    </Badge>
  );
}

