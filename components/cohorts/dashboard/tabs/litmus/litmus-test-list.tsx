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

type BadgeVariant = "destructive" | "onhold" | "lemon" | "success" | "default";

interface LitmusTestListProps {
  cohortId: string;
  onSubmissionSelect: (id: any) => void;
  selectedIds: string[];
  onApplicationUpdate: () => void;
  selectedDateRange: DateRange | undefined;
  onSelectedIdsChange: (ids: string[]) => void;
  searchTerm: string;
  selectedStatus: string;
  sortBy: string;
}

export function LitmusTestList({
  cohortId,
  onSubmissionSelect,
  selectedIds,
  onApplicationUpdate,
  selectedDateRange,
  onSelectedIdsChange,
  searchTerm,
  selectedStatus,
  sortBy,
}: LitmusTestListProps) {
  const [open, setOpen] = useState(false);
  const [applications, setApplications] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await getStudents();
        const mappedStudents =
          response.data.filter(
            (student: any) =>
              student?.litmusTestDetails[0]?.litmusTaskId !== undefined &&
              student.cohort?._id === cohortId
          );

        setApplications(mappedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, [cohortId]);

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "pending":
        return "lemon";
      case "under review":
        return "onhold";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  const filteredAndSortedApplications = useMemo(() => {
    // 1) Filter
    const filteredApplications = applications.filter((app: any) => {
      if (!selectedDateRange) return true;
      const appDate = new Date(app.updatedAt);
      const { from, to } = selectedDateRange;
      return (!from || appDate >= from) && (!to || appDate <= to);
    });
    let filtered = filteredApplications;

    // a) Search filter by applicant name
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((app: any) => {
        const name = `${app.firstName ?? ""} ${app.lastName ?? ""}`.toLowerCase();
        return name.includes(lowerSearch);
      });
    }

    // b) Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((app: any) => {
        const status =
          app.litmusTestDetails[0]?.litmusTaskId?.status?.toLowerCase() || "pending";
        return status === selectedStatus;
      });
    }

    // 2) Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a: any, b: any) => {
          const dateA = new Date(
            a.litmusTestDetails[0]?.litmusTaskId?.updatedAt
          ).getTime();
          const dateB = new Date(
            b.litmusTestDetails[0]?.litmusTaskId?.updatedAt
          ).getTime();
          return dateB - dateA; // newest first
        });
        break;

      case "oldest":
        filtered.sort((a: any, b: any) => {
          const dateA = new Date(
            a.litmusTestDetails[0]?.litmusTaskId?.updatedAt
          ).getTime();
          const dateB = new Date(
            b.litmusTestDetails[0]?.litmusTaskId?.updatedAt
          ).getTime();
          return dateA - dateB; // oldest first
        });
        break;

      case "name-asc":
        filtered.sort((a: any, b: any) => {
          const nameA = `${a.firstName ?? ""} ${a.lastName ?? ""}`.toLowerCase();
          const nameB = `${b.firstName ?? ""} ${b.lastName ?? ""}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
        break;

      case "name-desc":
        filtered.sort((a: any, b: any) => {
          const nameA = `${a.firstName ?? ""} ${a.lastName ?? ""}`.toLowerCase();
          const nameB = `${b.firstName ?? ""} ${b.lastName ?? ""}`.toLowerCase();
          return nameB.localeCompare(nameA);
        });
        break;
    }

    return filtered;
  }, [applications, searchTerm, selectedStatus, sortBy, selectedDateRange]);

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
    if (filteredAndSortedApplications.length > 0) {
      const firstApplication = filteredAndSortedApplications[0];
      setSelectedRowId(firstApplication._id); // Set the selected row ID to the first application
      onSubmissionSelect(firstApplication); // Call the onApplicationSelect function for the first application
    }
  }, [filteredAndSortedApplications]);

  return (
    loading ?
    <div className="w-full h-full flex items-center justify-center text-center text-muted-foreground border rounded-md">
      <div >Loading... </div>
    </div> :
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
          {filteredAndSortedApplications.map((application: any) => (
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
                {new Date(application?.litmusTestDetails[0]?.litmusTaskId?.updatedAt).toLocaleDateString() || "--"}
              </TableCell>
              <TableCell>
                <Badge
                  className="capitalize"
                  variant={getStatusColor(application?.litmusTestDetails[0]?.litmusTaskId?.status || "pending")}
                >
                  {application?.litmusTestDetails[0]?.litmusTaskId?.status || "pending"}
                </Badge>
              </TableCell>
              <TableCell>
                {application?.cohort?.collaborators
                  ?.filter((collaborator: any) => collaborator.role === "evaluator")
                  .map((collaborator: any) => collaborator.email)
                  .join(", ") || "--"}
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
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalDetailsTab student={selectedStudentId} />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentInformationTab student={selectedStudentId} />
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
