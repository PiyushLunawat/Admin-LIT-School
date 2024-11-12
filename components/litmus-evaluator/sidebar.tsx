"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Calendar, 
  MessageSquare, 
  BarChart, 
  Settings,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Home",
    icon: LayoutDashboard,
    href: "/dashboard/litmus-evaluator/home",
  },
  {
    label: "Submissions",
    icon: ClipboardList,
    href: "/dashboard/litmus-evaluator/submissions",
  },
  {
    label: "Presentations",
    icon: Calendar,
    href: "/dashboard/litmus-evaluator/presentations",
  },
  {
    label: "Communication",
    icon: MessageSquare,
    href: "/dashboard/litmus-evaluator/communication",
  },
  {
    label: "Reports",
    icon: BarChart,
    href: "/dashboard/litmus-evaluator/reports",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/litmus-evaluator/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard/litmus-evaluator/home" className="flex items-center pl-3 mb-14">
          <GraduationCap className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">LITMUS Evaluator</h1>
        </Link>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-x-2 text-base font-normal",
                  pathname === route.href && "bg-secondary"
                )}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}