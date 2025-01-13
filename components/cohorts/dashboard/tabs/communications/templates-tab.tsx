"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock4Icon, Eye, PlusIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Download } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreateTemplate } from "./communication-dialog/create-template";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";
interface TemplatesTabProps {
  cohortId: string;
}

export function TemplatesTab({ cohortId }: TemplatesTabProps) {
  const [communicationType, setCommunicationType] = useState<string>("email");
  const [open, setOpen] = useState(false);
  const communications = [
    {
      id: "1",
      date: "2024-03-20 10:30 AM",
      time: "1:45 PM",
      recipients: "All Applicants",
      subject: "Application Status Update",
      type: "Email",
    },
    {
      id: "2",
      date: "2024-03-19 02:15 PM",
      time: "1:45 PM",
      recipients: "Payment Pending",
      subject: "Payment Reminder",
      type: "Whatsapp",
    },
    {
      id: "3",
      date: "2024-03-18 11:45 AM",
      time: "1:45 PM",
      recipients: "John Doe",
      subject: "Interview Confirmation",
      type: "Email",
    },
    {
      id: "4",
      date: "2024-03-18 11:45 AM",
      time: "1:45 PM",
      recipients: "John Doe",
      subject: "Admission Fee Pending",
      type: "Email",
    },
    {
      id: "5",
      date: "2024-03-18 11:45 AM",
      time: "1:45 PM",
      recipients: "John Doe",
      subject: "General Announcement",
      type: "Email",
    },
  ];

  const handleTypeChange = (type: string) => {
    setCommunicationType(type);
  };

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
    <div className="space-y-4">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-4">
      <div className="flex gap-4">
        <Input placeholder="Search Templates..." className="" />
        <Button className="flex gap-1 items-center" onClick={() => setOpen(true)}><PlusIcon className="w-4 h-4"/>Create Template</Button>
      </div>
    </div>
    </div>

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-4xl">
    <CreateTemplate />
  </DialogContent>
</Dialog>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-4">

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipients</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {communications.map((comm) => (
              <TableRow key={comm.id}>
                <TableCell>{comm.recipients}</TableCell>
                <TableCell>{comm.subject}</TableCell>
                <TableCell>
                  <Badge variant="outline">{comm.type}</Badge>
                </TableCell>
                <TableCell> <>
                    <div className="flex items-center text-xs">
                      <Clock4Icon className="h-3 w-3 mr-1" />
                      {comm.time}
                    </div>
                    <div className="flex items-center text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(comm.date).toLocaleDateString()}
                    </div>
                  </></TableCell>
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
      <div className="lg:col-span-1">
        <div className="sticky top-6">
        <Card className="h-[calc(100vh-10rem)] overflow-y-auto">
          <CardHeader>
            <CardTitle>Message Details</CardTitle>
            <CardDescription>
              Preview how your message will appear to recipients
            </CardDescription>
          </CardHeader>

          <CardContent className="email">
            <div className="border-b space-y-2 pb-3">
              <h4 className="">Type</h4>
              <div className="flex gap-3">
              <div className="flex items-center space-x-2">
                      <Checkbox
                        id="email"
                        checked={communicationType === "email"}
                        onCheckedChange={() => handleTypeChange("email")}
                      />
                      <label htmlFor="email" className="text-sm ">
                        Email
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="whatsapp"
                        checked={communicationType === "whatsapp"}
                        onCheckedChange={() => handleTypeChange("whatsapp")}
                      />
                      <label htmlFor="whatsapp" className="text-sm ">
                        Whatsapp
                      </label>
                    </div>
              </div>
            </div>
          <h4 className="my-4">Message Preview</h4>
          {communicationType === "email" ? (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Subject:</p>
                <p className="font-medium">{ "Lorem ipsum dolor"}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Message:</p>
                <p className="">{ "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et..."}</p>
              </div>
            </div>) : (
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Message:</p>
              <div className="flex items-center gap-1">
                <span className="text-sm ">Subject:</span>
                <p className="font-medium">{ "Lorem ipsum dolor"}</p>
              </div>
              <p className="mt-3">{ "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et..."}</p>
            </div>
          )}
          </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>);
}