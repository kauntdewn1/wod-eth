/**
 * Training Log Service
 * 
 * Gerencia treinos diários off-chain (sem custo de gas)
 * Sync on-chain apenas quando necessário (desafios, certificação)
 */

export interface TrainingLog {
  id: string;
  date: string;
  workoutType: string;
  description: string;
  videoCID?: string; // CID do Lighthouse IPFS
  syncedOnChain: boolean;
  challengeId?: number; // Se foi usado em um desafio
}

const TRAINING_LOG_KEY = 'wod_x_pro_training_log';

/**
 * Salva treino localmente (off-chain)
 */
export function saveTrainingLog(training: Omit<TrainingLog, 'id' | 'syncedOnChain'>): TrainingLog {
  const logs = getTrainingLogs();
  
  const newTraining: TrainingLog = {
    ...training,
    id: Date.now().toString(),
    syncedOnChain: false,
  };

  logs.push(newTraining);
  localStorage.setItem(TRAINING_LOG_KEY, JSON.stringify(logs));
  
  return newTraining;
}

/**
 * Retorna todos os treinos (off-chain)
 */
export function getTrainingLogs(): TrainingLog[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(TRAINING_LOG_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Marca treino como sincronizado on-chain
 */
export function markTrainingSynced(trainingId: string, challengeId?: number): void {
  const logs = getTrainingLogs();
  const log = logs.find(l => l.id === trainingId);
  
  if (log) {
    log.syncedOnChain = true;
    if (challengeId) {
      log.challengeId = challengeId;
    }
    localStorage.setItem(TRAINING_LOG_KEY, JSON.stringify(logs));
  }
}

/**
 * Retorna treinos não sincronizados
 */
export function getUnsyncedTrainings(): TrainingLog[] {
  return getTrainingLogs().filter(log => !log.syncedOnChain);
}

/**
 * Sync batch de treinos on-chain (opcional - uma transação para múltiplos)
 */
export async function syncBatchOnChain(
  trainingIds: string[],
  contractAddress: string,
  signer: any
): Promise<void> {
  // TODO: Implementar contrato TrainingLog.sol para batch sync
  // Por enquanto, isso só marca como synced
  // A implementação real registraria múltiplos CIDs em uma transação
  
  const logs = getTrainingLogs();
  trainingIds.forEach(id => {
    const log = logs.find(l => l.id === id);
    if (log) {
      markTrainingSynced(id);
    }
  });
}

/**
 * Limpa logs antigos (opcional - configuração do usuário)
 */
export function clearOldLogs(daysToKeep: number = 365): void {
  const logs = getTrainingLogs();
  const cutoffDate = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
  
  const filtered = logs.filter(log => {
    const logDate = new Date(log.date).getTime();
    return logDate > cutoffDate;
  });

  localStorage.setItem(TRAINING_LOG_KEY, JSON.stringify(filtered));
}

