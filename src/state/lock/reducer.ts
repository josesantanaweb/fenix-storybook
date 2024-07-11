import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { VeNFTInfo, lockState } from './types'
import { Address } from 'viem'
import { getUserVeFNXLockPositions } from '../../library/web3/LockManagment'
import { LockElement } from '@/src/library/structures/lock/LockElement'

const initialState: lockState = {
  appState: '',
  positions: [],
  veNFTInfo: {
    decimals: 0,
    voted: false,
    attachments: 0n,
    id: 0n,
    amount: 0n,
    voting_amount: 0n,
    lockEnd: 0n,
    vote_ts: 0,
    votes: [],
    account: '0x',
    token: '0x',
    tokenSymbol: '',
    tokenDecimals: 0,
  },
}

const lock = createSlice({
  name: 'venftInfo',
  initialState,
  reducers: {
    setLock: (state, action: PayloadAction<VeNFTInfo>) => {
      state.veNFTInfo = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNftsAsync.pending, (state) => {
        state.appState = 'loading'
      })
      .addCase(fetchNftsAsync.fulfilled, (state, action: PayloadAction<LockElement[]>) => {
        state.appState = 'success'
        state.positions = action.payload
      })
      .addCase(fetchNftsAsync.rejected, (state) => {
        state.appState = 'error'
      })
  },
})

export const fetchNftsAsync = createAsyncThunk(
  'venftInfo/fetchNftsAsync',
  async ({ address, chainId }: { address: Address; chainId: number }) => {
    const resp = await getUserVeFNXLockPositions(address, chainId)
    return resp
  }
)

export const { setLock } = lock.actions

export default lock.reducer
