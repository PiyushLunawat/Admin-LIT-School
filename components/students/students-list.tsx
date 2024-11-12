"use client";

import { useRouter } from "next/navigation";
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
import { Eye, Mail, UserMinus } from "lucide-react";

interface Student {
  id: string;
  name: string;
  applicationId: string;
  email: string;
  phone: string;
  program: string;
  cohort: string;
  applicationStatus: string;
  enrollmentStatus: string;
  paymentStatus: string;
  scholarship: string;
  lastActivity: string;
}

interface StudentsListProps {
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

export function StudentsList({
  selectedIds,
  onSelectedIdsChange,
}: StudentsListProps) {
  const router = useRouter();

  // In a real application, this data would be fetched from an API
  const students: Student[] = [
    {
      id: "1",
      name: "John Doe",
      applicationId: "APP001",
      email: "john.doe@example.com",
      phone: "+91 98765 43210",
      program: "Creator Marketer",
      cohort: "CM01JY",
      applicationStatus: "Accepted",
      enrollmentStatus: "Enrolled",
      paymentStatus: "Token Paid",
      scholarship: "5%",
      lastActivity: "2024-03-20",
    },
    {
      id: "2",
      name: "Jane Smith",
      applicationId: "APP002",
      email: "jane.smith@example.com",
      phone: "+91 98765 43211",
      program: "Creator Marketer",
      cohort: "CM02JY",
      applicationStatus: "Under Review",
      enrollmentStatus: "Not Enrolled",
      paymentStatus: "Pending",
      scholarship: "-",
      lastActivity: "2024-03-19",
    },
    {
      id: "3",
      name: "Mike Johnson",
      applicationId: "APP003",
      email: "mike.johnson@example.com",
      phone: "+91 98765 43212",
      program: "Digital Marketing",
      cohort: "DM01JY",
      applicationStatus: "Interview Scheduled",
      enrollmentStatus: "Not Enrolled",
      paymentStatus: "Pending",
      scholarship: "-",
      lastActivity: "2024-03-18",
    },
  ];

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "success";
      case "under review":
        return "warning";
      case "rejected":
        return "destructive";
      case "enrolled":
        return "success";
      case "not enrolled":
        return "secondary";
      case "dropped":
        return "destructive";
      case "token paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "destructive";
      default:
        return "default";
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === students.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(students.map(student => student.id));
    }
  };

  const toggleSelectStudent = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedIdsChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectedIdsChange([...selectedIds, id]);
    }
  };

  const handleViewDetails = (studentId: string) => {
    router.push(`/dashboard/students/${studentId}`);
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === students.length}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Program & Cohort</TableHead>
            <TableHead>Application Status</TableHead>
            <TableHead>Enrollment Status</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Scholarship</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(student.id)}
                  onCheckedChange={() => toggleSelectStudent(student.id)}
                />
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                  <p className="text-sm text-muted-foreground">{student.phone}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{student.program}</p>
                  <p className="text-sm text-muted-foreground">{student.cohort}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(student.applicationStatus)}>
                  {student.applicationStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(student.enrollmentStatus)}>
                  {student.enrollmentStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(student.paymentStatus)}>
                  {student.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell>{student.scholarship}</TableCell>
              <TableCell>
                {new Date(student.lastActivity).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewDetails(student.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <UserMinus className="h-4 w-4" />
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