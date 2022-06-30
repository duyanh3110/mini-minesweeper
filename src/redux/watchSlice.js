import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  time: 0,
  isRunning: false,
};

const watchSlice = createSlice({
  name: "watch",
  initialState,
  reducers: {
    timeChange: (state, action) => {
      state.time = action.payload;
    },
    isRunningChange: (state, action) => {
      state.isRunning = action.payload;
    },
  },
});

export const { timeChange, isRunningChange } = watchSlice.actions;
export default watchSlice;
