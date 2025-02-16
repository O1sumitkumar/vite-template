import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "@redux/Store";

const selectedCommonReducer = (state: RootState) => state;

export const selectTheme = createDraftSafeSelector(
  selectedCommonReducer,
  (commonState) => commonState,
);

export const updateData = createDraftSafeSelector(
  selectedCommonReducer,
  (commonState) => commonState,
);

export const selectIsFetchHistory = createDraftSafeSelector(
  selectedCommonReducer,
  (commonState) => commonState?.common?.isFetchHistory,
);
