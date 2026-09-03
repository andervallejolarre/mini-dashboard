import { createSlice } from '@reduxjs/toolkit'

export interface Country {
    year: number
    value: number
}

const initialState: Country[] = [
  { year: 2025, value: 238},
  { year: 2024, value: 241}
]

const countrySlice = createSlice({
  name: 'production',
  initialState,
  reducers: {}
})

// Export the generated reducer function
export default countrySlice.reducer