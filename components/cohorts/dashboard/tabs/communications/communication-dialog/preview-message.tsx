"use client";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, Clock4Icon, Mail } from "lucide-react";
import Image from "next/image";

type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "default";
interface PreviousMessageProps {
  type: string;
  status: string;
  date: string;
  time: string;
  recipient: string;
  subject: string;
  message: string;
}

export function PreviousMessage({
  type = "Email",
  status = "Delivered",
  date = "2024-03-20",
  time = "1:45 PM",
  recipient = "Token Payment Pending",
  subject = "Lorem ipsum dolor",
  message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
}: PreviousMessageProps) {
  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "sent":
        return "secondary";
      case "delivered":
        return "default";
      case "opened":
        return "success";
      default:
        return "default";
    }
  };
  return (
    <div className="space-y-4 ">
      <div className="flex items-center gap-2">
        {type === "Email" ? (
          <Mail className="w-6 h-6" />
        ) : (
          <Image
            src="/assets/images/whatsapp-icon.svg"
            width={24}
            height={24}
            alt="WhatsApp"
            className="w-6 h-6"
          />
        )}
        <h3 className="text-lg font-medium">{type}</h3>
      </div>

      <div className="flex items-center space-x-4 text-sm">
        <Badge variant={getStatusColor(status)}>{status}</Badge>
        <div className="flex items-center space-x-1">
          <CalendarIcon className="h-4 w-4 " />
          <span>{format(new Date(date), "dd/MM/yyyy")}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock4Icon className="h-4 w-4 " />
          <span>{time}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="">
          <p className="text-sm text-muted-foreground mb-1">Recipient</p>
          <p className="border rounded-lg p-4 font-medium">{recipient}</p>
        </div>

        <div className="">
          <p className="text-sm text-muted-foreground mb-1">Subject</p>
          <p className="border rounded-lg p-4 font-medium">{subject}</p>
        </div>

        <div className="">
          <p className="text-sm text-muted-foreground mb-1">Message</p>
          <p className="border rounded-lg p-4">{message}</p>
        </div>
      </div>
    </div>
  );
}
