import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface CentreState {
    _id: string;
    name: string;
    location: string;
    suffix: string;
    status: boolean;
  }

//   const initialState : CentreState = {
//     centers: []
//   }

const centerSlice = createSlice({
  name: 'center',
  initialState: {centers: []},
  reducers: {
    getCentresData : (state, action) => {
        console.log("fff",action.payload)
        state.centers = action.payload
    }
  },
})

export const { getCentresData } = centerSlice.actions
export default centerSlice.reducer