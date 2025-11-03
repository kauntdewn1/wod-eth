// ABI do contrato Arena
export const ArenaABI = [
  {
    inputs: [
      { internalType: 'address', name: '_wodToken', type: 'address' },
      { internalType: 'address', name: '_validatorRegistry', type: 'address' },
      { internalType: 'address', name: 'initialOwner', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'challengeId', type: 'uint256' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'uint256', name: 'entryFee', type: 'uint256' },
      { internalType: 'uint256', name: 'startTime', type: 'uint256' },
      { internalType: 'uint256', name: 'endTime', type: 'uint256' },
    ],
    name: 'createChallenge',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'challengeId', type: 'uint256' }],
    name: 'enterChallenge',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'challengeId', type: 'uint256' },
      { internalType: 'string', name: 'proofCID', type: 'string' },
    ],
    name: 'submitProof',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'challengeId', type: 'uint256' },
      { internalType: 'address', name: 'athlete', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'challengeId', type: 'uint256' }],
    name: 'resolveChallenge',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'challengeId', type: 'uint256' }],
    name: 'getChallenge',
    outputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'uint256', name: 'entryFee', type: 'uint256' },
      { internalType: 'uint256', name: 'prizePool', type: 'uint256' },
      { internalType: 'uint256', name: 'startTime', type: 'uint256' },
      { internalType: 'uint256', name: 'endTime', type: 'uint256' },
      { internalType: 'bool', name: 'isActive', type: 'bool' },
      { internalType: 'uint256', name: 'participantCount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

