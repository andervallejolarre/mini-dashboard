import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { ProductionPoint } from '../../../../server/src/types/faostatTypes'
import type { RootState } from '../../store'

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


export const fetchProduction = createAsyncThunk(
  'production/fetch',
  async (_, { getState }) => {
    const { country } = (getState() as RootState).country
    const res = await axios.get(`/api/production/${country}`)
    return res.data as ProductionPoint[]
  }
)

const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {},
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
