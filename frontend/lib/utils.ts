/**
 * Funções utilitárias
 */

/**
 * Formata endereço de wallet para exibição (0x1234...5678)
 */
export function formatAddress(address: string | undefined): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formata timestamp para data legível
 */
export function formatDate(timestamp: number | bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calcula tempo restante até deadline
 */
export function timeUntilDeadline(endTime: number | bigint): string {
  const now = Math.floor(Date.now() / 1000);
  const end = Number(endTime);
  const diff = end - now;

  if (diff <= 0) return 'Encerrado';

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Trunca CID para exibição
 */
export function truncateCID(cid: string, length: number = 10): string {
  if (cid.length <= length) return cid;
  return `${cid.slice(0, length)}...`;
}

/**
 * Cria link IPFS
 */
export function getIPFSLink(cid: string): string {
  return `https://ipfs.io/ipfs/${cid}`;
}

/**
 * Valida endereço Ethereum
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

