"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CommunicationLog() {
  const communications = [
    {
      id: "1",
      date: "2024-03-20 10:30 AM",
      recipients: "All Students",
      subject: "Fee Payment Reminder",
      type: "Email",
      status: "Sent",
    },
    {
      id: "2",
      date: "2024-03-19 02:15 PM",
      recipients: "Payment Pending",
      subject: "Payment Due Notice",
      type: "SMS",
      status: "Delivered",
    },
    {
      id: "3",
      date: "2024-03-18 11:45 AM",
      recipients: "John Doe",
      subject: "Payment Confirmation",
      type: "Email",
      status: "Opened",
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
                <TableCell>{comm.date}</TableCell>
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
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}