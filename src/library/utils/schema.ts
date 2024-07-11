import { z } from 'zod'

export const EventTypeSchema = z.enum(['ADD_LIQUIDITY', 'SWAP'])
export const ethereumAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')
export const transactionHashSchema = z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash')
