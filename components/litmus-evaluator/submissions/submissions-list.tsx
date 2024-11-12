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
import { Calendar, Eye, Award } from "lucide-react";

interface SubmissionsListProps {
  onSubmissionSelect: (id: string) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

export function SubmissionsList({
  onSubmissionSelect,
  selectedIds,
  onSelectedIdsChange,
}: SubmissionsListProps) {
  const submissions = [
    {
      id: "1",
      applicantName: "John Doe",
      submissionId: "LIT001",
      submissionDate: "2024-03-15",
      evaluationStatus: "Pending",
      presentationScheduled: false,
      scholarship: null,
    },
    {
      id: "2",
      applicantName: "Jane Smith",
      submissionId: "LIT002",
      submissionDate: "2024-03-14",
      evaluationStatus: "In Progress",
      presentationScheduled: true,
      presentationDate: "2024-03-20",
      scholarship: null,
    },
    {
      id: "3",
      applicantName: "Mike Johnson",
      submissionId: "LIT003",
      submissionDate: "2024-03-13",
      evaluationStatus: "Completed",
      presentationScheduled: true,
      presentationDate: "2024-03-18",
      scholarship: "Smart Mouth (5%)",
    },
  ];

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "pending":
        return "secondary";
      case "in progress":
        return "warning";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === submissions.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(submissions.map(sub => sub.id));
    }
  };

  const toggleSelectSubmission = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedIdsChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectedIdsChange([...selectedIds, id]);
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === submissions.length}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Submission ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Presentation</TableHead>
            <TableHead>Scholarship</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow 
              key={submission.id}
              className="cursor-pointer"
              onClick={() => onSubmissionSelect(submission.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(submission.id)}
                  onCheckedChange={() => toggleSelectSubmission(submission.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{submission.applicantName}</TableCell>
              <TableCell>{submission.submissionId}</TableCell>
              <TableCell>{new Date(submission.submissionDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(submission.evaluationStatus)}>
                  {submission.evaluationStatus}
                </Badge>
              </TableCell>
              <TableCell>
                {submission.presentationScheduled ? (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(submission.presentationDate!).toLocaleDateString()}
                  </div>
                ) : (
                  <Badge variant="outline">Not Scheduled</Badge>
                )}
              </TableCell>
              <TableCell>
                {submission.scholarship ? (
                  <Badge variant="secondary">
                    <Award className="h-4 w-4 mr-2" />
                    {submission.scholarship}
                  </Badge>
                ) : "-"}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubmissionSelect(submission.id);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}