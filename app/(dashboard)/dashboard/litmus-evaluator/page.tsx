"use client";

import dynamic from "next/dynamic";

const LitmusEvaluatorDashboard = dynamic(
  () =>
    import("@/components/litmus-evaluator/litmus-dashboard").then(
      (m) => m.LitmusEvaluatorDashboard
    ),
  { ssr: false }
);

export default function LitmusEvaluatorPage() {
  return <LitmusEvaluatorDashboard />;
}
