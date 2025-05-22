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
import { Calendar, CheckCircle, Clock4Icon, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { StudentApplicationHeader } from "./application-dialog/dialog-header";
import { DocumentsTab } from "./application-dialog/document-tab";
import { PaymentInformationTab } from "./application-dialog/payment-info-tab";
import { PersonalDetailsTab } from "./application-dialog/personal-details-tab";

type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "lemon"
  | "pending"
  | "onhold"
  | "default";

interface ApplicationsListProps {
  applications: any;
  onApplicationSelect: (id: any) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: any[]) => void;
  onApplicationUpdate: () => void;
}

export function ApplicationsList({
  applications,
  onApplicationSelect,
  selectedIds,
  onSelectedIdsChange,
  onApplicationUpdate,
}: ApplicationsListProps) {
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

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
      case "interview concluded":
        return "pending";
      case "interview scheduled":
        return "default";
      case "interview rescheduled":
        return "lemon";
      case "dropped":
        return "destructive";
      default:
        return "secondary";
    }
  };

  function checkInterviewStatus(interviews: any): string {
    let status = "interview scheduled";

    if (interviews.length > 1) {
      status = "interview rescheduled";
    }

    const lastInterview = interviews[interviews.length - 1];
    const currentTime = new Date();

    if (lastInterview?.meetingDate && lastInterview?.endTime) {
      const meetingEnd = new Date(
        new Date(lastInterview.meetingDate).toDateString() +
          " " +
          lastInterview.endTime
      );

      // console.log("timee", meetingEnd < currentTime, meetingEnd, currentTime);
      if (meetingEnd < currentTime) {
        status = "interview concluded";
      }
    }
    return status;
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(applications);
    }
  };

  const toggleSelectStudent = (student: any) => {
    if (selectedIds.some((s: any) => s._id === student._id)) {
      onSelectedIdsChange(
        selectedIds.filter((s: any) => s._id !== student._id)
      );
    } else {
      onSelectedIdsChange([...selectedIds, student]);
    }
  };

  const handleEyeClick = (student: any) => {
    setSelectedStudent(student); // Set the selected student ID
    setOpen(true); // Open the dialog
  };

  const handleStatusUpdate = () => {
    onApplicationUpdate();
  };

  useEffect(() => {
    if (applications.length > 0) {
      const firstApplication = applications[0];
      setSelectedRowId(firstApplication._id);
      onApplicationSelect(firstApplication);
    } else {
      setSelectedRowId(null);
      onApplicationSelect(null);
    }
  }, [applications, onApplicationSelect]);

  return applications.length === 0 ? (
    <div className="w-full h-full flex items-center justify-center text-center text-muted-foreground border rounded-md">
      <div>No Students found.</div>
    </div>
  ) : (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  applications.length > 0 &&
                  selectedIds.length === applications.length
                }
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
                  console.log("student -", application);
                  onApplicationSelect(application);
                  setSelectedRowId(application._id);
                }}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.some(
                      (s: any) => s._id === application?._id
                    )}
                    onCheckedChange={() => toggleSelectStudent(application)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {application?.firstName || "-"} {application?.lastName || "-"}
                </TableCell>
                <TableCell
                  className="max-w-[42px] truncate"
                  onClick={() => {
                    navigator.clipboard.writeText(application._id);
                  }}
                >
                  {applicationDetails?.applicationId || "--"}
                </TableCell>
                <TableCell>
                  {applicationDetails?.updatedAt
                    ? new Date(
                        applicationDetails?.updatedAt
                      ).toLocaleDateString()
                    : "--"}
                </TableCell>
                <TableCell className="space-y-1">
                  {latestCohort?.status === "dropped" ? (
                    <Badge
                      className="capitalize max-w-28 truncate"
                      variant={getStatusColor(latestCohort?.status)}
                    >
                      {latestCohort?.status}
                    </Badge>
                  ) : applicationDetails?.applicationStatus === undefined ? (
                    "--"
                  ) : applicationDetails?.applicationStatus ===
                    "interview scheduled" ? (
                    <Badge
                      className="capitalize max-w-28 truncate"
                      variant={getStatusColor(
                        checkInterviewStatus(
                          applicationDetails?.applicationTestInterviews
                        )
                      )}
                    >
                      {checkInterviewStatus(
                        applicationDetails?.applicationTestInterviews
                      )}
                    </Badge>
                  ) : (
                    <Badge
                      className="capitalize max-w-28 truncate"
                      variant={getStatusColor(
                        applicationDetails?.applicationStatus || "--"
                      )}
                    >
                      {applicationDetails?.applicationStatus}
                    </Badge>
                  )}
                  {applicationDetails?.applicationStatus === "under review" &&
                    applicationDetails?.applicationTasks?.[0]
                      ?.applicationTasks?.[0]?.overallFeedback.length > 0 && (
                      <Badge className="capitalize flex items-center gap-1 bg-[#00A3FF1A] text-[#00A3FF] hover:bg-[#00A3FF]/20 w-fit">
                        <CheckCircle className="w-3 h-3" /> App. Revised
                      </Badge>
                    )}
                </TableCell>
                <TableCell>
                  {applicationDetails?.applicationTestInterviews?.[
                    applicationDetails?.applicationTestInterviews.length - 1
                  ] ? (
                    <div className="space-y-0.5">
                      <div className="flex items-center text-xs">
                        <Clock4Icon className="h-3 w-3 mr-1" />
                        {
                          applicationDetails?.applicationTestInterviews[
                            applicationDetails?.applicationTestInterviews
                              .length - 1
                          ]?.startTime
                        }
                      </div>
                      <div className="flex items-center text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(
                          applicationDetails?.applicationTestInterviews[
                            applicationDetails?.applicationTestInterviews
                              .length - 1
                          ]?.meetingDate
                        ).toLocaleDateString() || "--"}
                      </div>
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

      {/* Dialog to display "Hi" message */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="flex flex-col gap-4 max-w-4xl py-2 px-6 h-[90vh] overflow-y-auto">
          {selectedStudent && (
            <StudentApplicationHeader
              student={selectedStudent}
              onUpdateStatus={() => onApplicationUpdate()}
            />
          )}

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="w-full">
              <TabsTrigger value="personal">Personal Details</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <PersonalDetailsTab
                student={selectedStudent}
                onUpdateStatus={onApplicationUpdate}
              />
            </TabsContent>

            <TabsContent value="payment">
              <PaymentInformationTab
                student={selectedStudent}
                onUpdateStatus={() => onApplicationUpdate()}
              />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentsTab
                student={selectedStudent}
                onUpdateStatus={handleStatusUpdate}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
