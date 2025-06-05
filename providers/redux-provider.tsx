"use client";

import type React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { RegisterInterceptor } from "@/app/api/interceptor";
import { useEffect } from "react";
import { persistor, store } from "../lib/store/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    RegisterInterceptor();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
