"use client";

import { StudentApplicationHeader } from "@/components/cohorts/dashboard/tabs/applications/application-dialog/dialog-header";
import { PersonalDetailsTab } from "@/components/cohorts/dashboard/tabs/applications/application-dialog/personal-details-tab";
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
import { formatAmount } from "@/lib/utils/helpers";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "onhold"
  | "pending"
  | "default";

interface EnrolmentListProps {
  applications: any;
  onApplicationSelect: (id: any) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  onApplicationUpdate: () => void;
}

export function EnrolmentList({
  applications,
  onApplicationSelect,
  selectedIds,
  onSelectedIdsChange,
  onApplicationUpdate,
}: EnrolmentListProps) {
  const [open, setOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const colorClasses = [
    "text-emerald-600",
    "text-[#3698FB]",
    "text-[#FA69E5]",
    "text-orange-600",
  ];

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

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "pending":
      case "verification-pending":
        return "pending";
      case "paid":
        return "success";
      case "dropped":
        return "warning";
      case "flagged":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getColor = (slabName: string, application: any): string => {
    const index =
      application?.cohort?.litmusTestDetail?.[0]?.scholarshipSlabs.findIndex(
        (slab: any) => slab.name === slabName
      );

    return index !== -1
      ? colorClasses[index % colorClasses.length]
      : "text-default";
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
    }
  }, [applications, onApplicationSelect]);

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
            <TableHead>Student</TableHead>
            <TableHead>Application ID</TableHead>
            <TableHead>Scholarship</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application: any) => (
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
                  {application?.cohort?.cohortId}
                </div>
              </TableCell>
              <TableCell>
                {application?.litmusTestDetails?.[0]?.litmusTaskId
                  ?.scholarshipDetail ? (
                  <div className="space-y-1">
                    <div
                      className={`text-xs ${getColor(
                        application?.cousrseEnrolled?.[
                          application?.cousrseEnrolled?.length - 1
                        ]?.semesterFeeDetails?.scholarshipName,
                        application
                      )}`}
                    >
                      {
                        application?.cousrseEnrolled?.[
                          application?.cousrseEnrolled?.length - 1
                        ]?.semesterFeeDetails?.scholarshipName
                      }
                    </div>
                    <div className="text-base font-semibold">
                      {
                        application?.cousrseEnrolled?.[
                          application?.cousrseEnrolled?.length - 1
                        ]?.semesterFeeDetails?.scholarshipPercentage
                      }
                      % Wavier
                    </div>
                  </div>
                ) : (
                  "--"
                )}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Badge
                    variant={getStatusColor(
                      application?.cousrseEnrolled?.[
                        application.cousrseEnrolled?.length - 1
                      ]?.tokenFeeDetails?.verificationStatus || ""
                    )}
                    className="capitalize"
                  >
                    {application?.cousrseEnrolled?.[
                      application.cousrseEnrolled?.length - 1
                    ]?.tokenFeeDetails?.verificationStatus || "--"}
                  </Badge>
                  {application?.cousrseEnrolled?.[
                    application.cousrseEnrolled?.length - 1
                  ]?.tokenFeeDetails?.verificationStatus === "paid" ? (
                    <div className="text-xs font-normal">
                      ₹{" "}
                      {formatAmount(
                        application?.cohort?.cohortFeesDetail?.tokenFee
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Interview cleared{" "}
                      {timeAgo(application?.applicationDetails?.updatedAt)}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
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
        <DialogTitle></DialogTitle>
        <DialogContent className="flex flex-col gap-4 max-w-[90vw] sm:max-w-4xl py-2 px-4 sm:px-6 h-[90vh] overflow-y-auto">
          {selectedStudentId && (
            <StudentApplicationHeader
              student={selectedStudentId}
              onUpdateStatus={() => onApplicationUpdate()}
            />
          )}

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="w-full">
              <TabsTrigger value="personal">Personal Details</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              {/* <TabsTrigger value="documents">Documents</TabsTrigger> */}
            </TabsList>

            <TabsContent value="personal">
              <PersonalDetailsTab
                student={selectedStudentId}
                onUpdateStatus={onApplicationUpdate}
              />
            </TabsContent>
            <TabsContent value="payment">
              {/* <PaymentInformationTab student={selectedStudentId} /> */}
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
