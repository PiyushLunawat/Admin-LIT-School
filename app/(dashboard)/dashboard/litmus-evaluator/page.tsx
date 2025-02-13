"use client"

import { LitmusEvaluatorDashboard } from "@/components/litmus-evaluator/litmus-dashboard";
import { Suspense } from "react";

export default function LitmusEvaluatorPage() {
  return (
    <Suspense >
      <LitmusEvaluatorDashboard />
    </Suspense>
  );
}