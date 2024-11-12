import { configureStore } from '@reduxjs/toolkit'
import cohortSlice from '../features/cohort/cohortSlice'
import centerSlice from '../features/center/centerSlice'

export const makeStore = () => {
  return configureStore({
    reducer: { center: centerSlice},
  })
}

// Infer the type of makeStore
export type Store = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<Store['getState']>
export type AppDispatch = Store['dispatch']