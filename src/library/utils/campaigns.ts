import { blast } from 'viem/chains'

type PointStackType =
  | 'fenix-ring'
  | 'fdao'
  | 'kelp-miles'
  | 'eigen-layer'
  | 'turtle-club'
  | 'fxs'
  | 'ether-fi'
  | 'blast-gold'
  | 'blast'
export interface Campaign {
  pairAddress: string
  multiplier: string
  pointStack?: PointStackType[]
  blastGoldAmount?: string
}
export const totalCampaigns: Campaign[] = [
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0x1d74611f3ef04e7252f7651526711a937aa1f75e',
    pointStack: ['blast', 'fenix-ring', 'turtle-club'],
    blastGoldAmount: '53228',
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0xc066a3e5d7c22bd3beaf74d4c0925520b455bb6f',
    pointStack: ['blast', 'fenix-ring'],
    blastGoldAmount: '375',
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0x3bafe103742da10a4fece8fc5e800df07d645439',
    pointStack: ['blast', 'fenix-ring'],
    blastGoldAmount: '5750',
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0xe53b1da56f90c9529f2db1bb8711c3f1cc6f03bd',
    pointStack: ['blast', 'fenix-ring', 'kelp-miles', 'eigen-layer'],
    blastGoldAmount: '5750',
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0x635512a1333ad0822f5ba4fd6479daa1df8b77e1',
    pointStack: ['blast', 'fenix-ring'],
    blastGoldAmount: '5000',
  },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0xbcf0265f4bd3cb293b709fab0bf5c83c7eeb6b74',
  //   pointStack: ['fenix-ring'],
  // },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0x1eba6f6cfdb86e965040bf9e75d3ded9a3fd22a5',
    pointStack: ['blast', 'fenix-ring', 'fxs'],
    blastGoldAmount: '5000',
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0x46f2aa2aa7d31ddd237d620e52a33a8d5af2a5ab',
    pointStack: ['blast', 'fenix-ring'],
    blastGoldAmount: '1625',
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0x9304ba542df9bc61dd1c97c073ed35f81cab6149',
    pointStack: ['blast', 'fenix-ring', 'ether-fi', 'eigen-layer'],
    blastGoldAmount: '5750',
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0x6a1de1841c5c3712e3bc7c75ce3d57dedec6915f',
    pointStack: ['blast', 'fenix-ring'],
    blastGoldAmount: '4000',
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0x28d7de5e9592cbd951dc3b22325fdfa89972f6db',
    pointStack: ['blast', 'fenix-ring', 'fxs'],
    blastGoldAmount: '500',
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0xd0cd894c605a9eedacbc0fa9bd8440627a5d37b1',
    pointStack: ['blast', 'fenix-ring'],
    blastGoldAmount: '800',
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0x117106000ceb709ba3ec885027d111463204d6b6',
    pointStack: ['blast', 'fenix-ring'],
    blastGoldAmount: '750',
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0xcf68cdfea89f9e6964d4c2bd8a42eba5da9f945d',
    pointStack: ['blast', 'fenix-ring'],
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0x886369748d1d66747b8f51ab38de00dea13f0101',
    pointStack: ['blast', 'fenix-ring', 'fdao'],
    blastGoldAmount: '938',
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0xd49ad1dd6c5eae53abdafeaed1866330c42ccae4',
    pointStack: ['blast', 'fenix-ring'],
    blastGoldAmount: '3500',
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0xcbf7b47e9da345812e3bd732e3ee369a7203b5ae',
    pointStack: ['blast', 'fenix-ring'],
    blastGoldAmount: '500',
  },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0x1fe38ea700f0b8b013be01e58b02b1da3956379a',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0x86d1da56fc79accc0daf76ca75668a4d98cb90a7',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0xce274e4ae83baadd1d3b88e1ed24886e05aca345',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0xf2bb3403e80adc9272c43b386c76e54d5bb604a5',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0xf63e385e854e082c78df0627b411fdb78877faa1',
  //   pointStack: ['fenix-ring'],
  // },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0x8e57e61b7524a2f56fd01bbfe5de9bb96ed186b4',
    pointStack: ['blast', 'fenix-ring'],
    blastGoldAmount: '1750',
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0x8921e94efaca5f39a3a1f7b62e645518082d6a88',
    pointStack: ['blast', 'fenix-ring'],
    blastGoldAmount: '500',
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0xc8252c4f9136209ec47534bf1c0781307ec9a86f',
    pointStack: ['blast', 'fenix-ring'],
    blastGoldAmount: '0',
  },
  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0x4c577f4873061003d6c83eaac20e24397ff5b89b',
    pointStack: ['blast', 'fenix-ring'],
    blastGoldAmount: '0',
  },

  {
    multiplier: '🔥 Rings Boost',
    pairAddress: '0x7f7d282846cb4806f9121b0b5ef61afaae64f257',
    pointStack: ['blast', 'fenix-ring'],
    blastGoldAmount: '0',
  },

  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0xe3fac59382987466d7f812df56c50739b99a907a',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0x24b711e1d32e28a143e1a9cfdfe03a39d1acc771',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0x4a28f50f15efedf44af0d376fdc2e319fa8ccef8',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0x5083e43b015296c75de0af519917c035309e80e4',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0x90f2eaf2db0d8400c9f565aa3c139ddffbe857d0',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0x3acde0b7f51703c2fbf0a382f831123560b742b9',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0x28abbaadfacd46196217c23bc6402a0a458973a5',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0x7113c00b5275b0b9c16686e5ac1164978b505c5d',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0xbad7a5de96b7df589252ced73426d4b59f90b466',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0x3a8fa7bdbb3bd2a523796b145e5dd23b45019dbe',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0x21d5d5998c3d0feea70b5980fdac9dd6b8a12761',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0xb50a80bba0ff07f4bc3434c593e86663fe05abe2',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0x54bb102e85ee68a234fa06ece299346941d68d07',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0x9508122abdd654b68c7dbf5bdba329b852e4a512',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0x047d5d8911d18aa5e64e666e53af2b47b46ab363',
  //   pointStack: ['fenix-ring'],
  // },
  // {
  //   multiplier: '🔥 Rings Boost',
  //   pairAddress: '0xc1fd5e0b3388c66dfad458ded01dcddae68cb03e',
  //   pointStack: ['fenix-ring'],
  // },
]

export const getPointsDistributionTargetTimestamps = () => {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()
  const day = now.getUTCDate()
  // This is the hours where the cron that updates the points runs
  const times = [
    '19:00:00', // 05:00 PM UTC
  ]

  return times.map((time) => new Date(Date.UTC(year, month, day, ...time.split(':').map(Number))))
}
