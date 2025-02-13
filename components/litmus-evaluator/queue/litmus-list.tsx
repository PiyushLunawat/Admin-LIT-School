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
import { Calendar, Eye, Award } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import student from "@/app/api/student";

type BadgeVariant = "lemon" | "warning" | "secondary" | "success" | "default";

interface LitmusListProps {
  applications: any;
  onApplicationSelect: (id: any) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

export function LitmusList({
  applications,
  onApplicationSelect,
  selectedIds,
  onSelectedIdsChange,
}: LitmusListProps) {
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

  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMs = now.getTime() - date.getTime(); // Difference in milliseconds
    
    const diffInSecs = Math.floor(diffInMs / 1000); // Seconds
    const diffInMins = Math.floor(diffInSecs / 60); // Minutes
    const diffInHours = Math.floor(diffInMins / 60); // Hours
    const diffInDays = Math.floor(diffInHours / 24); // Days
    
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInMins > 0) {
      return `${diffInMins} minute${diffInMins > 1 ? "s" : ""} ago`;
    } else if (diffInSecs > 0) {
      return `Just now`;
    } else {
      return ``;
    }
  };
  
  
  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "pending":
        return "lemon";
      case "under review":
        return "secondary";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

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
            <TableHead>Applicant</TableHead>
            <TableHead>Application ID</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Presentation</TableHead>
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
              <TableCell className="font-medium">
                {`${application?.firstName || ""} ${application?.lastName || ""}`.trim()}
              </TableCell>
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
                {new Date(application?.litmusTestDetails[0]?.litmusTaskId?.updatedAt).toLocaleDateString() || "--"}
              </TableCell>
              <TableCell className="space-y-1 ">
                {['under review', 'submitted', 'interview cancelled'].includes(application?.litmusTestDetails[0]?.litmusTaskId?.status) &&
                  <div className="text-sm text-muted-foreground w-[140px]">
                    Waiting for Interview to be scheduled...
                  </div>
                }
                <Badge
                  className="capitalize"
                  variant={getStatusColor(application?.litmusTestDetails[0]?.litmusTaskId?.status || "")}
                >
                  {application?.litmusTestDetails[0]?.litmusTaskId?.status || ""}
                </Badge>
                {application?.litmusTestDetails[0]?.litmusTaskId?.status === "pending" &&
                  <div className="text-xs text-muted-foreground w-[110px] ">
                    Admission Fee Paid {timeAgo(application?.cousrseEnrolled?.[application.cousrseEnrolled?.length - 1]?.tokenFeeDetails?.updatedAt)}
                  </div>
                }
              </TableCell>
              <TableCell>
                {application?.litmusTestDetails[0]?.litmusTaskId?.presentationDate ? (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(application?.litmusTestDetails[0]?.litmusTaskId?.presentationDate).toLocaleDateString() || "--"}
                  </div>
                ) : (
                  "--"
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    // handleEyeClick(application);
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