"use client";

import { Calendar, Clock4Icon, Eye } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BadgeVariant,
  CommunicationLogProps,
  Message,
} from "@/types/components/cohorts/dashboard/tabs/communications/communication-log";

const PreviousMessage = dynamic(
  () =>
    import(
      "@/components/cohorts/dashboard/tabs/communications/communication-dialog/preview-message"
    ).then((mod) => mod.PreviousMessage),
  { ssr: false }
);

export function CommunicationLog({ cohortId }: CommunicationLogProps) {
  const [open, setOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const communications: Message[] = [
    {
      id: "1",
      date: "2024-03-20",
      time: "10:30 AM",
      recipients: "All Applicants",
      subject: "Application Status Update",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
      type: "Email",
      status: "Sent",
    },
    {
      id: "2",
      date: "2024-03-19",
      time: "2:15 PM",
      recipients: "Payment Pending",
      subject: "Payment Reminder",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
      type: "Whatsapp",
      status: "Delivered",
    },
    {
      id: "3",
      date: "2024-03-18",
      time: "11:45 AM",
      recipients: "John Doe",
      subject: "Interview Confirmation",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
      type: "Email",
      status: "Opened",
    },
  ];

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

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input placeholder="Search communications..." className="max-w-sm" />
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

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {communications.map((comm) => (
              <TableRow key={comm.id}>
                <TableCell>
                  <div className="flex items-center text-xs">
                    <Clock4Icon className="h-3 w-3 mr-1" />
                    {comm.time}
                  </div>
                  <div className="flex items-center text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(comm.date).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>{comm.recipients}</TableCell>
                <TableCell>{comm.subject}</TableCell>
                <TableCell>
                  <Badge variant="outline">{comm.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(comm.status)}>
                    {comm.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewMessage(comm)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-[90vw] sm:max-w-4xl">
          {selectedMessage && (
            <PreviousMessage
              type={selectedMessage.type}
              status={selectedMessage.status}
              date={selectedMessage.date}
              time={selectedMessage.time}
              recipient={selectedMessage.recipients}
              subject={selectedMessage.subject}
              message={selectedMessage.message}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
