import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface
interface CommonState {
  theme: string;
  isFetchHistory: boolean;
}

// initial state
const initialState: CommonState = {
  theme: "system",
  isFetchHistory: false,
};

// create slice
const commonSlice = createSlice({
  name: "common",
  initialState,
  // only include reducers which are handel by internal state
  reducers: {
    toggleTheme: (state, action: PayloadAction<CommonState["theme"]>) => {
      state.theme = action.payload;
    },
    setIsFetchHistory: (state, action: PayloadAction<boolean>) => {
      state.isFetchHistory = action.payload;
    },
  },
});

// export actions
export const { toggleTheme, setIsFetchHistory } = commonSlice.actions;

// export reducer
export default commonSlice.reducer;
