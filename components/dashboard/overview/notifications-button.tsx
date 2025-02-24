"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Banknote,
  Bell,
  Bot,
  Clock10,
  FileText,
  Users,
  Wallet,
} from "lucide-react";
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

const socket = io(`${process.env.API_URL}`);

interface Notification {
  id: string;
  title: string;
  description: string;
  category: string;
  timestamp: string;
  cohortId: string;
  status: JSX.Element;
}

export function NotificationsButton() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Application Initiated",
      description: "{Student name} has initiated filling in the application form",
      category: "#00A3FF",
      timestamp: new Date().toISOString(),
      cohortId: "CM01JY",
      status: <FileText className="w-6 h-6" />,
    },
    {
      id: "2",
      title: "Applicant Waitlisted!",
      description:
        "{Student name} has rescheduled their application interview with {Team Member name} for Monday, 3rd January at 3:30PM.",
      category: "#F8E000",
      timestamp: new Date().toISOString(),
      cohortId: "CD02JY",
      status: <Users className="w-6 h-6" />,
    },
    {
      id: "3",
      title: "Acknowledgement Receipt Cleared",
      description:
        "{Student name}’s admission fee receipt of INR 25,000 has been acknowledged by {team member name}",
      category: "#2EB88A",
      timestamp: "2025-02-04T14:38:13.714Z",
      cohortId: "CM02JY",
      status: <Banknote className="w-6 h-6" />,
    },
    {
      id: "4",
      title: "LITMUS Test Timed Out!",
      description:
        "{Student name}’s admission fee receipt of INR 25,000 has been acknowledged by {team member name}",
      category: "#FF503D",
      timestamp: "2025-02-04T14:38:13.714Z",
      cohortId: "CM02JY",
      status: <Bot className="w-6 h-6" />,
    },
    {
      id: "5",
      title: "Fee Payment Receipt Has Been Re-uploaded by {Student Name}",
      description:
        "{Student name} has Re-uploaded their Semester 01, Instalment 01 payment receipt. Kindly Review and acknowledge their payment.",
      category: "#FF791F",
      timestamp: "2025-01-27T14:38:13.714Z",
      cohortId: "CM02JY",
      status: <Wallet className="w-6 h-6" />,
    },
    {
      id: "6",
      title: "Interview Schedule",
      description: "{Student name} has Scheduled the interview on 02-02-2025",
      category: "#00A3FF",
      timestamp: "2024-12-27T05:16:24.292Z",
      cohortId: "CM02JY",
      status: <Clock10 className="w-6 h-6" />,
    },
  ]);

  useEffect(() => {
    socket.on("notification", (data) => {

      console.log("notification",data.description)
      // Display a toast notification
      toast.info(data.description, {
        position: "top-right",
        autoClose: 3000, // 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setNotifications((prevNotifications) => [data, ...prevNotifications]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  const unreadCount = notifications.length;

  return (
    <>
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
        <DropdownMenuContent
          align="end"
          className="w-[400px] max-h-[400px] min-h-[80px] overflow-y-auto"
        >
          <DropdownMenuGroup className="space-y-1.5">
            {notifications.length === 0 ? 
            <DropdownMenuLabel className="text-base text-center mt-[20px] text-muted-foreground font-normal">
              No notifications
            </DropdownMenuLabel> :
            notifications.map((notification: any, index: any) => (
              <DropdownMenuItem
                key={index}
                className={`bg-[${notification.category}]/20 focus:bg-[${notification.category}] flex flex-col items-start p-2`}
              >
                <div className="flex items-center justify-between text-[10px] w-full">
                  <div>
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </div>
                  <div
                    className={`bg-[${notification.category}]/20 rounded px-1 font-semibold`}
                  >
                    {notification.cohortId}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`bg-[${notification.category}]/20 p-4 rounded-full`}>
                    {notification.status}
                  </div>
                  <div>
                    <div
                      className={`text-sm font-medium text-[${notification.category}]`}
                    >
                      {notification.title}
                    </div>
                    <p className="text-xs">{notification.description}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ToastContainer />
    </>
  );
}
