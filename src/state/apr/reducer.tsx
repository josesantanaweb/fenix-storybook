import { positions } from '@/src/components/Dashboard/MyStrategies/Strategy'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type aprState = {
  apr: positions[] | ''
}

const initialState: aprState = {
  apr: '',
}

const apr = createSlice({
  name: 'apr',
  initialState,
  reducers: {
    setApr: (state, action: PayloadAction<positions[]>) => {
      state.apr = action.payload
    },
  },
})

export const { setApr } = apr.actions

export default apr.reducer
