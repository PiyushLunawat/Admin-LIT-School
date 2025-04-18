"use client";

import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Banknote, Bell, Bot, FileText, Megaphone, Users, Wallet, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";

const NETWORK_CHECK_INTERVAL = 15000; // 15 seconds

const socket: Socket = io(process.env.API_URL!, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  transports: ["websocket"],
});

type ConnectionStatus = {
  connected: boolean;
  online: boolean;
  lastActivity: string;
};

interface Notification {
  notificationId: string;
  title: string;
  message: string;
  cohortTitle: string;
  timestamp: string;
  category: string;
  status: string;
}

export function NotificationsButton() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [adminId, setAdminId] = useState<string | undefined>();
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    online: navigator.onLine,
    lastActivity: new Date().toISOString(),
  });

  const networkCheckRef = useRef<NodeJS.Timeout>();

  // Helpers for localStorage
  function saveNotificationsToStorage(notifications: Notification[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem("adminNotification", JSON.stringify(notifications));
    }
  }

  function loadNotificationsFromStorage(): Notification[] {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("adminNotification");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  // Get adminId from cookies + load notifications
  useEffect(() => {
    const id = Cookies.get("adminId");
    setAdminId(id);
    console.log("Admin ID from cookies:", id);

    const storedNotifications = loadNotificationsFromStorage();
    if (storedNotifications.length > 0) {
      setNotifications(storedNotifications);
    }
  }, []);

  // Save to localStorage on notifications update
  useEffect(() => {
    saveNotificationsToStorage(notifications);
  }, [notifications]);

  // Periodic network checking
  useEffect(() => {
    const checkNetwork = () => {
      const isOnline = navigator.onLine;

      if (isOnline && !status.online) {
        console.log("Network restored.");
        setStatus((prev) => ({ ...prev, online: true }));
        socket.emit("network_status", { online: true });
        if (!socket.connected && adminId) {
          socket.connect();
        }
      } else if (!isOnline && status.online) {
        console.log("Network disconnected.");
        setStatus((prev) => ({ ...prev, online: false }));
        socket.emit("network_status", { online: false });
        socket.disconnect();
      }
    };

    const handleOnline = () => checkNetwork();
    const handleOffline = () => checkNetwork();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    networkCheckRef.current = setInterval(checkNetwork, NETWORK_CHECK_INTERVAL);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(networkCheckRef.current);
    };
  }, [status.online]);

  // Socket connection and handlers
  useEffect(() => {
    if (status.online && adminId && !socket.connected) {
      console.log("Connecting socket...");
      socket.connect();
    }

    const updateActivity = () => {
      setStatus((prev) => ({ ...prev, lastActivity: new Date().toISOString() }));
    };

    const handleConnect = () => {
      console.log("Socket connected!");
      setStatus((prev) => ({ ...prev, connected: true }));

      if (adminId) {
        socket.emit("login", adminId, (response: any) => {
          if (response.success) {
            console.log("Login successful:", adminId);
          } else {
            console.error("Login failed:", response.error);
          }
        });
      }
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected!");
      setStatus((prev) => ({ ...prev, connected: false }));
    };

    const handlePing = () => {
      if (status.online) {
        socket.emit("pong");
        console.log("Responded with pong");
      }
    };

    const handleNewNotification = (data: Notification) => {
      console.log("Received notification:", data);
      setNotifications((prev) => [
        {
          ...data,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
      toast.info(data.message);
      updateActivity();
    };

    const handleUnreadNotifications = (unreadNotifications: Notification[]) => {
      if (unreadNotifications.length > 0) {
        console.log("Unread notifications received:", unreadNotifications.length);
        setNotifications((prev) => [
          ...unreadNotifications.map((n) => ({
            ...n,
            timestamp: n.timestamp || new Date().toISOString(),
          })),
          ...prev,
        ]);
      }
    };

    const userEvents = ["mousemove", "keydown", "click", "scroll"];
    userEvents.forEach((event) => window.addEventListener(event, updateActivity));

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("ping", handlePing);
    socket.on("newNotification", handleNewNotification);
    socket.on("unreadNotifications", handleUnreadNotifications);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("ping", handlePing);
      socket.off("newNotification", handleNewNotification);
      socket.off("unreadNotifications", handleUnreadNotifications);
      userEvents.forEach((event) => window.removeEventListener(event, updateActivity));
    };
  }, [adminId, status.online]);

  // Color and Icon Mapping
  function getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case "general":
        return "#00A3FF";
      case "repeat":
        return "#FF791F";
      case "onhold":
        return "#F8E000";
      case "success":
        return "#00CC92";
      case "failure":
        return "#FF503D";
      default:
        return "#000000";
    }
  }

  function getCategoryIcon(category: string): JSX.Element {
    switch (category.toLowerCase()) {
      case "application":
        return <FileText className="w-6 h-6" />;
      case "interview":
        return <Users className="w-6 h-6" />;
      case "admission":
        return <Banknote className="w-6 h-6" />;
      case "litmus":
        return <Bot className="w-6 h-6" />;
      case "fee":
        return <Wallet className="w-6 h-6" />;
      default:
        return <Megaphone className="w-6 h-6" />;
    }
  }

  function handleRemoveNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.notificationId !== id));
  }

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
            <div
              className={`w-2 h-2 absolute top-6 right-2 rounded-full animate-pulse ${
                status.connected ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[400px] max-h-[400px] min-h-[80px] overflow-y-auto">
          <DropdownMenuGroup className="space-y-1.5">
            {notifications.length === 0 ? (
              <DropdownMenuLabel className="text-base text-center mt-[20px] text-muted-foreground font-normal">
                No notifications
              </DropdownMenuLabel>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.notificationId}
                  className="flex flex-col gap-1 items-start p-2"
                  style={{ backgroundColor: `${getStatusColor(notification.status)}20` }}
                >
                  <div className="flex items-center justify-between text-[10px] w-full">
                    <div className="text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div
                      className="rounded px-1 font-semibold"
                      style={{
                        backgroundColor: `${getStatusColor(notification.status || "")}40`,
                      }}
                    >
                      {notification.cohortTitle}
                    </div>
                  </div>

                  <div className="w-full flex justify-between items-center">
                    <div className="flex flex-1 items-center gap-2 mb-1">
                      <div
                        className="p-4 rounded-full"
                        style={{
                          backgroundColor: `${getStatusColor(notification.status || "")}40`,
                        }}
                      >
                        {getCategoryIcon(notification.category || "")}
                      </div>
                      <div>
                        <div
                          className="text-base font-medium"
                          style={{ color: notification.status ? getStatusColor(notification.status) : "#ffffff" }}
                        >
                          {notification.title}
                        </div>
                        <p className="text-xs">{notification.message}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveNotification(notification.notificationId)}
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
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
