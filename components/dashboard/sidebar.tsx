"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils/utils";
import {
  BookOpen,
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  School,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Programs",
    icon: School,
    href: "/dashboard/programs",
  },
  {
    label: "Centres",
    icon: Building2,
    href: "/dashboard/centres",
  },
  {
    label: "Cohorts",
    icon: BookOpen,
    href: "/dashboard/cohorts",
  },
  {
    label: "Students",
    icon: Users,
    href: "/dashboard/students",
  },
  // {
  //   label: "Applications",
  //   icon: ClipboardList,
  //   href: "/dashboard/applications",
  // },
  // {
  //   label: "Interviews",
  //   icon: Calendar,
  //   href: "/dashboard/interviews",
  // },
  // {
  //   label: "LITMUS Test",
  //   icon: GraduationCap,
  //   href: "/dashboard/litmus-evaluator",
  // },
  // {
  //   label: "Fees",
  //   icon: CreditCard,
  //   href: "/dashboard/fees",
  // },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile and set initial collapsed state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial values
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "relative border-r bg-background h-screen",
        isCollapsed ? "w-[70px]" : "w-[240px]",
        "transition-all duration-300 ease-in-out"
      )}
    >
      <div className="h-full px-3 py-4">
        <div className="mb-10 flex h-[60px] items-center px-2">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "px-2"
            )}
          >
            {isCollapsed ? (
              <>
                <div className="hidden dark:block">
                  <Image
                    src="/assets/images/lit-logo.svg"
                    alt="LIT"
                    width={24}
                    height={24}
                    className="h-6 w-auto"
                  />
                </div>
                <div className="dark:hidden">
                  <Image
                    src="/assets/images/lit-logo-dark.svg"
                    alt="LIT"
                    width={24}
                    height={24}
                    className="h-6 w-auto"
                  />
                </div>
              </>
            ) : (
              <h1 className="flex items-center gap-1 text-2xl font-bold">
                <div className="hidden dark:block">
                  <Image
                    src="/assets/images/lit-logo.svg"
                    alt="LIT"
                    width={32}
                    height={32}
                    className="h-8 w-auto"
                  />
                </div>
                <div className="dark:hidden">
                  <Image
                    src="/assets/images/lit-logo-dark.svg"
                    alt="LIT"
                    width={32}
                    height={32}
                    className="h-8 w-auto"
                  />
                </div>
                School
              </h1>
            )}
          </Link>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-1 px-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === route.href && "bg-secondary",
                  isCollapsed ? "px-2" : ""
                )}
                asChild
              >
                <Link href={route.href} className="flex items-center">
                  <route.icon
                    className={cn("h-5 w-5", !isCollapsed && "mr-2")}
                  />
                  {!isCollapsed && <span>{route.label}</span>}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-6 rounded-full border bg-background shadow-md",
          isCollapsed ? "-right-3" : "-right-4"
        )}
        onClick={toggleSidebar}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
