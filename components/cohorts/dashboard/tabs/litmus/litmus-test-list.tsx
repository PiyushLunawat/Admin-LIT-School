"use client";

import { Calendar, Clock4Icon, Eye } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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
  BadgeVariant,
  LitmusTestListProps,
} from "@/types/components/cohorts/dashboard/tabs/litmus/litmus-test-list";

const StudentApplicationHeader = dynamic(
  () =>
    import("../applications/application-dialog/dialog-header").then(
      (m) => m.StudentApplicationHeader
    ),
  { ssr: false }
);

const DocumentsTab = dynamic(
  () =>
    import("../applications/application-dialog/document-tab").then(
      (m) => m.DocumentsTab
    ),
  { ssr: false }
);

const PaymentInformationTab = dynamic(
  () =>
    import("../applications/application-dialog/payment-info-tab").then(
      (m) => m.PaymentInformationTab
    ),
  { ssr: false }
);

const PersonalDetailsTab = dynamic(
  () =>
    import("../applications/application-dialog/personal-details-tab").then(
      (m) => m.PersonalDetailsTab
    ),
  { ssr: false }
);

export function LitmusTestList({
  applications,
  onSubmissionSelect,
  selectedIds,
  onApplicationUpdate,
  onSelectedIdsChange,
}: LitmusTestListProps) {
  const [open, setOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "pending":
        return "pending";
      case "under review":
        return "onhold";
      case "completed":
        return "success";
      case "interview scheduled":
        return "default";
      case "interview rescheduled":
        return "lemon";
      case "dropped":
        return "destructive";
      default:
        return "default";
    }
  };

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
    setSelectedStudentId(student);
    setOpen(true);
  };

  const handleStatusUpdate = () => {
    onApplicationUpdate();
  };

  useEffect(() => {
    if (applications.length > 0) {
      const firstApplication = applications[0];
      setSelectedRowId(firstApplication._id);
      onSubmissionSelect(firstApplication);
    } else {
      setSelectedRowId(null);
      onSubmissionSelect(null);
    }
  }, [applications]);

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
                disabled={applications.length === 0}
              />
            </TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Evaluator</TableHead>
            <TableHead>Presentation</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application: any) => {
            const latestCohort =
              application?.appliedCohorts?.[
                application?.appliedCohorts.length - 1
              ];
            const litmusTestDetails = latestCohort?.litmusTestDetails;
            const lastInterview =
              latestCohort?.litmusTestDetails?.litmusTestInterviews[
                latestCohort?.litmusTestDetails?.litmusTestInterviews.length - 1
              ];
            return (
              <TableRow
                key={application._id}
                className={`cursor-pointer ${
                  selectedRowId === application._id ? "bg-muted" : ""
                }`}
                onClick={() => {
                  console.log("student -", application);
                  onSubmissionSelect(application);
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
                  {`${application?.firstName || ""} ${
                    application?.lastName || ""
                  }`.trim()}
                </TableCell>
                <TableCell>
                  {new Date(
                    litmusTestDetails?.updatedAt
                  ).toLocaleDateString() || "--"}
                </TableCell>
                <TableCell className="">
                  {latestCohort?.status === "dropped" ? (
                    <Badge
                      className="capitalize max-w-28 truncate"
                      variant={getStatusColor(latestCohort?.status)}
                    >
                      {latestCohort?.status}
                    </Badge>
                  ) : litmusTestDetails?.status === "interview scheduled" ? (
                    <Badge
                      className="capitalize max-w-28 truncate"
                      variant={getStatusColor(
                        checkInterviewStatus(
                          litmusTestDetails?.litmusTestInterviews
                        )
                      )}
                    >
                      {checkInterviewStatus(
                        litmusTestDetails?.litmusTestInterviews
                      )}
                    </Badge>
                  ) : (
                    <Badge
                      className="capitalize max-w-28 truncate"
                      variant={getStatusColor(
                        litmusTestDetails?.status || "pending"
                      )}
                    >
                      {litmusTestDetails?.status === "pending" ? "Awaiting Submission" : litmusTestDetails?.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {lastInterview
                    ? lastInterview?.ownerFirstName +
                      " " +
                      lastInterview?.ownerLastName
                    : "--"}
                </TableCell>
                <TableCell>
                  {lastInterview ? (
                    <div className="space-y-0.5">
                      <div className="flex items-center text-xs">
                        <Clock4Icon className="h-3 w-3 mr-1" />
                        {lastInterview?.startTime}
                      </div>
                      <div className="flex items-center text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(
                          lastInterview?.meetingDate
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
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <PersonalDetailsTab
                student={selectedStudentId}
                onUpdateStatus={handleStatusUpdate}
              />
            </TabsContent>

            <TabsContent value="payment">
              <PaymentInformationTab
                student={selectedStudentId}
                onUpdateStatus={() => onApplicationUpdate()}
              />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentsTab
                student={selectedStudentId}
                onUpdateStatus={handleStatusUpdate}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
