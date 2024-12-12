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
import { Progress } from "@/components/ui/progress";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";
interface StudentsListProps {
  onStudentSelect: (id: string) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

export function StudentsList({
  onStudentSelect,
  selectedIds,
  onSelectedIdsChange,
}: StudentsListProps) {
  const students = [
    {
      id: "1",
      name: "John Doe",
      program: "Creator Marketer",
      cohort: "CM01JY",
      totalFees: "₹9,95,000",
      paidAmount: "₹4,97,500",
      nextDueDate: "2024-03-25",
      status: "Current",
    },
    {
      id: "2",
      name: "Jane Smith",
      program: "Creator Marketer",
      cohort: "CM02JY",
      totalFees: "₹9,95,000",
      paidAmount: "₹9,95,000",
      status: "Complete",
    },
    {
      id: "3",
      name: "Mike Johnson",
      program: "Digital Marketing",
      cohort: "DM01JY",
      totalFees: "₹9,95,000",
      paidAmount: "₹1,65,833",
      nextDueDate: "2024-03-15",
      status: "Overdue",
    },
  ];

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "current":
        return "success";
      case "overdue":
        return "destructive";
      case "complete":
        return "secondary";
      case "defaulter":
        return "destructive";
      default:
        return "default";
    }
  };

  const calculateProgress = (paid: string, total: string): number => {
    const paidAmount = parseInt(paid.replace(/[^0-9]/g, ""));
    const totalAmount = parseInt(total.replace(/[^0-9]/g, ""));
    return (paidAmount / totalAmount) * 100;
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
            <TableHead>Payment Progress</TableHead>
            <TableHead>Next Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow 
              key={student.id}
              className="cursor-pointer"
              onClick={() => onStudentSelect(student.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(student.id)}
                  onCheckedChange={() => toggleSelectStudent(student.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p>{student.program}</p>
                  <p className="text-sm text-muted-foreground">{student.cohort}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                <Progress states={[ {value:(calculateProgress(student.paidAmount, student.totalFees))} ]}
                  />
                  <div className="flex justify-between text-sm">
                    <span>{student.paidAmount}</span>
                    <span className="text-muted-foreground">{student.totalFees}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {student.nextDueDate ? (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(student.nextDueDate).toLocaleDateString()}
                  </div>
                ) : "-"}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(student.status)}>
                  {student.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStudentSelect(student.id);
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