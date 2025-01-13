"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

export function UserButton() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('admin-token');
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
