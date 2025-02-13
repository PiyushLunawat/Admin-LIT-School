"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, School, Building2, Users, ClipboardList, Calendar, GraduationCap, CreditCard, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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
  {
    label: "Applications",
    icon: ClipboardList,
    href: "/dashboard/applications",
  },
  // {
  //   label: "Interviews",
  //   icon: Calendar,
  //   href: "/dashboard/interviews",
  // },
  {
    label: "LITMUS Test",
    icon: GraduationCap,
    href: "/dashboard/litmus-evaluator/home",
  },
  {
    label: "Fees",
    icon: CreditCard,
    href: "/dashboard/fees",
  },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative border-r bg-background",
      isCollapsed ? "w-[60px]" : "w-[240px]",
      "transition-all duration-300 ease-in-out"
    )}>
      <div className="h-full px-3 py-4">
        <div className="mb-10 flex h-[60px] items-center px-2">
          <Link href="/dashboard" className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "px-2"
          )}>
            {isCollapsed ? (
              <>
                <img src="/assets/images/lit-logo.svg" alt="LIT" className=" h-6 hidden dark:block" />
                <img src="/assets/images/lit-logo-dark.svg" alt="LIT" className=" h-46 dark:hidden" />        
              </>
            ) : (
              <h1 className="flex items-center gap-1 text-2xl font-bold light:hidden">
                <img src="/assets/images/lit-logo.svg" alt="LIT" className=" h-8 hidden dark:block" />
                <img src="/assets/images/lit-logo-dark.svg" alt="LIT" className=" h-8 dark:hidden" />                
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
                  <route.icon className={cn("h-6 w-6", !isCollapsed && "mr-2")} />
                  {!isCollapsed && route.label}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-6 rounded-full border bg-background"
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
}