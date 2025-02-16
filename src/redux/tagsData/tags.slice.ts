import { createSlice } from "@reduxjs/toolkit";

import { tagsApi } from "../api/toolkitQuery";

import { tagInitialState as initialState } from "./tags.initialState";

const tagDataSlice = createSlice({
  name: "tagsData",
  initialState,
  reducers: {
    setTagsData: (state, action) => {
      state.tags = action.payload;
    },
  },
  // Add extra reducers to handle loading states if needed
  extraReducers: (builder) => {
    builder.addMatcher(
      tagsApi.endpoints.getTags.matchFulfilled,
      (state, { payload }) => {
        state.tags = payload;
      },
    );
  },
});

export const { setTagsData } = tagDataSlice.actions;
export default tagDataSlice.reducer;
