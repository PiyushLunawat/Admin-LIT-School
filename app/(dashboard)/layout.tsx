"use client";

import dynamic from "next/dynamic";

const Sidebar = dynamic(
  () => import("@/components/dashboard/sidebar").then((m) => m.Sidebar),
  { ssr: false }
);

const Header = dynamic(
  () => import("@/components/dashboard/header").then((m) => m.Header),
  { ssr: false }
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen relative">
      <div className="h-full flex">
        <Sidebar />
        <main className="flex-1 h-full">
          <Header />
          <div className="h-[calc(100vh-4rem)] overflow-y-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
