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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalDetailsTab } from "@/components/cohorts/dashboard/tabs/applications/application-dialog/personal-details-tab";
import { StudentApplicationHeader } from "@/components/cohorts/dashboard/tabs/applications/application-dialog/dialog-header";

interface InterviewsListProps {
  applications: any;
  onApplicationSelect: (id: string) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "onhold" | "pending" | "default";

export function InterviewsList({
  applications,
  onApplicationSelect,
  selectedIds,
  onSelectedIdsChange,
}: InterviewsListProps) {
  const [open, setOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

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
        return "pending";
      default:
        return "secondary";
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

    useEffect(() => {
      if (applications.length > 0) {
        const firstApplication = applications[0];
        setSelectedRowId(firstApplication._id); // Set the selected row ID to the first application
        onApplicationSelect(firstApplication); // Call the onApplicationSelect function for the first application
      } else {
        setSelectedRowId(null);
        // onApplicationSelect(null);
      }
    }, [applications]);

    const handleEyeClick = (student: any) => {
      setSelectedStudentId(student); // Set the selected student ID
      setOpen(true); // Open the dialog
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
            <TableHead>Name</TableHead>
            <TableHead>Application ID</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Interview</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application: any) => {

            const latestCohort = application?.appliedCohorts?.[application?.appliedCohorts.length - 1];
            const applicationDetails = latestCohort?.applicationDetails;
            
            return (
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
                  {latestCohort?.cohortId?.cohortId}
                </div>
              </TableCell>
              <TableCell>
                {new Date(applicationDetails?.updatedAt).toLocaleDateString() || "--"}
              </TableCell>
              <TableCell>
                {applicationDetails?.applicationStatus === 'accepted' ? 
                <div className="text-muted-foreground">
                  <div className="text-xs">Waiting for Interview to be scheduled</div>
                  <div className="text-[10px]">Accepted {timeAgo(applicationDetails?.updatedAt)}</div>
                </div> :
                <Badge className="capitalize max-w-28 pr-2 truncate" variant={getStatusColor(applicationDetails?.applicationStatus || "--")}>
                  {applicationDetails?.applicationStatus || "--"}
                </Badge>}
                {(applicationDetails?.applicationStatus === 'under review' && applicationDetails?.applicationTasks?.length > 1) &&
                <Badge className="capitalize flex items-center gap-1 bg-[#00A3FF1A] text-[#00A3FF] hover:bg-[#00A3FF]/20 w-fit">
                  <CheckCircle className="w-3 h-3"/> App. Revised
                </Badge>}
              </TableCell>
              <TableCell>
                {applicationDetails?.applicationTestInterviews[applicationDetails?.applicationTestInterviews.length - 1] ? (
                  <>
                    <div className="flex items-center text-sm">
                      <Clock4Icon className="h-3 w-3 mr-1" />
                      {applicationDetails?.applicationTestInterviews[applicationDetails?.applicationTestInterviews.length - 1]?.startTime}
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(applicationDetails?.applicationTestInterviews[applicationDetails?.applicationTestInterviews.length - 1]?.meetingDate).toLocaleDateString() || "--"}
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
                    handleEyeClick(application);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl py-2 px-6 h-[90vh] overflow-y-auto">
          {selectedStudentId && (
            <StudentApplicationHeader student={selectedStudentId} />
          )}

            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="w-full">
                <TabsTrigger value="personal">Personal Details</TabsTrigger>
                {/* <TabsTrigger value="documents">Documents</TabsTrigger> */}
              </TabsList>

              <TabsContent value="personal">
                <PersonalDetailsTab student={selectedStudentId} />
              </TabsContent>
             {/* 
              <TabsContent value="documents">
                <DocumentsTab student={selectedStudentId} onUpdateStatus={handleStatusUpdate} />
              </TabsContent> */}
            </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}