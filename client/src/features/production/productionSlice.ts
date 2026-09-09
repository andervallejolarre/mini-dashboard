import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { ProductionPoint } from '../../../../server/src/types/faostatTypes'
import type { RootState } from '../../store'

//types with a good format when using thunks
export interface ProductionState {
  production: ProductionPoint[]
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

const initialState : ProductionState = {
    production: [],
    status: 'idle',
    error: null
}

//Our asyncthunk. It can be called wherever
export const fetchProduction = createAsyncThunk(
  'production/fetch',
  async (_, { getState }) => {
    //we need our countrySlice state from the store
    const { country } = (getState() as RootState).country
    const res = await axios.get(`/api/production/${country}`)
    //we now the format of our response 
    return res.data as ProductionPoint[]
  }
)

const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {},
  //thunk functions are stablished as extraReducers. With 3 status
  extraReducers: builder => {
    builder
      .addCase(fetchProduction.pending, state => {
        state.status = 'pending'
        state.error = null
      })
      .addCase(fetchProduction.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.production = action.payload
      })
      .addCase(fetchProduction.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unknown error'
      })
  }
})

export default productionSlice.reducer
