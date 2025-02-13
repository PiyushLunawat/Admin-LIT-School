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
import { Eye, Clock, CheckCircle, Clock4Icon, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InterviewsListProps {
  applications: any;
  onApplicationSelect: (id: string) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "onhold" | "lemon" | "default";

export function InterviewsList({
  applications,
  onApplicationSelect,
  selectedIds,
  onSelectedIdsChange,
}: InterviewsListProps) {

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(applications.map((app: any) => app._id));
    }
  };

  const toggleSelectApplication = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedIdsChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectedIdsChange([...selectedIds, id]);
    }
  };

  const getPriorityColor = (priority: string): BadgeVariant => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "initiated":
        return "default";
      case "under review":
        return "secondary";
      case "accepted":
      case "selected":
        return "success";
      case "rejected":
      case "not qualified":
        return "warning";
      case "on hold":
      case "waitlist":
        return "onhold";
      case "interview scheduled":
        case "interview rescheduled":
        return "default";
      case "interview concluded":
        return "lemon";
      default:
        return "secondary";
    }
  };

    useEffect(() => {
      if (applications.length > 0) {
        const firstApplication = applications[0];
        setSelectedRowId(firstApplication._id); // Set the selected row ID to the first application
        onApplicationSelect(firstApplication); // Call the onApplicationSelect function for the first application
      }
    }, [applications]);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === applications.length}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Application ID</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Interview</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application: any) => (
            <TableRow 
              key={application._id}
              className={`cursor-pointer ${selectedRowId === application._id ? "bg-muted" : ""}`}            
              onClick={() => {
                onApplicationSelect(application)
                setSelectedRowId(application._id);
              }}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(application._id)}
                  onCheckedChange={() => toggleSelectApplication(application._id)}
                />
              </TableCell>
              <TableCell className="font-medium">{application?.firstName || '-'} {application?.lastName || '-'}</TableCell>
              <TableCell className="">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="max-w-[100px] truncate">{application?._id || "--"}</TooltipTrigger>
                    <TooltipContent>
                      <p>{application?._id || "--"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="w-fit px-1.5 py-0.5 text-xs font-normal bg-[#FFFFFF]/10 rounded-sm">
                  {application?.cohort?.cohortId}
                </div>
              </TableCell>
              <TableCell>
                {new Date(application?.applicationDetails?.updatedAt).toLocaleDateString() || "--"}
              </TableCell>
              <TableCell>
                {application?.applicationDetails?.applicationStatus === 'accepted' ? 
                <div className="text-muted-foreground">
                  <div className="text-xs">Waiting for Interview to be scheduled</div>
                  <div className="text-[10px]">Accepted 2 hours ago</div>
                </div> :
                <Badge className="capitalize max-w-28 pr-2 truncate" variant={getStatusColor(application?.applicationDetails?.applicationStatus || "--")}>
                  {application?.applicationDetails?.applicationStatus || "--"}
                </Badge>}
                {(application?.applicationDetails?.applicationStatus === 'under review' && application?.applicationDetails?.applicationTasks?.length > 1) &&
                <Badge className="capitalize flex items-center gap-1 bg-[#00A3FF1A] text-[#00A3FF] hover:bg-[#00A3FF]/20 w-fit">
                  <CheckCircle className="w-3 h-3"/> App. Revised
                </Badge>}
              </TableCell>
              <TableCell>
                {application?.applicationDetails?.applicationTestInterviews[application?.applicationDetails?.applicationTestInterviews.length - 1] ? (
                  <>
                    <div className="flex items-center text-sm">
                      <Clock4Icon className="h-3 w-3 mr-1" />
                      {application?.applicationDetails?.applicationTestInterviews[application?.applicationDetails?.applicationTestInterviews.length - 1]?.startTime}
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(application?.applicationDetails?.applicationTestInterviews[application?.applicationDetails?.applicationTestInterviews.length - 1]?.meetingDate).toLocaleDateString() || "--"}
                    </div>
                  </>
                ) : "--"}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplicationSelect(application.id);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}