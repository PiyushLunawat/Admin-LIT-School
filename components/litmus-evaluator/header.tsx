"use client";

import { UserButton } from "@/components/litmus-evaluator/user-button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  );
}