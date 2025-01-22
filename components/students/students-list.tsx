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
import { MarkedAsDialog } from "./sections/drop-dialog";

type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "onhold"
  | "default";

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
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageOpen, setMessageOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>();
  const [recipient, setRecipient] = useState('');
  const [markedAsDialogOpen, setMarkedAsDialogOpen] = useState(false)

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
          ...student,
          litmusTestDetails: student.litmusTestDetails || [], // Add default value
        }));
        
        // Sort the students by lastActivity (descending)
        let sorted = mappedStudents
        mappedStudents.sort((a: any, b: any) => {
          const dateA = new Date(a?.updatedAt).getTime();
          const dateB = new Date(b?.updatedAt).getTime();
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
        (student?.firstName+' '+student?.lastName).toLowerCase().includes(lowerSearch) ||
        student?.email.toLowerCase().includes(lowerSearch) ||
        student?.mobileNumber.toLowerCase().includes(lowerSearch);

      if (!matchesSearch) {
        return false;
      }

      // 2) Program check
      if (selectedProgram !== "all-programs") {
        if (student?.program?.name.toLowerCase() !== selectedProgram.toLowerCase()) {
          return false;
        }
      }

      // 3) Cohort check
      if (selectedCohort !== "all-cohorts") {
        if (student?.cohort?.cohortId.toLowerCase() !== selectedCohort.toLowerCase()) {
          return false;
        }
      }

      // 4) Application Status check
      if (selectedAppStatus !== "all-statuses") {
        // e.g. "under review" vs. "accepted"
        if (student?.applicationDetails?.applicationStatus !== selectedAppStatus) {
          return false;
        }
      }

      // 5) Payment Status check
      if (selectedPaymentStatus !== "all-payments") {
        if (student?.paymentStatus !== selectedPaymentStatus) {
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

  const handleDrop = (student: any) => {
    setMarkedAsDialogOpen(true);
    setSelectedStudent(student)
  }

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
              filteredStudents.map((student: any) => {
                
                const colorClasses = [
                  'text-emerald-600 !bg-emerald-600/20 border-emerald-600',
                  'text-[#3698FB] !bg-[#3698FB]/20 border-[#3698FB]',
                  'text-[#FA69E5] !bg-[#FA69E5]/20 border-[#FA69E5]',
                  'text-orange-600 !bg-orange-600/20 border-orange-600'
                ];

                const getColor = (slabName: string): string => {
                  const indx = student?.cohort?.litmusTestDetail?.[0]?.scholarshipSlabs.findIndex(
                    (slab: any) => slab.name === slabName
                  );
                  return indx !== -1 ? colorClasses[indx % colorClasses.length] : 'text-default';
                };
  
                return(
                <TableRow key={student?._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(student?._id)}
                      onCheckedChange={() => toggleSelectStudent(student?._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{`${student?.firstName || ""} ${student?.lastName || ""}`.trim()}</p>
                      <p className="text-sm text-muted-foreground">
                        {student?.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student?.mobileNumber}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{student?.program?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student?.cohort?.cohortId}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={getStatusColor(student?.applicationDetails?.applicationStatus)}
                    >
                      {student?.applicationDetails?.applicationStatus?.toLowerCase() || "--"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={getStatusColor(student?.litmusTestDetails?.[0]?.litmusTaskId?.status || '')}
                    >
                      {student?.litmusTestDetails?.[0]?.litmusTaskId?.status?.toLowerCase() || "not enrolled"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={getStatusColor(student?.paymentStatus)}
                    >
                      {student?.paymentStatus?.toLowerCase() || "pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student?.cousrseEnrolled?.[student?.cousrseEnrolled?.length - 1]?.semesterFeeDetails?.scholarshipName ? 
                    <Badge className={`capitalize ${getColor(student?.cousrseEnrolled?.[student?.cousrseEnrolled?.length - 1]?.semesterFeeDetails?.scholarshipName)}`} variant="secondary">
                      {student?.cousrseEnrolled?.[student?.cousrseEnrolled?.length - 1]?.semesterFeeDetails?.scholarshipName+' ('+student?.cousrseEnrolled?.[student.cousrseEnrolled?.length - 1]?.semesterFeeDetails?.scholarshipPercentage+'%)'}
                    </Badge> : 
                    '--'}
                  </TableCell>
                  <TableCell>
                    {new Date(student?.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(student._id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {/* <Button variant="ghost" size="icon" onClick={() => handleSendMessage('email', student?.email)}>
                        <Mail className="h-4 w-4" />
                      </Button> */}
                      <Button variant="ghost" size="icon" className="justify-start text-destructive" onClick={()=>handleDrop(student)}>
                        <UserMinus className="h-4 w-4 mr-2" />
                      </Button>
                      <Dialog open={markedAsDialogOpen} onOpenChange={setMarkedAsDialogOpen}>
                        <DialogContent className="max-w-4xl py-4 px-6">
                          <MarkedAsDialog student={selectedStudent}/>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              )})
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
