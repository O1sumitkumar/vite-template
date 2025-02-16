import type { AppDispatch } from "./Store";

import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";

import * as authSliceAction from "./auth/Auth.slice";
import * as authModuleActions from "./auth/Auth.actions";
import * as commonSliceAction from "./common/Common.slice";
// Custom hook to bind action creators to the dispatch function
export const useActions = () => {
  // Get the dispatch function from the Redux store
  const dispatch = useDispatch<AppDispatch>();

  // Bind the setAuthData action creator to the dispatch function
  // This allows you to directly call setAuthData without manually dispatching it in each component
  return bindActionCreators(
    {
      ...authSliceAction,
      ...authModuleActions,
      ...commonSliceAction,
    },
    dispatch,
  );
};
