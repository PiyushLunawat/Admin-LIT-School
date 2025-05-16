"use client";

import { FeeDashboard } from "@/components/fees/fee-dashboard";
import { Suspense } from "react";

export default function FeePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeeDashboard />
    </Suspense>
  );
}
