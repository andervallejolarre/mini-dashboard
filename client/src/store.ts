import { configureStore } from '@reduxjs/toolkit'
import countryReducer from './features/country/countrySlice'
import productionReducer from './features/production/productionSlice'

export const store = configureStore({
  reducer: {
    //we have two reducers available
    country: countryReducer,
    production: productionReducer
  }
})

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch
// Same for the `RootState` type
export type RootState = ReturnType<typeof store.getState>