"use client";

import { format } from "date-fns";
import { CalendarIcon, Clock4Icon, Mail } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SendMessageProps } from "@/types/components/cohorts/dashboard/tabs/applications/application-dialog/send-message";

export function SendMessage({ type, recipient }: SendMessageProps) {
  const [message, setMessage] = useState("Subject: ");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;

    // Ensure "Subject: " remains at the start of the input
    if (!inputValue.startsWith("Subject: ")) {
      setMessage("Subject: ");
    } else {
      setMessage(inputValue);
    }
  };

  const currentDate = new Date();
  const currentTime = format(currentDate, "HH:mm");

  return (
    <div className="space-y-4 ">
      <div className="flex items-center gap-2">
        {type === "email" ? (
          <Mail className="w-6 h-6" />
        ) : (
          <Image
            alt="whatsapp"
            src="/assets/images/whatsapp-icon.svg"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        )}
        <h3 className="text-lg font-medium capitalize">{type}</h3>
      </div>

      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-1">
          <CalendarIcon className="h-4 w-4 " />
          <span>{format(currentDate, "dd/MM/yyyy")}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock4Icon className="h-4 w-4 " />
          <span>{currentTime}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="">
          <p className="text-sm text-muted-foreground mb-1">Recipient</p>
          <p className="border text-sm rounded-lg p-2 font-medium">
            {recipient}
          </p>
        </div>

        {type === "email" ? (
          <>
            <div className="">
              <p className="text-sm text-muted-foreground mb-1">Subject</p>
              <Input type="text" placeholder="Enter subject" />
            </div>

            <div className="">
              <p className="text-sm text-muted-foreground mb-1">Message</p>
              <Textarea placeholder="Type your message here" rows={4} />
            </div>
          </>
        ) : (
          <div className="">
            <p className="text-sm text-muted-foreground mb-1">Message</p>
            <Textarea
              placeholder="Type your message here"
              rows={6}
              value={message}
              onChange={handleChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
