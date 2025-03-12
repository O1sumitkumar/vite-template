// this will be the createAsyncThunk function which directly update auth slice

import { createAsyncThunk } from "@reduxjs/toolkit";

import { Register } from "@/services/auth/auth.api";
import { RegisterProps } from "@/interface/auth.interface";

// 🟢 1. Create the registerUser thunk
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterProps, { rejectWithValue }) => {
    try {
      const response = await Register(data);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterProps, { rejectWithValue }) => {
    try {
      const response = await Register(data);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 🟢 2. Create the updateUserProfile thunk
// export const updateUserProfile = createAsyncThunk(
//   "auth/updateProfile",
//   async (data: UpdateProfileProps, { rejectWithValue }) => {
//     try {
//       const response = await UpdateProfile(data);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );
