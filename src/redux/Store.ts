import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import logger from "redux-logger";
import storage from "redux-persist/lib/storage";

import { rootReducer } from "./Reducer";
import { tagsApi } from "./api/toolkitQuery";

const persistConfig = {
  key: "auth",
  storage: storage,
  whitelist: ["auth", "common"],
  blacklist: [tagsApi.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: false,
    })
      .concat(logger)
      .concat(tagsApi.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export { store, persistor };
