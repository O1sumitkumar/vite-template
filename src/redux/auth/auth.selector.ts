import { RootState } from "@redux/Store";
import { createDraftSafeSelector } from "@reduxjs/toolkit";

const selectedReducer = (state: RootState) => state.auth;
const selectedCommonReducer = (state: RootState) => state.common;

// this is selector for auth token
export const selectAuthToken = createDraftSafeSelector(
  selectedReducer,
  (authState) => authState.token,
);

// this is selector for user role
export const selectCurrentRole = createDraftSafeSelector(
  selectedReducer,
  (AuthState) => AuthState.role,
);

// this is selector for user logged in
export const userLoggedIn = createDraftSafeSelector(
  selectedReducer,
  (AuthState) => AuthState.userLoggedIn,
);

// this is selector for user data
export const selectUserData = createDraftSafeSelector(
  selectedReducer,
  (authState) => authState.userData,
);

// this is selector for action loader
export const selectActionLoader = createDraftSafeSelector(
  selectedReducer,
  (authState) => authState.isLoader,
);

// this is selector for country list
export const selectCountryList = createDraftSafeSelector(
  selectedCommonReducer,
  (commonState) => commonState.countries,
);
