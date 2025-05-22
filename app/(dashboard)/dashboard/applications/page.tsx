"use client";

import dynamic from "next/dynamic";

const ApplicationDashboard = dynamic(
  () =>
    import("@/components/applications/application-dashboard").then(
      (m) => m.ApplicationDashboard
    ),
  { ssr: false }
);

export default function ApplicationsPage() {
  return <ApplicationDashboard />;
}
