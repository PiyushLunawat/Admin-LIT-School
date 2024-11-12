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
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentApplicationHeader } from "./application-dialog/dialog-header";
import { PersonalDetailsTab } from "./application-dialog/personal-details-tab";
import { PaymentInformationTab } from "./application-dialog/payment-info-tab";
import { DocumentsTab } from "./application-dialog/document-tab";

interface Application {
  id: string;
  name: string;
  applicationId: string;
  submissionDate: string;
  status: string;
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

  // Sample data, would be fetched based on cohortId in a real app
  const applications: Application[] = [
    {
      id: "1",
      name: "John Doe",
      applicationId: "APP001",
      submissionDate: "2024-03-15",
      status: "Under Review",
    },
    {
      id: "2",
      name: "Jane Smith",
      applicationId: "APP002",
      submissionDate: "2024-03-14",
      status: "Interview Scheduled",
      interviewDate: "2024-03-20",
      interviewTime: "1:45 PM",
    },
    {
      id: "3",
      name: "Jane Smith",
      applicationId: "APP002",
      submissionDate: "2024-03-14",
      status: "Update Status",
      interviewDate: "2024-03-20",
      interviewTime: "1:45 PM",
    },
    {
      id: "4",
      name: "Jane Smith",
      applicationId: "APP002",
      submissionDate: "2024-03-14",
      status: "Interview Rescheduled",
      interviewDate: "2024-03-20",
      interviewTime: "1:45 PM",
    },
    {
      id: "5",
      name: "Mike Johnson",
      applicationId: "APP003",
      submissionDate: "2024-03-13",
      status: "Accepted",
    },
    {
      id: "6",
      name: "Mike Johnson",
      applicationId: "APP003",
      submissionDate: "2024-03-13",
      status: "Rejected",
    },
    {
      id: "7",
      name: "Mike Johnson",
      applicationId: "APP003",
      submissionDate: "2024-03-13",
      status: "On Hold",
    },
  ];

  const getStatusColor = (status: string): string => {
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
        return "primary";
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
      onSelectedIdsChange(applications.map((app) => app.id));
    }
  };

  const toggleSelectApplication = (id: string) => {
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
          {applications.map((application) => (
            <TableRow
              key={application.id}
              className="cursor-pointer"
              onClick={() => onApplicationSelect(application.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(application.id)}
                  onCheckedChange={() => toggleSelectApplication(application.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{application.name}</TableCell>
              <TableCell>{application.applicationId}</TableCell>
              <TableCell>
                {new Date(application.submissionDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(application.status)}>
                  {application.status}
                </Badge>
              </TableCell>
              <TableCell>
                {application.interviewDate ? (
                  <>
                    <div className="flex items-center text-xs">
                      <Clock4Icon className="h-3 w-3 mr-1" />
                      {application.interviewTime}
                    </div>
                    <div className="flex items-center text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(application.interviewDate).toLocaleDateString()}
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
      <DialogContent className="max-w-4xl py-2 px-6 h-[90vh] overflow-y-auto">
          <StudentApplicationHeader studentId="1" />

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalDetailsTab studentId="1" />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentInformationTab studentId="1" />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTab studentId="1" />
        </TabsContent>
      </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}




// <Dialog open={open} onOpenChange={setOpen}>
      
//       </Dialog>