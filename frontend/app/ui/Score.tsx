'use client';

import { ReactNode } from 'react';

interface ScoreProps {
  label: string;
  value: number;
  max?: number;
  showValue?: boolean;
  variant?: 'token' | 'protocol';
  className?: string;
}

export function Score({
  label,
  value,
  max = 100,
  showValue = true,
  variant = 'token',
  className = '',
}: ScoreProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variants = {
    token: {
      bg: 'bg-token/20',
      fill: 'bg-token',
      text: 'text-token',
    },
    protocol: {
      bg: 'bg-protocol/10',
      fill: 'bg-protocol',
      text: 'text-protocol',
    },
  };
  
  const current = variants[variant];
  
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-protocol/70">{label}</span>
        {showValue && (
          <span className={`text-sm font-semibold font-mono ${current.text}`}>
            {value}/{max}
          </span>
        )}
      </div>
      <div className={`w-full h-2 rounded-full ${current.bg} overflow-hidden`}>
        <div
          className={`h-full ${current.fill} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface ReputationScoreProps {
  score: number;
  max?: number;
  className?: string;
}

export function ReputationScore({ score, max = 1000, className = '' }: ReputationScoreProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-protocol">Reputation Score</span>
        <span className="text-lg font-bold text-token font-mono">{score}</span>
      </div>
      <Score
        label=""
        value={score}
        max={max}
        showValue={false}
        variant="token"
      />
    </div>
  );
}

