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
import { useState } from "react";
import { ReviewComponent } from "./litmus-test-dialog/review";

interface LitmusSubmission {
  id: string;
  applicantName: string;
  submissionDate: string;
  evaluationStatus: string;
  presentationDate?: string;
  evaluator?: string;
  scholarshipAwarded?: string;
}

interface LitmusTestListProps {
  cohortId: string;
  onSubmissionSelect: (id: string) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

export function LitmusTestList({
  cohortId,
  onSubmissionSelect,
  selectedIds,
  onSelectedIdsChange,
}: LitmusTestListProps) {
  const [open, setOpen] = useState(false);

  // Sample data, this would typically be fetched
  const submissions: LitmusSubmission[] = [
    {
      id: "1",
      applicantName: "John Doe",
      submissionDate: "2024-03-15",
      evaluationStatus: "Pending",
    },
    {
      id: "2",
      applicantName: "Jane Smith",
      submissionDate: "2024-03-14",
      evaluationStatus: "Under Review",
      evaluator: "Sarah Admin",
    },
    {
      id: "3",
      applicantName: "Mike Johnson",
      submissionDate: "2024-03-13",
      evaluationStatus: "Completed",
      evaluator: "Tom Evaluator",
      presentationDate: "2024-03-20",
      scholarshipAwarded: "Smart Mouth (5%)",
    },
  ];

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "pending":
        return "secondary";
      case "under review":
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
      onSelectedIdsChange(submissions.map((sub) => sub.id));
    }
  };

  const toggleSelectSubmission = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedIdsChange(selectedIds.filter((selectedId) => selectedId !== id));
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
            <TableHead>Submission Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Evaluator</TableHead>
            <TableHead>Presentation</TableHead>
            <TableHead className="w-12"></TableHead>
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
              <TableCell className="font-medium">
                {submission.applicantName}
              </TableCell>
              <TableCell>
                {new Date(submission.submissionDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(submission.evaluationStatus)}>
                  {submission.evaluationStatus}
                </Badge>
              </TableCell>
              <TableCell>{submission.evaluator || "-"}</TableCell>
              <TableCell>
                {submission.presentationDate ? (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(submission.presentationDate).toLocaleDateString()}
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(true);
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
        <DialogContent className="max-w-4xl">
          <ReviewComponent/>
        </DialogContent>
      </Dialog>
    </div>
  );
}
