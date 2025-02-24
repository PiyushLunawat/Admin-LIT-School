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
import { Calendar, CheckCircle, Clock4Icon, Eye } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentApplicationHeader } from "./application-dialog/dialog-header";
import { PersonalDetailsTab } from "./application-dialog/personal-details-tab";
import { PaymentInformationTab } from "./application-dialog/payment-info-tab";
import { DocumentsTab } from "./application-dialog/document-tab";
import { getStudents } from "@/app/api/student";
import { DateRange } from "react-day-picker";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "lemon" | "onhold" | "default";

interface ApplicationsListProps {
  applications: any;
  onApplicationSelect: (id: any) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
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
      case "interview scheduled":
        return "default";
      case "interview rescheduled":
      case "interview concluded":
        return "lemon";
      default:
        return "secondary";
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(applications.map((app: any) => app._id));
    }
  };

  const toggleSelectApplication = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedIdsChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onSelectedIdsChange([...selectedIds, id]);
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
      console.log("dd",applications);
      
      const firstApplication = applications[0];
      setSelectedRowId(firstApplication._id); 
      onApplicationSelect(firstApplication); 
    } else {
      setSelectedRowId(null);
      onApplicationSelect(null);
    }
  }, [applications]);

  return (
    applications.length === 0 ?
      <div className="w-full h-full flex items-center justify-center text-center text-muted-foreground border rounded-md">
        <div >All your students will appear here</div>
      </div> :
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
                const applicationDetail = latestCohort?.applicationDetails;
              return(
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
                <TableCell className="max-w-[42px] truncate" onClick={() => {navigator.clipboard.writeText(application._id)}}>
                  {application?._id || "--"}
                </TableCell>
                <TableCell>
                  {new Date(applicationDetail?.updatedAt).toLocaleDateString() || "--"}
                </TableCell>
                <TableCell className="space-y-1">
                  <Badge className="capitalize max-w-28 pr-2 truncate" variant={getStatusColor(applicationDetail?.applicationStatus || "--")}>
                    {applicationDetail?.applicationStatus || "--"}
                  </Badge>
                  {(applicationDetail?.applicationStatus === 'under review' && applicationDetail?.applicationTasks?.[0]?.applicationTasks?.[0]?.overallFeedback?.length > 1) &&
                    <Badge className="capitalize flex items-center gap-1 bg-[#00A3FF1A] text-[#00A3FF] hover:bg-[#00A3FF]/20 w-fit">
                      <CheckCircle className="w-3 h-3"/> App. Revised
                    </Badge>
                  }
                </TableCell>
                <TableCell>
                  {applicationDetail?.applicationTestInterviews[applicationDetail?.applicationTestInterviews.length - 1] ? (
                    <div className="space-y-0.5">
                      <div className="flex items-center text-xs">
                        <Clock4Icon className="h-3 w-3 mr-1" />
                        {applicationDetail?.applicationTestInterviews[applicationDetail?.applicationTestInterviews.length - 1]?.startTime}
                      </div>
                      <div className="flex items-center text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(applicationDetail?.applicationTestInterviews[applicationDetail?.applicationTestInterviews.length - 1]?.meetingDate).toLocaleDateString() || "--"}
                      </div>
                    </div>
                  ) : "--"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon" className="hover:bg-black"
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

        {/* Dialog to display "Hi" message */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl py-2 px-6 h-[90vh] overflow-y-auto">
            {selectedStudent && (
              <StudentApplicationHeader student={selectedStudent} />
            )}

              <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="w-full">
                  <TabsTrigger value="personal">Personal Details</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                  <PersonalDetailsTab student={selectedStudent} />
                </TabsContent>

                <TabsContent value="payment">
                  <PaymentInformationTab student={selectedStudent} onUpdateStatus={() => onApplicationUpdate()}/>
                </TabsContent>

                <TabsContent value="documents">
                  <DocumentsTab student={selectedStudent} onUpdateStatus={handleStatusUpdate} />
                </TabsContent>
              </Tabs>
          </DialogContent>
        </Dialog>
      </div>
  );
}
