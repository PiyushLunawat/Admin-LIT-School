"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";

import { RegisterInterceptor } from "@/app/api/interceptor";
import { makeStore, Store } from "@/lib/store/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<Store>();

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    RegisterInterceptor(); // Initialize fetch interceptor
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
