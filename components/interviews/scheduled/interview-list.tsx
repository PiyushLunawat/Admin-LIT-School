"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, MapPin, PlayCircle, Clock, X } from "lucide-react";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";

export function InterviewList() {
  const router = useRouter();
  const interviews = [
    {
      id: "INT001",
      applicantName: "John Doe",
      date: "2024-03-25",
      time: "10:30 AM",
      mode: "Zoom",
      status: "Scheduled",
    },
    {
      id: "INT002",
      applicantName: "Jane Smith",
      date: "2024-03-25",
      time: "2:15 PM",
      mode: "In-person",
      status: "Completed",
    },
    {
      id: "INT003",
      applicantName: "Mike Johnson",
      date: "2024-03-26",
      time: "11:00 AM",
      mode: "Google Meet",
      status: "Cancelled",
    },
  ];

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "default";
      case "completed":
        return "success";
      case "cancelled":
        return "destructive";
      case "rescheduled":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "zoom":
      case "google meet":
        return <Video className="h-4 w-4" />;
      case "in-person":
        return <MapPin className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Interview ID</TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.map((interview) => (
            <TableRow 
              key={interview.id}
              className="cursor-pointer"
              onClick={() => router.push(`/dashboard/interviews/${interview.id}`)}
            >
              <TableCell className="font-medium">{interview.id}</TableCell>
              <TableCell>{interview.applicantName}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(interview.date).toLocaleDateString()} at{" "}
                  {interview.time}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getModeIcon(interview.mode)}
                  {interview.mode}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(interview.status)}>
                  {interview.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  {interview.status === "Scheduled" && (
                    <Button size="sm">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Clock className="h-4 w-4 mr-2" />
                    Reschedule
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}