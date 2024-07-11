import { ApiState } from '@/src/library/types/connection'
import { createReducer } from '@reduxjs/toolkit'
import { getAllPools, getGammaVaults, getLiquidityV2Pairs, getRingsCampaigns } from './thunks'
import { LiquidityState, V2PairId, v2FactoryData, v3FactoryData } from './types'
import { ClmProvider } from '@/src/library/types/liquidity'
import {
  updateToken0,
  updateToken0TypedValue,
  updateToken1,
  updateToken1TypedValue,
  updateClmProvider,
} from './actions'
import { getLiquidityTableElements } from './thunks'
import { V2PairInfo, V3PairInfo } from './types'
import { GET_POSITIONV3_USER, GET_V2_PAIRS, GET_V3_ALGEBRA_DATA } from '@/src/library/apollo/queries/LIQUIDITY'
import { algebra_client } from '@/src/library/apollo/client'
import { blastClient, getIchiClient } from '@/src/library/apollo/client/protocolCoreClient'
import { Address } from 'viem'
import { positions } from '@/src/components/Dashboard/MyStrategies/Strategy'
import {
  GET_UNISWAP_FACTORY_DATA,
  GET_V2_PAIR_ID,
  GET_V3_FACTORY_DATA,
  NATIVE_PRICE,
} from '@/src/library/apollo/queries/global'
import { POOL_DAY_DATA } from '@/src/library/apollo/queries/pools'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ALGEBRA_SUBGRAPH } from '@/src/library/constants/addresses'
import { FALLBACK_CHAIN_ID } from '@/src/library/constants/chains'
import moment from 'moment'
import { IchiVault, SupportedChainId, SupportedDex } from '@ichidao/ichi-vaults-sdk/dist/src/types'
import { GET_ICHI_VAULTS_BY_IDS } from '@/src/library/apollo/queries/ichi'

export const initialState: LiquidityState = {
  v2Pairs: {
    state: ApiState.LOADING,
    tablestate: ApiState.LOADING,
    data: [],
    tableData: [],
  },

  pools: {
    state: ApiState.LOADING,
    data: [],
  },
  token0: process.env.NEXT_PUBLIC_DEFAULT_TOKEN_0_ADDRESS as Address,
  token0TypedValue: '',
  token1: process.env.NEXT_PUBLIC_DEFAULT_TOKEN_1_ADDRESS as Address,
  token1TypedValue: '',
  clmProvider: ClmProvider.ICHI,

  gammaVaults: {
    data: [],
    state: ApiState.LOADING,
  },
  ringsCampaigns: {
    state: ApiState.LOADING,
    data: null,
  },
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateToken0, (state, action) => {
      state.token0 = action.payload as `0x${string}`
    })
    .addCase(updateToken0TypedValue, (state, action) => {
      state.token0TypedValue = action.payload
    })
    .addCase(updateToken1, (state, action) => {
      state.token1 = action.payload as `0x${string}`
    })
    .addCase(updateToken1TypedValue, (state, action) => {
      state.token1TypedValue = action.payload
    })
    .addCase(updateClmProvider, (state, action) => {
      state.clmProvider = action.payload
    })
    .addCase(getAllPools.pending, (state) => {
      state.pools.state = ApiState.LOADING
    })
    .addCase(getAllPools.fulfilled, (state, action) => {
      state.pools.state = ApiState.SUCCESS
      state.pools.data = action.payload
    })
    .addCase(getAllPools.rejected, (state) => {
      state.pools.state = ApiState.ERROR
      console.error('Error fetching pools')
    })
    .addCase(getLiquidityV2Pairs.pending, (state) => {
      state.v2Pairs.state = ApiState.LOADING
    })
    .addCase(getLiquidityV2Pairs.fulfilled, (state, action) => {
      state.v2Pairs.state = ApiState.LOADING
      state.v2Pairs.data = action.payload
      state.v2Pairs.state = ApiState.SUCCESS
    })
    .addCase(getLiquidityV2Pairs.rejected, (state) => {
      state.v2Pairs.state = ApiState.ERROR
    })

    .addCase(getLiquidityTableElements.pending, (state) => {
      state.v2Pairs.tablestate = ApiState.LOADING
    })
    .addCase(getLiquidityTableElements.fulfilled, (state, action) => {
      state.v2Pairs.tablestate = ApiState.LOADING
      state.v2Pairs.tableData = action.payload
      state.v2Pairs.tablestate = ApiState.SUCCESS
    })
    .addCase(getLiquidityTableElements.rejected, (state) => {
      state.v2Pairs.tablestate = ApiState.ERROR
    })
    .addCase(getGammaVaults.pending, (state) => {
      state.gammaVaults = { data: [], state: ApiState.LOADING }
    })
    .addCase(getGammaVaults.fulfilled, (state, action) => {
      state.gammaVaults = { data: action.payload, state: ApiState.SUCCESS }
    })
    .addCase(getGammaVaults.rejected, (state) => {
      state.gammaVaults = { data: [], state: ApiState.ERROR }
    })
    .addCase(getRingsCampaigns.pending, (state) => {
      state.ringsCampaigns = { data: null, state: ApiState.LOADING }
    })
    .addCase(getRingsCampaigns.fulfilled, (state, action) => {
      state.ringsCampaigns = { data: action.payload, state: ApiState.SUCCESS }
    })
    .addCase(getRingsCampaigns.rejected, (state) => {
      state.ringsCampaigns = { data: null, state: ApiState.ERROR }
    })
})

