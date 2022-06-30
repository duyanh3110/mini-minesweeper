import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../constant";

const initialState = {
  level: "",
  isWinning: false,
  minesLocation: [],
  isReset: false,
};

export const fetchMinesLocation = createAsyncThunk(
  "game/fetchMinesLocation",
  async (params, thunkAPI) => {
    const response = await axios.get(
      `${API_URL}/getMines?size=${params.size}&mines=${params.mines}`
    );
    return response.data;
  }
);

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    levelChange: (state, action) => {
      state.level = action.payload;
    },
    isWinningChange: (state, action) => {
      state.isWinning = action.payload;
    },
    isResetChange: (state, action) => {
      state.isReset = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMinesLocation.fulfilled, (state, action) => {
      state.minesLocation = action.payload.data;
    });
  },
});

export const { levelChange, isWinningChange, isResetChange } =
  gameSlice.actions;
export default gameSlice;
