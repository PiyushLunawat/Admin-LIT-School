"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function NotificationsButton() {
  const notifications = [
    {
      id: "1",
      type: "Payment Overdue",
      message: "3 students have payments overdue by more than 7 days",
      priority: "high",
    },
    {
      id: "2",
      type: "Cohort Capacity",
      message: "CM02JY cohort is at 90% capacity",
      priority: "medium",
    },
    {
      id: "3",
      type: "Interview Schedule",
      message: "5 interviews scheduled for tomorrow",
      priority: "medium",
    },
  ];

  const unreadCount = notifications.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-3">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={notification.priority === "high" ? "destructive" : "secondary"}>
                  {notification.type}
                </Badge>
              </div>
              <p className="text-sm">{notification.message}</p>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full text-center">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}