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
import { Calendar, Eye, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { getStudents } from "@/app/api/student";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";
interface PaymentRecord {
  id: string;
  studentName: string;
  paymentPlan: "One-Shot" | "Instalments";
  tokenPaid: boolean;
  instalmentsPaid: number;
  totalInstalments: number;
  nextDueDate?: string;
  status: "On Time" | "Overdue" | "Complete";
  scholarship?: string;
}

interface PaymentsListProps {
  applications: any[];
  onStudentSelect: (id: string) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

export function PaymentsList({
  applications,
  onStudentSelect,
  selectedIds,
  onSelectedIdsChange,
}: PaymentsListProps) {
 
   const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
  const getStatusColor = (status: PaymentRecord["status"]): BadgeVariant => {
    switch (status?.toLowerCase()) {
      case "on time":
        return "success";
      case "overdue":
        return "warning";
      case "complete":
        return "secondary";
      default:
        return "default";
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(applications.map(payment => payment._id));
    }
  };

  const toggleSelectPayment = (id: string) => {
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
                checked={selectedIds.length === applications.length}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Next Due</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications?.map((application: any) => (
            <TableRow 
              key={application._id}
              className="cursor-pointer"
              onClick={() => onStudentSelect(application.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(application._id)}
                  onCheckedChange={() => toggleSelectPayment(application._id)}
                />
              </TableCell>
              <TableCell className="font-medium">
                {`${application?.firstName || ""} ${application?.lastName || ""}`.trim()}
              </TableCell>
              <TableCell className="capitalize">{application?.cousrseEnrolled[application.cousrseEnrolled.length-1]?.feeSetup?.installmentType}</TableCell>
              <TableCell>
                {application.instalmentsPaid}/{application.totalInstalments} Instalments
              </TableCell>
              <TableCell>
                {application.nextDueDate ? (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(application.nextDueDate).toLocaleDateString()}
                  </div>
                ) : "--"}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(application.status)}>
                  {application.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStudentSelect(application.id);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Send reminder to:", application.id);
                    }}
                  >
                    <Mail className="h-4 w-4" />
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