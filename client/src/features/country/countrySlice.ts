import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

//our state type
export interface Country {
  country: string
}

const initialState: Country = { country: 'ecuador' }

const countrySlice = createSlice({
  //This reducer will be stablished in our store
  name: 'country',
  initialState,
  reducers: {
    //Our only reducer. It's going to be exported next
    countrySelected(state, action: PayloadAction<Country>) {
      state.country = action.payload.country
    }
  }
})

// Export the auto-generated action creator with the same name
export const { countrySelected } = countrySlice.actions

// Export the generated reducer function
export default countrySlice.reducer