// Function to fetch v3 algebra pool data
export const fetchPoolData = async (chainId: number) => {
  try {
    const algebra_client = new ApolloClient({
      uri: chainId ? ALGEBRA_SUBGRAPH[chainId] : ALGEBRA_SUBGRAPH[FALLBACK_CHAIN_ID],
      cache: new InMemoryCache(),
    })
    const { data } = await algebra_client.query({
      query: GET_V3_ALGEBRA_DATA,
    })
    // Data is available in `data.pools`
    return data.pools as V3PairInfo[]
  } catch (error) {
    console.error('Error fetching pool data:', error)
    return []
  }
}

// Function to fetch v3 algebra positions of user data
export const fetchV3Positions = async (user: Address) => {
  try {
    const { data } = await algebra_client.query({
      query: GET_POSITIONV3_USER,
      variables: { owner: user }, // Pass the user variable as owner
    })
    // Data is available in `data.positions`
    return data.positions as positions[]
  } catch (error) {
    console.error('Error fetching positions:', error)
    return []
  }
}

// Function to fetch v2 algebra pool data
export const fetchv2Factories = async () => {
  try {
    const { data } = await blastClient.query({
      query: GET_UNISWAP_FACTORY_DATA,
    })
    // Data is available in `data.pools`
    return data.uniswapFactories as v2FactoryData[]
  } catch (error) {
    console.error('Error fetching fetchv2Factories data:', error)
    return []
  }
}

// Function to fetch v2 algebra pool data
export const fetchv3Factories = async () => {
  try {
    const { data } = await algebra_client.query({
      query: GET_V3_FACTORY_DATA,
    })
    // Data is available in `data.pools`
    return data.factories as v3FactoryData[]
  } catch (error) {
    console.error('Error fetching fetchv3Factories data:', error)
    return []
  }
}

// Function to fetch v2 algebra pool data
export const fetchv2PoolData = async () => {
  try {
    const { data } = await blastClient.query({
      query: GET_V2_PAIRS,
    })
    // Data is available in `data.pools`
    return data.pairs as V2PairInfo[]
  } catch (error) {
    console.error('Error fetching pool data:', error)
    return []
  }
}

// Function to fetch v2 algebra pool data
export const fetchv2PairId = async (token0Id: any, token1Id: any, isStable: Boolean) => {
  try {
    const { data } = await blastClient.query({
      query: GET_V2_PAIR_ID,
      variables: { token0Id, token1Id, isStable }, // Pass the user variable as owner
    })
    //
    // // Data is available in `data.pools`
    //
    return data.pairs as V2PairId[]
  } catch (error) {
    console.error('Error fetching pool data:', error)
    return []
  }
}
// Function to native price of user data
export const fetchNativePrice = async () => {
  try {
    const { data } = await algebra_client.query({
      query: NATIVE_PRICE,
      fetchPolicy: 'cache-first',
    })
    // Data is available in `data.positions`
    //
    return data.bundles[0].maticPriceUSD as string
  } catch (error) {
    console.error('Error fetching positions:', error)
    return []
  }
}

export const fetchV3PoolDayData = async () => {
  try {
    const { data } = await algebra_client.query({
      query: POOL_DAY_DATA,
      variables: { from: Math.round(+moment().add(-1, 'week') / 1000) },
    })
    // Data is available in `data.positions`
    return data
  } catch (error) {
    console.error('Error fetching positions:', error)
    return []
  }
}

export async function getIchiVaultsDataByIds(
  chainName: string,
  dex: SupportedDex,
  ids: string[]
): Promise<IchiVault[]> {
  try {
    const { data } = await getIchiClient(chainName, dex).query({
      query: GET_ICHI_VAULTS_BY_IDS,
      variables: { ids },
    })
    return data.ichiVaults
  } catch (error) {
    console.error('Error fetching vaults data:', error)
    return []
  }
}
