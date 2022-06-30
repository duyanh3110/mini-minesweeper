import { configureStore } from "@reduxjs/toolkit";
import gameSlice from "./gameSlice";
import watchSlice from "./watchSlice";

const store = configureStore({
  reducer: {
    game: gameSlice.reducer,
    watch: watchSlice.reducer,
  },
});

export default store;
