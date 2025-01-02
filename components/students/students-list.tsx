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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Mail, UserMinus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getStudents } from "@/app/api/student";
import { SendMessage } from "../cohorts/dashboard/tabs/applications/application-dialog/send-message";
import { Dialog, DialogContent } from "../ui/dialog";

type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "onhold"
  | "default";

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

  // Filter props
  searchQuery: string;
  selectedProgram: string;
  selectedCohort: string;
  selectedAppStatus: string;
  selectedPaymentStatus: string;
}

export function StudentsList({
  selectedIds,
  onSelectedIdsChange,

  // Filter props
  searchQuery,
  selectedProgram,
  selectedCohort,
  selectedAppStatus,
  selectedPaymentStatus,
}: StudentsListProps) {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageOpen, setMessageOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleSendMessage = (type: string, recipient: string) => {
    setSelectedMessage(type);
    setRecipient(recipient)
    setMessageOpen(true);
  };

  // --- FETCH ALL STUDENTS ONCE ---
  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      try {
        const response = await getStudents();
        const mappedStudents = response.data.map((student: any) => ({
          id: student._id,
          name: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
          applicationId: student.applicationId || "--",
          email: student.email || "--",
          phone: student.mobileNumber || "--",
          program: student.program?.name || "--",
          cohort: student.cohort?.cohortId || "--",
          applicationStatus:
            student.applicationDetails?.applicationStatus?.toLowerCase() || "--",
          enrollmentStatus:
            student.litmusTestDetails[0]?.litmusTaskId?.status?.toLowerCase() ||
            "not enrolled",
          paymentStatus: student.paymentStatus?.toLowerCase() || "pending",
          scholarship: student.scholarship ? `${student.scholarship}%` : "--",
          lastActivity: student.updatedAt || new Date().toISOString(),
        }));

        // Sort the students by lastActivity (descending)
        mappedStudents.sort((a: any, b: any) => {
          const dateA = new Date(a.lastActivity).getTime();
          const dateB = new Date(b.lastActivity).getTime();
          return dateB - dateA;
        });

        setStudents(mappedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  // --- FILTERING LOGIC ---
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // 1) Search check: by name OR email OR phone
      const lowerSearch = searchQuery.toLowerCase();
      const matchesSearch =
        student.name.toLowerCase().includes(lowerSearch) ||
        student.email.toLowerCase().includes(lowerSearch) ||
        student.phone.toLowerCase().includes(lowerSearch);

      if (!matchesSearch) {
        return false;
      }

      // 2) Program check
      if (selectedProgram !== "all-programs") {
        if (student.program.toLowerCase() !== selectedProgram.toLowerCase()) {
          return false;
        }
      }

      // 3) Cohort check
      if (selectedCohort !== "all-cohorts") {
        if (student.cohort.toLowerCase() !== selectedCohort.toLowerCase()) {
          return false;
        }
      }

      // 4) Application Status check
      if (selectedAppStatus !== "all-statuses") {
        // e.g. "under review" vs. "accepted"
        if (student.applicationStatus !== selectedAppStatus) {
          return false;
        }
      }

      // 5) Payment Status check
      if (selectedPaymentStatus !== "all-payments") {
        if (student.paymentStatus !== selectedPaymentStatus) {
          return false;
        }
      }

      return true;
    });
  }, [
    students,
    searchQuery,
    selectedProgram,
    selectedCohort,
    selectedAppStatus,
    selectedPaymentStatus,
  ]);

  // --- BADGE COLOR LOGIC ---
  const getStatusColor = (status: string): BadgeVariant => {
    switch (status) {
      case "initiated":
        return "default";
      case "under review":
        return "secondary";
      case "on hold":
        return "onhold";
      case "accepted":
        return "success";
      case "rejected":
        return "destructive";
      case "completed":
        return "success";
      case "not enrolled":
        return "default";
      case "dropped":
        return "destructive";
      case "token paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // --- SELECTION LOGIC ---
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(filteredStudents.map((s) => s.id));
    }
  };

  const toggleSelectStudent = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedIdsChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onSelectedIdsChange([...selectedIds, id]);
    }
  };

  // --- ACTIONS ---
  const handleViewDetails = (studentId: string) => {
    router.push(`/dashboard/students/${studentId}`);
  };

  if (loading) {
    return <div className="p-4">Loading students...</div>;
  }

  return (
    <>
      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                {/* Select All checkbox */}
                <Checkbox
                  checked={
                    filteredStudents.length > 0 &&
                    selectedIds.length === filteredStudents.length
                  }
                  onCheckedChange={toggleSelectAll}
                  disabled={filteredStudents.length === 0}
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
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
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
                      <p className="text-sm text-muted-foreground">
                        {student.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{student.program}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.cohort}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={getStatusColor(student.applicationStatus)}
                    >
                      {student.applicationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={getStatusColor(student.enrollmentStatus)}
                    >
                      {student.enrollmentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={getStatusColor(student.paymentStatus)}
                    >
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
                      <Button variant="ghost" size="icon" onClick={() => handleSendMessage('email', student?.email)}>
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" side="top" className="max-w-[345px] w-full">
                        <div className="text-base font-medium mb-2">
                          {`Are you sure you would like to drop ${student.name}`}
                        </div>
                        <div className="flex gap-2 ">
                          <Button variant="outline" className="flex-1" >Cancel</Button>
                          <Button className="bg-[#FF503D]/20 hover:bg-[#FF503D]/30 text-[#FF503D] flex-1" >Drop</Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent className="max-w-4xl">
          <SendMessage
            type={selectedMessage}
            recipient={recipient}
          />
        </DialogContent>
      </Dialog>
      {/* If you want pagination, you can add it here */}
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        ...
      </div> */}
    </>
  );
}
