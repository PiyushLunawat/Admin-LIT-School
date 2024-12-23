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
import { Calendar, Eye } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { io } from "socket.io-client"; // Import Socket.IO client
import { ReviewComponent } from "./litmus-test-dialog/review";
import { getStudents } from "@/app/api/student";

type BadgeVariant = "destructive" | "onhold" | "lemon" | "success" | "default";

interface LitmusTestListProps {
  cohortId: string;
  onSubmissionSelect: (id: any) => void;
  selectedIds: string[];
  onApplicationUpdate: () => void;
  onSelectedIdsChange: (ids: string[]) => void;
}

export function LitmusTestList({
  cohortId,
  onSubmissionSelect,
  selectedIds,
  onApplicationUpdate,
  onSelectedIdsChange,
}: LitmusTestListProps) {
  const [open, setOpen] = useState(false);
  const [applications, setApplications] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

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

        mappedStudents.sort((a: any, b: any) => {
          const dateA = new Date(a.litmusTestDetails[0]?.litmusTaskId?.updatedAt).getTime();
          const dateB = new Date(b.litmusTestDetails[0]?.litmusTaskId?.updatedAt).getTime();
          return dateB - dateA;
        });

        setApplications(mappedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();

    // Connect to WebSocket server
    const socket = io("http://localhost:3000"); // Replace with your server URL

    // Listen for the "studentAdded" event
    socket.on("studentAdded", (newStudent) => {
      setApplications((prevApplications: any) => {
        const updatedApplications = [newStudent, ...prevApplications];
        updatedApplications.sort((a: any, b: any) => {
          const dateA = new Date(a.litmusTestDetails[0]?.litmusTaskId?.updatedAt).getTime();
          const dateB = new Date(b.litmusTestDetails[0]?.litmusTaskId?.updatedAt).getTime();
          return dateB - dateA;
        });
        return updatedApplications;
      });
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
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

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(applications.map((sub: any) => sub.id));
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
            <TableHead>Applicant</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Evaluator</TableHead>
            <TableHead>Presentation</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application: any) => (
            <TableRow
              key={application._id}
              className="cursor-pointer"
              onClick={() => onSubmissionSelect(application)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(application.id)}
                  onCheckedChange={() => toggleSelectSubmission(application.id)}
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
        <DialogContent className="max-w-4xl">
          <ReviewComponent application={selectedStudentId} onApplicationUpdate={onApplicationUpdate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
