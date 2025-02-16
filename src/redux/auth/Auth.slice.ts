import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createReducerBuilder } from "@utils/reduxToolkit";
import { Toaster } from "@components/toast/Toaster";

import { AuthProp, initialState } from "./Auth.initialState";
import { updateUserAccountAction } from "./Auth.actions";

// this is for creating reducer for update user account action
const reducerBuilder = createReducerBuilder<AuthProp>();

// this is for handling pending state
const handlePending = (state: AuthProp) => {
  state.isLoader = true;
};

// this is for handling fulfilled state
const handleFulfilled = (
  state: AuthProp,
  payload: any,
  successMessage: string,
) => {
  state.isLoader = false;
  if (payload?.data) {
    state.userData = { ...payload.data.data[0] };
    Toaster({ message: successMessage, type: "success" });
  }
};

// this is for handling rejected state
const handleRejected = (state: AuthProp, payload: any) => {
  state.isLoader = false;
  console.error("Update user failed", payload);
  Toaster({ message: payload?.data?.message, type: "warning" });
};

// this is for creating reducer for update user account action
const updateUserReducer = reducerBuilder(updateUserAccountAction, {
  pending: handlePending,
  fulfilled: (state, { payload }) =>
    handleFulfilled(state, payload, payload?.data?.message),
  rejected: handleRejected,
});

// this is for creating slice for auth
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<any>) => {
      return { ...action.payload };
    },
    setLoaderStart: (state, { payload }: any) => {
      state.isLoader = payload;
    },
    logout: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    updateUserReducer(builder);
  },
});

export const { setAuthData, setLoaderStart, logout } = authSlice.actions;

export default authSlice.reducer;
