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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentsTab } from "../applications/application-dialog/document-tab";
import { PersonalDetailsTab } from "../applications/application-dialog/personal-details-tab";
import { PaymentInformationTab } from "../applications/application-dialog/payment-info-tab";
import { StudentApplicationHeader } from "../applications/application-dialog/dialog-header";

type BadgeVariant = "pending" | "warning" | "secondary" | "success" | "default" | "destructive";
interface PaymentRecord {
  id: string;
  studentName: string;
  paymentPlan: "One-Shot" | "Instalments";
  tokenPaid: boolean;
  instalmentsPaid: number;
  totalInstalments: number;
  dueDate?: string;
  status: string;
  scholarship?: string;
}

interface PaymentsListProps {
  applications: any[];
  onStudentSelect: (id: any) => void;
  selectedIds: any[];
  onApplicationUpdate: () => void;
  onSelectedIdsChange: (ids: any[]) => void;
}

export function PaymentsList({
  applications,
  onStudentSelect,
  selectedIds,
  onApplicationUpdate,
  onSelectedIdsChange, 
}: PaymentsListProps) {
 
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(applications[0]?._id || null);
  
  const getStatusColor = (status: PaymentRecord["status"]): BadgeVariant => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "success";
      case "overdue":
        return "warning";
      case "flagged":
      case "verifying":
      case "verification pending":
        return "pending";
      case "dropped":
      return "destructive";
      default:
        return "default";
    }
  };

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

  const handleEyeClick = (student: any) => {
    setSelectedStudentId(student);
    setOpen(true);
  };

  const handleStatusUpdate = () => {
    onApplicationUpdate();
  };

  useEffect(() => {
    if (applications.length > 0) {      
      const firstApplication = applications?.[0];
      setSelectedRowId(firstApplication._id); 
      onStudentSelect(firstApplication); 
    } else {
      setSelectedRowId(null);
      onStudentSelect(null);
    }
  }, [applications]);

  return (
  applications.length === 0 ?
    <div className="w-full h-full flex items-center justify-center text-center text-muted-foreground border rounded-md">
      <div >No Students found.</div>
    </div> :
    <div className="border rounded-lg">
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
            <TableHead>Plan</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications?.map((application: any) => {
           
            let paidCount = 0;
            let notPaidCount = 0;
            let dueDate = "--";
            let paymentStatus = "pending";
            const latestCohort = application?.appliedCohorts?.[application?.appliedCohorts.length - 1];
            const litmusTestDetails = latestCohort?.litmusTestDetails;
            let tokenFeeDetails = latestCohort?.tokenFeeDetails;
            const scholarshipDetails = litmusTestDetails?.scholarshipDetail;
            const paymentDetails = latestCohort?.paymentDetails;

            
            if (paymentDetails?.paymentPlan === 'one-shot') {
              const oneShotDetails = paymentDetails?.oneShotPayment;
              if (oneShotDetails) {
                if (oneShotDetails?.verificationStatus === 'paid') {
                  paidCount += 1;
                } else{
                  notPaidCount +=1;
                }

                dueDate = new Date(oneShotDetails?.installmentDate).toLocaleDateString();

                if (new Date(oneShotDetails?.installmentDate) < new Date()) {
                  paymentStatus = "overdue";
                } else {
                  paymentStatus = oneShotDetails?.verificationStatus ;
                }

              }
            }
            if (paymentDetails?.paymentPlan === 'instalments') {
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
                dueDate = "--";
              } else if (new Date(earliestUnpaid.installmentDate) < new Date()) {

                dueDate = new Date(earliestUnpaid.installmentDate).toLocaleDateString();
                paymentStatus = "overdue";
              } else {
                dueDate = new Date(earliestUnpaid.installmentDate).toLocaleDateString();
                paymentStatus = earliestUnpaid.verificationStatus;
              }
        
              installmentsDetails?.forEach((installment: any) => {
                if (installment?.verificationStatus === 'paid') {
                  paidCount += 1;
                } else {
                  notPaidCount += 1;
                }    
              });
            }

            return(
            <TableRow 
              key={application._id}
              className={`cursor-pointer ${selectedRowId === application._id ? "bg-muted" : ""}`} 
              onClick={() => {
                onStudentSelect(application)
                setSelectedRowId(application._id);
              }}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.some( (s: any) => s._id === application?._id)}
                  onCheckedChange={() => toggleSelectStudent(application)}
                />
              </TableCell>
              <TableCell className="font-medium">
                {`${application?.firstName || ""} ${application?.lastName || ""}`.trim()}
              </TableCell>
              <TableCell className="capitalize">{paymentDetails?.paymentPlan || "--"}</TableCell>
              <TableCell>
                {paymentDetails?.paymentPlan ? 
                  `${paidCount}/${(paidCount + notPaidCount)} Instalments` : 'Admission Fee'
                }
              </TableCell>
              <TableCell>
                {paymentDetails?.paymentPlan ? 
                  `${dueDate}` :
                  `${new Date(new Date(latestCohort?.cohortId?.startDate).setDate(new Date(latestCohort?.cohortId?.startDate).getDate() - 7)).toLocaleDateString()}`
                }
              </TableCell>
              <TableCell>
                {latestCohort?.status === 'dropped' ?
                  <Badge className="capitalize max-w-28 truncate" variant={getStatusColor(latestCohort?.status)}>
                    {latestCohort?.status}
                  </Badge> :
                  paymentDetails?.paymentPlan ? 
                    <Badge className="capitalize" variant={getStatusColor(paymentStatus)}>
                      {paymentStatus}
                    </Badge> : 
                    <Badge className="capitalize" variant={getStatusColor(tokenFeeDetails?.verificationStatus)}>
                      {tokenFeeDetails?.verificationStatus === 'flagged' ? 'pending' : tokenFeeDetails?.verificationStatus}
                    </Badge>
                }
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon"
                    onClick={(e) => { e.stopPropagation(); handleEyeClick(application); }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {/* <Button variant="ghost" size="icon"
                    onClick={(e) => { e.stopPropagation(); console.log("Send reminder to:", application.id); }} >
                    <Mail className="h-4 w-4" />
                  </Button> */}
                </div>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle></DialogTitle>
      <DialogContent className="flex flex-col gap-4 max-w-4xl py-2 px-6 h-[90vh] overflow-y-auto">
          {selectedStudentId && (
            <StudentApplicationHeader student={selectedStudentId} onUpdateStatus={() => onApplicationUpdate()}/>
          )}

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalDetailsTab student={selectedStudentId} onUpdateStatus={handleStatusUpdate}/>
        </TabsContent>

        <TabsContent value="payment">
          <PaymentInformationTab student={selectedStudentId} onUpdateStatus={handleStatusUpdate} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTab student={selectedStudentId} onUpdateStatus={handleStatusUpdate} />
        </TabsContent>
      </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}