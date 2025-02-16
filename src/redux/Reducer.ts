import { combineReducers, Reducer as ReduxReducer } from "@reduxjs/toolkit";

import AuthSlice from "./auth/Auth.slice";
import CommonSlice from "./common/Common.slice";
import { tagsApi } from "./api/toolkitQuery";

export const rootReducer: ReduxReducer = combineReducers({
  auth: AuthSlice,
  common: CommonSlice,
  [tagsApi.reducerPath]: tagsApi.reducer, // Include RTK Query reducer
}) as ReduxReducer;
