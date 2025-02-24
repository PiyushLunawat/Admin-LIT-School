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

type BadgeVariant = "lemon" | "destructive" | "warning" | "secondary" | "success" | "onhold" | "default";

interface StudentsListProps {
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  applications: any;
}

export function StudentsList({
  selectedIds,
  onSelectedIdsChange,
  applications,
}: StudentsListProps) {
  const router = useRouter();
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
  
  // --- BADGE COLOR LOGIC ---
  const getStatusColor = (status: string): BadgeVariant => {
    switch (status) {
      case "initiated":
        return "default";
      case "under review":
      case "interview scheduled":
      case "applied":
        return "secondary";
      case "on hold":
      case "waitlist":
      case "reviewing":
        return "onhold";
      case "accepted":
        return "success";
      case "rejected":
      case "not qualified":
      case "overdue":
        return "warning";
      case "accepted":
      case "selected":
      case "paid":
        return "success";
      case "pending":
        return "lemon";
      case "dropped":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // --- SELECTION LOGIC ---
  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(applications.map((s: any) => s.id));
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
                    applications.length > 0 &&
                    selectedIds.length === applications.length
                  }
                  onCheckedChange={toggleSelectAll}
                  disabled={applications.length === 0}
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
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              applications.map((student: any) => {
                const latestCohort = student?.appliedCohorts?.[student?.appliedCohorts.length - 1];
                const cohortDetails = latestCohort?.cohortId;
                const applicationDetails = latestCohort?.applicationDetails;
                const litmusTestDetails = latestCohort?.litmusTestDetails;
                const scholarshipDetails = litmusTestDetails?.scholarshipDetail;
                const tokenFeeDetails = latestCohort?.tokenFeeDetails;
                
                const colorClasses = [
                  'text-emerald-600 !bg-emerald-600/20 border-emerald-600',
                  'text-[#3698FB] !bg-[#3698FB]/20 border-[#3698FB]',
                  'text-[#FA69E5] !bg-[#FA69E5]/20 border-[#FA69E5]',
                  'text-orange-600 !bg-orange-600/20 border-orange-600'
                ];

                const getColor = (slabName: string): string => {
                  const index = cohortDetails?.litmusTestDetail?.[0]?.scholarshipSlabs.findIndex(
                    (slab: any) => slab.name === slabName
                  );
                  return index !== -1 ? colorClasses[index % colorClasses.length] : 'text-default';
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
                      <p className="font-medium">{cohortDetails?.programDetail?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {cohortDetails?.cohortId}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={getStatusColor(applicationDetails?.applicationStatus)}
                    >
                      {applicationDetails?.applicationStatus?.toLowerCase() || "--"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={getStatusColor(latestCohort?.status || '')}
                    >
                      {latestCohort?.status?.toLowerCase() || "not enrolled"}
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
                    {scholarshipDetails ? 
                    <Badge className={`capitalize ${getColor(scholarshipDetails?.scholarshipName)}`} variant="secondary">
                      {scholarshipDetails?.scholarshipName+' ('+scholarshipDetails?.scholarshipPercentage+'%)'}
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
