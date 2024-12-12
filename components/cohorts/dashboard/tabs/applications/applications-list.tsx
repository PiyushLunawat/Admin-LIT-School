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
import { Calendar, Clock4Icon, Eye } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentApplicationHeader } from "./application-dialog/dialog-header";
import { PersonalDetailsTab } from "./application-dialog/personal-details-tab";
import { PaymentInformationTab } from "./application-dialog/payment-info-tab";
import { DocumentsTab } from "./application-dialog/document-tab";
import { getStudents } from "@/app/api/student";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "lemon" | "onhold" | "default";
interface Application {
  id: string;
  name: string;
  applicationId: string;
  submissionDate: string;
  applicationStatus: string;
  interviewDate?: string;
  interviewTime?: string;
}

interface ApplicationsListProps {
  cohortId: string;
  onApplicationSelect: (id: string) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

export function ApplicationsList({
  cohortId,
  onApplicationSelect,
  selectedIds,
  onSelectedIdsChange,
}: ApplicationsListProps) {
  const [open, setOpen] = useState(false);
  const [applications, setApplications] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await getStudents();
        setApplications(
          response.data.filter(
            (student: any) =>
              student?.applicationDetails !== undefined &&
              student.cohort?._id === cohortId
          ))       
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);


  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "under review":
        return "secondary";
      case "accepted":
        return "success";
      case "rejected":
        return "warning";
      case "on hold":
        return "onhold";
      case "interview scheduled":
        return "default";
      case "interview rescheduled":
        return "lemon";
      case "update status":
        return "lemon";
      default:
        return "default";
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(applications.map((app: any) => app.id));
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
          {applications.map((application: any) => (
            <TableRow
              key={application.id}
              className="cursor-pointer"
              onClick={() => onApplicationSelect(application)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(application.id)}
                  onCheckedChange={() => toggleSelectApplication(application.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{application?.firstName || '-'} {application?.lastName || '-'}</TableCell>
              <TableCell className="!w-[32px] truncate">{application?.applicationDetails?._id || "--"}</TableCell>
              <TableCell>
                {new Date(application?.applicationDetails?.createdAt).toLocaleDateString() || "--"}
              </TableCell>
              <TableCell>
                <Badge className="capitalize" variant={getStatusColor(application?.applicationDetails?.applicationStatus || "--")}>
                  {application?.applicationDetails?.applicationStatus || "--"}
                </Badge>
              </TableCell>
              <TableCell>
                {application.interviewDate ? (
                  <>
                    <div className="flex items-center text-xs">
                      <Clock4Icon className="h-3 w-3 mr-1" />
                      {application?.interviewTime}
                    </div>
                    <div className="flex items-center text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(application?.lastActivity || new Date().toISOString()).toLocaleDateString() || "--"}
                    </div>
                  </>
                ) : "--"}
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

      {/* Dialog to display "Hi" message */}
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
          <DocumentsTab student={selectedStudentId} />
        </TabsContent>
      </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
