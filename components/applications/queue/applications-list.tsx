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
import { Eye, CheckCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PersonalDetailsTab } from "@/components/cohorts/dashboard/tabs/applications/application-dialog/personal-details-tab";
import { StudentApplicationHeader } from "@/components/cohorts/dashboard/tabs/applications/application-dialog/dialog-header";
import { DocumentsTab } from "@/components/cohorts/dashboard/tabs/applications/application-dialog/document-tab";

interface ApplicationsListProps {
  applications: any;
  onApplicationSelect: (id: any) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "onhold" | "lemon" | "default";

export function ApplicationsList({
  applications,
  onApplicationSelect,
  selectedIds,
  onSelectedIdsChange,
}: ApplicationsListProps) {

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

  const handleEyeClick = (student: any) => {
    setSelectedStudentId(student); // Set the selected student ID
    setOpen(true); // Open the dialog
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
      } else {
        setSelectedRowId(null);
        onApplicationSelect(null);
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
                {application?.applicationDetails?.applicationStatus ?
                <Badge className="capitalize" variant={getStatusColor(['Interview Scheduled', 'waitlist', 'selected', 'not qualified'].includes(application?.applicationDetails?.applicationStatus) ?
                  'accepted' : application?.applicationDetails?.applicationStatus || "--")}>
                  {['Interview Scheduled', 'waitlist', 'selected', 'not qualified'].includes(application?.applicationDetails?.applicationStatus) ?
                  'accepted' : application?.applicationDetails?.applicationStatus }
                </Badge> : "--"}
                {(application?.applicationDetails?.applicationStatus === 'under review' && application?.applicationDetails?.applicationTasks?.length > 1) &&
                <Badge className="capitalize flex items-center gap-1 bg-[#00A3FF1A] text-[#00A3FF] hover:bg-[#00A3FF]/20 w-fit">
                  <CheckCircle className="w-3 h-3"/> App. Revised
                </Badge>}
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
          ))}
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