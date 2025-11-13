'use client';

import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function Loader({ size = 'md', className = '', text }: LoaderProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-token`} />
      {text && <p className="text-sm text-protocol/70">{text}</p>}
    </div>
  );
}

interface PageLoaderProps {
  text?: string;
}

export function PageLoader({ text = 'Carregando...' }: PageLoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-arena">
      <Loader size="lg" text={text} />
    </div>
  );
}

