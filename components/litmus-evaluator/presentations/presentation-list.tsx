"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Video, MapPin, PlayCircle, X } from "lucide-react";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";
interface PresentationListProps {
  onPresentationSelect: (id: string) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

export function PresentationList({
  onPresentationSelect,
  selectedIds,
  onSelectedIdsChange,
}: PresentationListProps) {
  // In a real application, this data would be fetched from an API
  const presentations = [
    {
      id: "PRES001",
      applicantName: "John Doe",
      date: "2024-03-25",
      time: "10:30 AM",
      mode: "Zoom",
      status: "Scheduled",
    },
    {
      id: "PRES002",
      applicantName: "Jane Smith",
      date: "2024-03-25",
      time: "2:15 PM",
      mode: "In-person",
      status: "Completed",
    },
    {
      id: "PRES003",
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

  const toggleSelectAll = () => {
    if (selectedIds.length === presentations.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(presentations.map(pres => pres.id));
    }
  };

  const toggleSelectPresentation = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedIdsChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectedIdsChange([...selectedIds, id]);
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === presentations.length}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {presentations.map((presentation) => (
            <TableRow 
              key={presentation.id}
              className="cursor-pointer"
              onClick={() => onPresentationSelect(presentation.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(presentation.id)}
                  onCheckedChange={() => toggleSelectPresentation(presentation.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{presentation.applicantName}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(presentation.date).toLocaleDateString()} at{" "}
                  {presentation.time}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getModeIcon(presentation.mode)}
                  {presentation.mode}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(presentation.status)}>
                  {presentation.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  {presentation.status === "Scheduled" && (
                    <Button size="sm">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
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