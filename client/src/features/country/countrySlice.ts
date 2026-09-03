import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Country {
    country: string
}

const initialState: Country = { country: 'ecuador'}

const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    countrySelected(state, action: PayloadAction<Country>){
      state.country = action.payload.country
    }
  }
})


// Export the auto-generated action creator with the same name
export const { countrySelected } = countrySlice.actions

// Export the generated reducer function
export default countrySlice.reducer