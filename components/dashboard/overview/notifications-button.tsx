"use client";

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bell, FileText, Users, Banknote, Bot, Wallet, Clock10 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NETWORK_CHECK_INTERVAL = 10000; // 10 seconds
const socket = io(`${process.env.API_URL}`, { autoConnect: false });

interface ConnectionStatus {
  connected: boolean;
  online: boolean;
  lastActivity: string;
}

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    online: false,
    lastActivity: new Date().toISOString(),
  });
  const studentId = useRef("67e143b0c6785a411400b343");
  const networkCheckRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setStatus((prev) => ({ ...prev, online: navigator.onLine }));
  }, []);
  

  // Network detection
  useEffect(() => {
    const checkNetwork = async () => {
      try {
        // await fetch("http://localhost:3000", { method: "HEAD", cache: "no-store" });
        if (!status.online) {
          setStatus((p) => ({ ...p, online: true }));
          socket.emit("network_status", { online: true });
          if (!socket.connected) socket.connect();
        }
      } catch {
        if (status.online) {
          setStatus((p) => ({ ...p, online: false }));
          socket.emit("network_status", { online: false });
          socket.disconnect();
        }
      }
    };

    networkCheckRef.current = setInterval(checkNetwork, NETWORK_CHECK_INTERVAL);
    window.addEventListener("online", checkNetwork);
    window.addEventListener("offline", checkNetwork);

    return () => {
      clearInterval(networkCheckRef.current);
      window.removeEventListener("online", checkNetwork);
      window.removeEventListener("offline", checkNetwork);
    };
  }, [status.online]);

  // Connection and notification handling
  useEffect(() => {
    const updateActivity = () => setStatus((p) => ({ ...p, lastActivity: new Date().toISOString() }));

    socket.on("connect", () => {
      setStatus((p) => ({ ...p, connected: true }));
      socket.emit("login", studentId.current);
    });

    socket.on("disconnect", () => setStatus((p) => ({ ...p, connected: false })));
    socket.on("newNotification", (data: any) => {
      setNotifications((prev) => [{ ...data, timestamp: new Date().toISOString() }, ...prev]);
      toast.info(data.description);
      updateActivity();
    });

    socket.on("unreadNotifications", (unreadNotifications: any[]) => {
      if (unreadNotifications.length > 0) {
        setNotifications((prev) => [
          ...unreadNotifications.map((n) => ({ ...n, timestamp: n.createdAt || new Date().toISOString() })),
          ...prev,
        ]);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newNotification");
      socket.off("unreadNotifications");
    };
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[400px] max-h-[400px] min-h-[80px] overflow-y-auto">
          <DropdownMenuGroup className="space-y-1.5">
            {notifications.length === 0 ? (
              <DropdownMenuLabel className="text-base text-center mt-[20px] text-muted-foreground font-normal">
                No notifications
              </DropdownMenuLabel>
            ) : (
              notifications.map((notification, index) => (
                <DropdownMenuItem key={index} className="flex flex-col items-start p-2">
                  <div className="flex items-center justify-between text-[10px] w-full">
                    <div>{new Date(notification.timestamp).toLocaleTimeString()}</div>
                    <div className="rounded px-1 font-semibold" style={{ backgroundColor: notification.category }}>
                      {notification.cohortId}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-4 rounded-full" style={{ backgroundColor: notification.category }}>
                      {notification.status}
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: notification.category }}>
                        {notification.title}
                      </div>
                      <p className="text-xs">{notification.description}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ToastContainer />
    </>
  );
}
