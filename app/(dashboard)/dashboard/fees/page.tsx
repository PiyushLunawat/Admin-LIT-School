"use client";
import dynamic from "next/dynamic";

const FeeDashboard = dynamic(
  () => import("@/components/fees/fee-dashboard").then((m) => m.FeeDashboard),
  { ssr: false }
);

export default function FeePage() {
  return <FeeDashboard />;
}
