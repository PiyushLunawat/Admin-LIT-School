"use client";

import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Banknote, Bell, Bot, FileText, Megaphone, Users, Wallet, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { markNotificationsAsRead } from "@/app/api/auth";

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
  cohortId: string;
  cohortTitle: string;
  timestamp: string;
  type: string;
  status: string;
}

export function NotificationsButton() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [adminId, setAdminId] = useState<string | undefined>();
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    // online: navigator.onLine,
    online: true,
    lastActivity: new Date().toISOString(),
  });
  const router = useRouter();

  const networkCheckRef = useRef<NodeJS.Timeout>();

  // Get adminId from cookies + load notifications
  useEffect(() => {
    const id = Cookies.get("adminId");
    setAdminId(id);
    // console.log("Admin ID from cookies:", id);
  }, []);

  // Periodic network checking
  useEffect(() => {
    const checkNetwork = () => {
      // const isOnline = navigator.onLine;
      const isOnline = true;

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
      setNotifications((prev) => [data, ...prev]); 
      // toast.info(data.message);
      updateActivity();
    };

    const handleUnreadNotifications = (unreadNotifications: Notification[]) => {
      if (unreadNotifications.length > 0) {
        console.log("Unread notifications received:", unreadNotifications);
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
    userEvents?.forEach((event) => window.addEventListener(event, updateActivity));

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
      userEvents?.forEach((event) => window.removeEventListener(event, updateActivity));
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

  function geCohortIcon(type: string): JSX.Element {
    switch (type) {
      case "Registration and Application Task":
        return <FileText className="w-6 h-6" />;
      case "Application Interview":
        return <Users className="w-6 h-6" />;
      case "Admission Fee Payment":
        return <Banknote className="w-6 h-6" />;
      case "LITMUS Test":
        return <Bot className="w-6 h-6" />;
      case "Fee Payment Setup":
        return <Wallet className="w-6 h-6" />;
      default:
        return <Megaphone className="w-6 h-6" />;
    }
  }

  const getUrl = (cohortId: string, type: string): string => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    switch (type) {
      case "Registration and Application Task":
      case "Application Interview":
        return `${origin}/dashboard/cohorts/${cohortId}?tab=applications`;
      case "Admission Fee Payment":
      case "Fee Payment Setup":
        return `${origin}/dashboard/cohorts/${cohortId}?tab=payments`;
      case "LITMUS Test":
        return `${origin}/dashboard/cohorts/${cohortId}?tab=litmus`;
      default:
        return `${origin}/dashboard/cohorts/${cohortId}`;
    }
  };  

  async function handleRemoveNotification(notificationId: string, adminId: string) {
    try {
      const payload = {
        notificationIds: [notificationId],
        userId: adminId,
      }
      const res = await markNotificationsAsRead(payload);
      console.log("vf",res);
      
      // Optionally, you can update UI state here after successful API call
      setNotifications((prev) => prev.filter((n) => n.notificationId !== adminId));
      console.log("Notification marked as read:", notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }  
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
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
        </PopoverTrigger>

        <PopoverContent align="end" className="flex flex-col w-[400px] p-1 max-h-[400px] min-h-[80px] justify-center">
          {notifications.length === 0 ? (
            <Label className="text-base text-center text-muted-foreground font-normal">
              No notifications
            </Label>
            ) : (
            <div className="flex flex-col justify-center">
              <div className="flex flex-col gap-1.5 max-h-[360px] min-h-[80px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.notificationId}
                    className="flex flex-col gap-1 rounded-lg items-start p-2 cursor-pointer"
                    style={{ backgroundColor: `${getStatusColor(notification.status || "")}20` }}
                    onClick={() => router.push(getUrl(notification.cohortId, notification.type))}
                  >
                    <div className="flex items-center justify-between text-[10px] w-full">
                      <div className="text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
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
                          {geCohortIcon(notification.type || "")}
                        </div>
                        <div>
                          <div
                            className="text-base font-medium"
                            style={{ color: notification.status ? getStatusColor(notification.status || "") : "#ffffff" }}
                          >
                            {notification.title}
                          </div>
                          <p className="text-xs">{notification.message}</p>
                        </div>
                      </div>
                      {adminId &&
                        <Button
                          variant="ghost"
                          size="icon" className="z-10"
                          onClick={(e) => {
                            e.stopPropagation(); // ✅ Prevent parent div onClick
                            handleRemoveNotification(notification.notificationId, adminId);
                          }}                      >
                          <XIcon className="w-4 h-4" />
                        </Button>
                      }
                    </div>
                  </div>
                  ))}
              </div>
              <Button variant={'link'} className="text-xs text-muted-foreground underline mx-auto"
                onClick={() => setNotifications([])}>
                  Clear All
              </Button>
            </div>
            )}
        </PopoverContent>
      </Popover>

      <ToastContainer />
    </>
  );
}
