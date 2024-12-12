"use client";

import { UserButton } from "@/components/dashboard/user-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsButton } from "@/components/dashboard/overview/notifications-button";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <NotificationsButton />
          <UserButton />
        </div>
      </div>
    </div>
  );
}