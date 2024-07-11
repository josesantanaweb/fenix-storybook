const abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    inputs: [],
    name: 'MAX_PAIRS',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
    ],
    name: 'addNotReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amounts',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_offset',
        type: 'uint256',
      },
    ],
    name: 'getAllCLPairRewards',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: '_pool',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_gauge',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_externalBribeAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_internalBribeAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'totalVotesOnGauge',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalVotesOnGaugeByUser',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'address[]',
                name: 'tokens',
                type: 'address[]',
              },
              {
                internalType: 'string[]',
                name: 'symbols',
                type: 'string[]',
              },
              {
                internalType: 'uint256[]',
                name: 'decimals',
                type: 'uint256[]',
              },
              {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
              },
              {
                internalType: 'address',
                name: 'bribe',
                type: 'address',
              },
            ],
            internalType: 'struct RewardAPI.Bribes',
            name: 'externalBribeReward',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address[]',
                name: 'tokens',
                type: 'address[]',
              },
              {
                internalType: 'string[]',
                name: 'symbols',
                type: 'string[]',
              },
              {
                internalType: 'uint256[]',
                name: 'decimals',
                type: 'uint256[]',
              },
              {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
              },
              {
                internalType: 'address',
                name: 'bribe',
                type: 'address',
              },
            ],
            internalType: 'struct RewardAPI.Bribes',
            name: 'internalBribeReward',
            type: 'tuple',
          },
        ],
        internalType: 'struct RewardAPI.PairRewards[]',
        name: 'Pairs',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amounts',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_offset',
        type: 'uint256',
      },
    ],
    name: 'getAllPairRewards',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: '_pool',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_gauge',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_externalBribeAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_internalBribeAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'totalVotesOnGauge',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalVotesOnGaugeByUser',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'address[]',
                name: 'tokens',
                type: 'address[]',
              },
              {
                internalType: 'string[]',
                name: 'symbols',
                type: 'string[]',
              },
              {
                internalType: 'uint256[]',
                name: 'decimals',
                type: 'uint256[]',
              },
              {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
              },
              {
                internalType: 'address',
                name: 'bribe',
                type: 'address',
              },
            ],
            internalType: 'struct RewardAPI.Bribes',
            name: 'externalBribeReward',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address[]',
                name: 'tokens',
                type: 'address[]',
              },
              {
                internalType: 'string[]',
                name: 'symbols',
                type: 'string[]',
              },
              {
                internalType: 'uint256[]',
                name: 'decimals',
                type: 'uint256[]',
              },
              {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
              },
              {
                internalType: 'address',
                name: 'bribe',
                type: 'address',
              },
            ],
            internalType: 'struct RewardAPI.Bribes',
            name: 'internalBribeReward',
            type: 'tuple',
          },
        ],
        internalType: 'struct RewardAPI.PairRewards[]',
        name: 'Pairs',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: '_bribes',
        type: 'address[]',
      },
      {
        internalType: 'address[][]',
        name: '_tokens',
        type: 'address[][]',
      },
    ],
    name: 'getAmountToClaim',
    outputs: [
      {
        components: [
          {
            internalType: 'address[]',
            name: 'tokens',
            type: 'address[]',
          },
          {
            internalType: 'string[]',
            name: 'symbols',
            type: 'string[]',
          },
          {
            internalType: 'uint256[]',
            name: 'decimals',
            type: 'uint256[]',
          },
          {
            internalType: 'uint256[]',
            name: 'amounts',
            type: 'uint256[]',
          },
          {
            internalType: 'address',
            name: 'bribe',
            type: 'address',
          },
        ],
        internalType: 'struct RewardAPI.ToCLaim[]',
        name: '_toClaim',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: '_bribes',
        type: 'address[]',
      },
      {
        internalType: 'address[][]',
        name: '_tokens',
        type: 'address[][]',
      },
    ],
    name: 'getAvailableRewards',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'bribe',
            type: 'address',
          },
          {
            internalType: 'address[]',
            name: 'tokens',
            type: 'address[]',
          },
          {
            internalType: 'string[]',
            name: 'symbols',
            type: 'string[]',
          },
          {
            internalType: 'uint256[]',
            name: 'decimals',
            type: 'uint256[]',
          },
          {
            internalType: 'uint256[]',
            name: 'amounts',
            type: 'uint256[]',
          },
        ],
        internalType: 'struct RewardAPI.Claimable[]',
        name: 'toCLaim',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'pairs',
        type: 'address[]',
      },
    ],
    name: 'getExpectedClaimForNextEpoch',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address[]',
                name: 'tokens',
                type: 'address[]',
              },
              {
                internalType: 'string[]',
                name: 'symbols',
                type: 'string[]',
              },
              {
                internalType: 'uint256[]',
                name: 'decimals',
                type: 'uint256[]',
              },
              {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
              },
              {
                internalType: 'address',
                name: 'bribe',
                type: 'address',
              },
            ],
            internalType: 'struct RewardAPI.Bribes[]',
            name: 'bribes',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct RewardAPI.Rewards[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pair',
        type: 'address',
      },
    ],
    name: 'getPairBribe',
    outputs: [
      {
        components: [
          {
            internalType: 'address[]',
            name: 'tokens',
            type: 'address[]',
          },
          {
            internalType: 'string[]',
            name: 'symbols',
            type: 'string[]',
          },
          {
            internalType: 'uint256[]',
            name: 'decimals',
            type: 'uint256[]',
          },
          {
            internalType: 'uint256[]',
            name: 'amounts',
            type: 'uint256[]',
          },
          {
            internalType: 'address',
            name: 'bribe',
            type: 'address',
          },
        ],
        internalType: 'struct RewardAPI.Bribes[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_voter',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'notReward',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pairFactory',
    outputs: [
      {
        internalType: 'contract IPairFactory',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
    ],
    name: 'removeNotReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_voter',
        type: 'address',
      },
    ],
    name: 'setVoter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'underlyingToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'voter',
    outputs: [
      {
        internalType: 'contract IVoterV3',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export default abi
