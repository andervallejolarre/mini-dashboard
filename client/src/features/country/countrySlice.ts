import { createSlice } from '@reduxjs/toolkit'

export interface Country {
    country: string
}

const initialState: Country = { country: 'ecuador'}

const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {}
})

// Export the generated reducer function
export default countrySlice.reducer