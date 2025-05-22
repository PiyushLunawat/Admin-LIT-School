"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ApplicationsListProps,
  BadgeVariant,
} from "@/types/components/applications/queue/application-list";
import { CheckCircle, Eye } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const StudentApplicationHeader = dynamic(
  () =>
    import(
      "@/components/cohorts/dashboard/tabs/applications/application-dialog/dialog-header"
    ).then((m) => m.StudentApplicationHeader),
  {
    ssr: false,
  }
);

const PersonalDetailsTab = dynamic(
  () =>
    import(
      "@/components/cohorts/dashboard/tabs/applications/application-dialog/personal-details-tab"
    ).then((m) => m.PersonalDetailsTab),
  { ssr: false }
);

export function ApplicationsList({
  applications,
  onApplicationSelect,
  selectedIds,
  onSelectedIdsChange,
  onApplicationUpdate,
}: ApplicationsListProps) {
  const [open, setOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
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
      onSelectedIdsChange(
        selectedIds.filter((selectedId) => selectedId !== id)
      );
    } else {
      onSelectedIdsChange([...selectedIds, id]);
    }
  };

  const handleEyeClick = (student: any) => {
    setSelectedStudentId(student); // Set the selected student ID
    setOpen(true); // Open the dialog
  };

  const handleStatusUpdate = () => {
    onApplicationUpdate();
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
        return "default";
      case "interview rescheduled":
      case "interview concluded":
        return "pending";
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
  }, [applications, onApplicationSelect]);

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
          {applications.map((application: any) => {
            const latestCohort =
              application?.appliedCohorts?.[
                application?.appliedCohorts.length - 1
              ];
            const applicationDetails = latestCohort?.applicationDetails;

            return (
              <TableRow
                key={application._id}
                className={`cursor-pointer ${
                  selectedRowId === application._id ? "bg-muted" : ""
                }`}
                onClick={() => {
                  onApplicationSelect(application);
                  setSelectedRowId(application._id);
                }}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(application._id)}
                    onCheckedChange={() =>
                      toggleSelectApplication(application._id)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {application?.firstName || "-"} {application?.lastName || "-"}
                </TableCell>
                <TableCell className="">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="max-w-[100px] truncate">
                        {application?._id || "--"}
                      </TooltipTrigger>
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
                  {new Date(
                    applicationDetails?.updatedAt
                  ).toLocaleDateString() || "--"}
                </TableCell>
                <TableCell>
                  {applicationDetails?.applicationStatus ? (
                    <Badge
                      className="capitalize"
                      variant={getStatusColor(
                        [
                          "interview scheduled",
                          "waitlist",
                          "selected",
                          "not qualified",
                        ].includes(applicationDetails?.applicationStatus)
                          ? "accepted"
                          : applicationDetails?.applicationStatus || "--"
                      )}
                    >
                      {[
                        "interview scheduled",
                        "waitlist",
                        "selected",
                        "not qualified",
                      ].includes(applicationDetails?.applicationStatus)
                        ? "accepted"
                        : applicationDetails?.applicationStatus}
                    </Badge>
                  ) : (
                    "--"
                  )}
                  {applicationDetails?.applicationStatus === "under review" &&
                    applicationDetails?.applicationTasks?.length > 1 && (
                      <Badge className="capitalize flex items-center gap-1 bg-[#00A3FF1A] text-[#00A3FF] hover:bg-[#00A3FF]/20 w-fit">
                        <CheckCircle className="w-3 h-3" /> App. Revised
                      </Badge>
                    )}
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
            );
          })}
        </TableBody>
      </Table>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="flex flex-col gap-4 max-w-4xl py-2 px-6 h-[90vh] overflow-y-auto">
          {selectedStudentId && (
            <StudentApplicationHeader
              student={selectedStudentId}
              onUpdateStatus={() => onApplicationUpdate()}
            />
          )}

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="w-full">
              <TabsTrigger value="personal">Personal Details</TabsTrigger>
              {/* <TabsTrigger value="documents">Documents</TabsTrigger> */}
            </TabsList>

            <TabsContent value="personal">
              <PersonalDetailsTab
                student={selectedStudentId}
                onUpdateStatus={handleStatusUpdate}
              />
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
