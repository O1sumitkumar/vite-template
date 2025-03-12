import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AuthProp, initialState } from "./Auth.initialState";
import { loginUser, registerUser } from "./auth.thunk";

// 🔹 3. Common handlers for both actions
const handlePending = (state: AuthProp) => {
  state.isLoader = true;
};

const handleFulfilled = (
  state: AuthProp,
  { payload }: PayloadAction<any>,
  successMessage?: string,
) => {
  state.isLoader = false;
  if (payload?.data) {
    state.userData = { ...payload.data };
    // Toaster({ message: successMessage || "Success!", type: "success" });
  }
};

const handleRejected = (state: AuthProp, { payload }: PayloadAction<any>) => {
  state.isLoader = false;
  console.error("Operation failed", payload);
  // Toaster({ message: payload?.message || "An error occurred", type: "warning" });
};

// 🟢 4. Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<AuthProp>) => {
      return { ...action.payload };
    },
    setLoaderStart: (state, action: PayloadAction<boolean>) => {
      state.isLoader = action.payload;
    },
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(registerUser.pending, handlePending)
    //   .addCase(registerUser.fulfilled, (state, action) =>
    //     handleFulfilled(state, action, "Registration successful!")
    //   )
    //   .addCase(registerUser.rejected, handleRejected)
    //   .addCase(loginUser.pending, handlePending)
    //   .addCase(loginUser.fulfilled, (state, action) =>
    //     handleFulfilled(state, action, "Profile updated successfully!")
    //   )
    //   .addCase(loginUser.rejected, handleRejected);
  },
});

// 🟢 5. Export actions & reducer
export const { setAuthData, setLoaderStart, logout } = authSlice.actions;
export default authSlice.reducer;
