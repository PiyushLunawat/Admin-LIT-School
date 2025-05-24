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
    <div className="flex flex-col sm:flex-row border-b ">
      
      {/* Sidebar: sticky bottom on mobile */}
      <div className="order-2 sm:order-1 sm:static fixed bottom-0 w-full sm:w-auto z-10">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 h-[calc(100vh-52px)] overf sm:h-full order-1 sm:order-2">
        <Header />
        <div className="h-[calc(100vh-115px)] sm:h-[calc(100vh-4rem)] overflow-y-auto">{children}</div>
      </main>
    </div>
  </div>

  );
}
