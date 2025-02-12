"use client";
import { ApplicationDashboard } from "@/components/applications/application-dashboard";
import { Suspense } from "react";

export default function ApplicationsPage() {
  return (

    <Suspense fallback={<div>Loading...</div>}>
      <ApplicationDashboard />
    </Suspense>
  );
}