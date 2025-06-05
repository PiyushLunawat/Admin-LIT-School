// app/ClientProvider.tsx
"use client";
import { useEffect } from "react";
import { RegisterInterceptor } from "./api/interceptor";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    RegisterInterceptor(); // Register fetch interceptor once
  }, []);

  return <>{children}</>;
}
