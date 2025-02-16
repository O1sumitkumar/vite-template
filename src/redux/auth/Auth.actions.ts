import AuthApi from "@api/auth/AuthApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateUserAccountAction = createAsyncThunk(
  "UPDATE_USER_ACCOUNT",
  async (payload: any, thunkApi) => {
    try {
      const response = await AuthApi.updateUserAccount(payload);

      if (response?.status === 200) {
        return thunkApi.fulfillWithValue(response);
      } else {
        return thunkApi.rejectWithValue(response);
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);
