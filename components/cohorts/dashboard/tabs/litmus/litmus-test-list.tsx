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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentApplicationHeader } from "../applications/application-dialog/dialog-header";
import { PersonalDetailsTab } from "../applications/application-dialog/personal-details-tab";
import { PaymentInformationTab } from "../applications/application-dialog/payment-info-tab";
import { DocumentsTab } from "../applications/application-dialog/document-tab";
import { Calendar, Eye } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { ReviewComponent } from "./litmus-test-dialog/review";
import { getStudents } from "@/app/api/student";
import { DateRange } from "react-day-picker";

type BadgeVariant = "destructive" | "onhold" | "pending" | "success" | "default";

interface LitmusTestListProps {
  applications: any
  onSubmissionSelect: (id: any) => void;
  selectedIds: string[];
  onApplicationUpdate: () => void;
  onSelectedIdsChange: (ids: string[]) => void;
}

export function LitmusTestList({
  applications,
  onSubmissionSelect,
  selectedIds,
  onApplicationUpdate,
  onSelectedIdsChange,
}: LitmusTestListProps) {

  const [open, setOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "pending":
        return "pending";
      case "under review":
        return "onhold";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(applications.map((sub: any) => sub._id));
    }
  };

  const toggleSelectSubmission = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedIdsChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onSelectedIdsChange([...selectedIds, id]);
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
      console.log("dd",applications);
      
      const firstApplication = applications[0];
      setSelectedRowId(firstApplication._id); 
      onSubmissionSelect(firstApplication); 
    } else {
      setSelectedRowId(null);
      onSubmissionSelect(null);
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
            const latestCohort = application?.appliedCohorts?.[application?.appliedCohorts.length - 1];
            const litmusTestDetails = latestCohort?.litmusTestDetails;
            return(
            <TableRow
              key={application._id}
              className={`cursor-pointer ${selectedRowId === application._id ? "bg-muted" : ""}`}            
              onClick={() => {
                onSubmissionSelect(application)
                setSelectedRowId(application._id);
              }}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(application._id)}
                  onCheckedChange={() => toggleSelectSubmission(application._id)}
                />
              </TableCell>
              <TableCell className="font-medium">
                {`${application?.firstName || ""} ${application?.lastName || ""}`.trim()}
              </TableCell>
              <TableCell>
                {new Date(litmusTestDetails?.updatedAt).toLocaleDateString() || "--"}
              </TableCell>
              <TableCell>
                <Badge
                  className="capitalize"
                  variant={getStatusColor(litmusTestDetails?.status || "pending")}
                >
                  {litmusTestDetails?.status || "pending"}
                </Badge>
              </TableCell>
              <TableCell>
                {latestCohort?.cohortId?.collaborators
                  ?.filter((collaborator: any) => collaborator.role === "evaluator")
                  .map((collaborator: any) => collaborator.email)
                  .join(", ") || "--"}
              </TableCell>
              <TableCell>
                {litmusTestDetails?.litmusTestInterviews?.presentationDate ? (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(litmusTestDetails?.litmusTestInterviews?.presentationDate).toLocaleDateString() || "--"}
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
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalDetailsTab student={selectedStudentId} />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentInformationTab student={selectedStudentId} onUpdateStatus={() => onApplicationUpdate()}/>
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTab student={selectedStudentId} onUpdateStatus={handleStatusUpdate} />
        </TabsContent>
      </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
