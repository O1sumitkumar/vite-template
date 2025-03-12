import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";

import { persistor, store } from "@/redux/Store.ts";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Provider>
            <App />
          </Provider>
        </PersistGate>
      </ReduxProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
