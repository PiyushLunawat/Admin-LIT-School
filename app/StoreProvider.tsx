"use client";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, Store } from "../lib/store/store";
import { RegisterInterceptor } from "./api/interceptor";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<Store>();
  
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    RegisterInterceptor(); // Initialize fetch interceptor
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
