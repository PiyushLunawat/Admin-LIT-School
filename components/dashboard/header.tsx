"use client";

import { UserButton } from "@/components/dashboard/user-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsButton } from "@/components/dashboard/overview/notifications-button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 justify-between items-center px-4">
        <div className="sm:hidden flex h-[60px] items-center px-2">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center",
              "justify-center px-2"
            )}>
              <h1 className="flex items-center gap-1 text-2xl font-bold light:hidden">
                <Image
                  src="/assets/images/lit-logo.svg"
                  alt="LIT"
                  width={32}
                  height={32}
                  className="h-8 w-8 hidden dark:block"
                />
                <Image
                  src="/assets/images/lit-logo-dark.svg"
                  alt="LIT"
                  width={32}
                  height={32}
                  className="h-8 w-8 dark:hidden"
                />
                School
              </h1>
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <NotificationsButton />
          <UserButton />
        </div>
      </div>
    </div>
  );
}