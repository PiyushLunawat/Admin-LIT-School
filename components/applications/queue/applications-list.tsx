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
import { Eye, Clock } from "lucide-react";

interface ApplicationsListProps {
  onApplicationSelect: (id: string) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

export function ApplicationsList({
  onApplicationSelect,
  selectedIds,
  onSelectedIdsChange,
}: ApplicationsListProps) {
  const applications = [
    {
      id: "1",
      name: "John Doe",
      applicationId: "APP001",
      submissionDate: "2024-03-15",
      daysPending: 5,
      priority: "High",
      status: "Pending Review",
    },
    {
      id: "2",
      name: "Jane Smith",
      applicationId: "APP002",
      submissionDate: "2024-03-14",
      daysPending: 6,
      priority: "Medium",
      status: "Under Review",
    },
    {
      id: "3",
      name: "Mike Johnson",
      applicationId: "APP003",
      submissionDate: "2024-03-13",
      daysPending: 7,
      priority: "Low",
      status: "Reviewed",
    },
  ];

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(applications.map(app => app.id));
    }
  };

  const toggleSelectApplication = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedIdsChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectedIdsChange([...selectedIds, id]);
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "pending review":
        return "warning";
      case "under review":
        return "primary";
      case "reviewed":
        return "success";
      default:
        return "default";
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
            <TableHead>Applicant</TableHead>
            <TableHead>Application ID</TableHead>
            <TableHead>Days Pending</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
              <TableCell>
                <div>
                  <p className="font-medium">{application.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Submitted: {new Date(application.submissionDate).toLocaleDateString()}
                  </p>
                </div>
              </TableCell>
              <TableCell>{application.applicationId}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  {application.daysPending} days
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityColor(application.priority)}>
                  {application.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(application.status)}>
                  {application.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplicationSelect(application.id);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}