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
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { MarkedAsDialog } from "./sections/drop-dialog";

type BadgeVariant = "pending" | "destructive" | "warning" | "secondary" | "success" | "onhold" | "default";

interface StudentsListProps {
  selectedIds: any[];
  onSelectedIdsChange: (ids: any[]) => void;
  applications: any;
  onApplicationUpdate: () => void;
}

export function StudentsList({
  selectedIds,
  onSelectedIdsChange,
  applications,
  onApplicationUpdate
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
      case "payment due":
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
      case "enrolled":
        return "success";
      case "pending":
        return "pending";
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
      onSelectedIdsChange(applications);
    }
  };

  const toggleSelectStudent = (student: any) => {
    if (selectedIds.some((s: any) => s._id === student._id)) {
      onSelectedIdsChange(selectedIds.filter((s: any) => s._id !== student._id));
    } else {
      onSelectedIdsChange([...selectedIds, student]);
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
                <Checkbox
                  checked={applications.length > 0 && selectedIds.length === applications.length}
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

                let paymentStage = "";
                let paymentStatus = "pending";
                const paymentDetails = latestCohort?.paymentDetails;

                if(!paymentDetails?.paymentPlan) {
                  paymentStatus = tokenFeeDetails?.verificationStatus ;
                  paymentStage = `Adm. Fee`
                } else if (paymentDetails?.paymentPlan === 'one-shot') {
                  const oneShotDetails = paymentDetails?.oneShotPayment;
                  if (oneShotDetails) {
                    if (new Date(oneShotDetails?.installmentDate) < new Date()) {
                      paymentStatus = "overdue";
                      paymentStage = `One-Shot`

                    } else {
                      paymentStatus = oneShotDetails?.verificationStatus ;
                      paymentStage = `One-Shot`
                    }

                  }
                } else if (paymentDetails?.paymentPlan === 'instalments') {
                  const installmentsDetails = paymentDetails?.installments
                  let earliestUnpaid= installmentsDetails?.[0]?.installments?.[0];
                  let allPaid = true;

                    for (const installment of installmentsDetails || []) {
                      if (installment.verificationStatus !== "paid") {
                        allPaid = false;
                        earliestUnpaid = installment;
                        break;
                      }
                    }
                  if (allPaid) {
                    paymentStatus = "Complete";
                    paymentStage = "";
                  } else if (new Date(earliestUnpaid.installmentDate) < new Date()) {

                    paymentStage = `S${earliestUnpaid?.semester} Inst.${earliestUnpaid?.installmentNumber}`
                    paymentStatus = "overdue";
                  } else {
                    paymentStage = `S${earliestUnpaid?.semester} Inst.${earliestUnpaid?.installmentNumber}`
                    paymentStatus = earliestUnpaid.verificationStatus;
                  }
                }

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
                      checked={selectedIds.some( (s: any) => s._id === student?._id)}
                      onCheckedChange={() => toggleSelectStudent(student)}
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
                  <TableCell className="space-x-1">
                    <span className="text-xs text-muted-foreground">{paymentStage}</span>
                    <Badge
                      className="capitalize"
                      variant={getStatusColor(paymentStatus || "payment due")}
                    >
                      {(paymentStatus)?.toLowerCase() || "payment due"}
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
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(student._id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {/* <Button variant="ghost" size="icon" onClick={() => handleSendMessage('email', student?.email)}>
                        <Mail className="h-4 w-4" />
                      </Button> */}
                      <Dialog >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="justify-start text-destructive" disabled={latestCohort?.status === 'dropped' || ['rejected', 'not qualified'].includes(applicationDetails?.applicationStatus)}>
                            <UserMinus className="h-4 w-4 mr-2" />
                          </Button>
                        </DialogTrigger>
                        <DialogTitle></DialogTitle>
                        <DialogContent className="max-w-[90vw] sm:max-w-4xl py-4 px-6">
                          <MarkedAsDialog student={student} onUpdateStatus={() => onApplicationUpdate()}
                           onClose={() => {}} />
                        </DialogContent>
                        <DialogClose asChild />
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
      <DialogTitle></DialogTitle>
        <DialogContent className="max-w-[90vw] sm:max-w-4xl">
          <SendMessage
            type={selectedMessage}
            recipient={recipient}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
