"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Clock4Icon, Eye, Mail, MailIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search, Send, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


interface InboxTabProps {
  cohortId: string;
}

export function InboxTab({ cohortId }: InboxTabProps) {
  const communications = [
    {
      id: "1",
      date: "2024-03-20 10:30 AM",
      time: "1:45 PM",
      sender: "kundanjain@gmail.com",
      role: "Applicant",
      subject: "Application Status Update",
      type: "Email",
    },
    {
      id: "2",
      date: "2024-03-19 02:15 PM",
      time: "1:45 PM",
      sender: "arpitanand1234@gmail.com",
      role: "LITMUS Presentor",
      subject: "Payment Reminder",
      type: "Whatsapp",
    },
    {
      id: "3",
      date: "2024-03-18 11:45 AM",
      time: "1:45 PM",
      sender: "anushkabaj@gmail.com",
      role: "Interviwee",
      subject: "Interview Confirmation",
      type: "Email",
    },
  ];

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "sent":
        return "secondary";
      case "delivered":
        return "primary";
      case "opened":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
      <div className="flex gap-4">
        <Input placeholder="Search Messages..." className="" />
        <Select defaultValue="all-types">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">All Types</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="notification">Notification</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all-status">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">All Status</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="opened">Opened</SelectItem>
          </SelectContent>
        </Select>
      </div>
      </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>sender</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {communications.map((comm) => (
              <TableRow key={comm.id}>
                <TableCell> <>
                    <div className="flex items-center text-xs">
                      <Clock4Icon className="h-3 w-3 mr-1" />
                      {comm.time}
                    </div>
                    <div className="flex items-center text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(comm.date).toLocaleDateString()}
                    </div>
                  </>
                </TableCell>
                <TableCell><div className="flex items-center text-xs">
                      {comm.sender}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {comm.role}
                    </div>
                  </TableCell>
                <TableCell>{comm.subject}</TableCell>
                <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-6">
        <Card className="h-[calc(100vh-10rem)] overflow-y-auto">
          <CardHeader>
            <CardTitle>Message Preview</CardTitle>
            <CardDescription>
              Preview how your message will appear to recipients
            </CardDescription>
          </CardHeader>
          {true ? (
          <CardContent className="email">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Subject:</p>
                <p className="font-medium">{"Lorem ipsum dolor"}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Message:</p>
                <p>{"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}</p>
              </div>
              <Button variant="outline" className="flex gap-2 items-center w-full">
                <MailIcon className="w-4 h-4"/> Respond to Email
              </Button>
            </div>
          </CardContent>) : (
            <CardContent className="whatsapp">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Message:</p>
              <div className="flex items-center gap-1">
                <span className="text-sm ">Subject:</span>
                <p className="font-medium">{"Your message subject here"}</p>
              </div>
              <p className="mt-3">{"Your message content will appear here..."}</p>
            </div>
          </CardContent>
          )}
        </Card>
        </div>
      </div>
      </div>

    </div>
  );
}