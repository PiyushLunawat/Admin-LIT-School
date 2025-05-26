"use client";

import { Eye } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BadgeVariant,
  PaymentRecord,
  PaymentsListProps,
} from "@/types/components/cohorts/dashboard/tabs/payments/payments-list";

const PersonalDetailsTab = dynamic(
  () =>
    import("../applications/application-dialog/personal-details-tab").then(
      (m) => m.PersonalDetailsTab
    ),
  { ssr: false }
);

const StudentApplicationHeader = dynamic(
  () =>
    import("../applications/application-dialog/dialog-header").then(
      (m) => m.StudentApplicationHeader
    ),
  { ssr: false }
);

const PaymentInformationTab = dynamic(
  () =>
    import("../applications/application-dialog/payment-info-tab").then(
      (m) => m.PaymentInformationTab
    ),
  { ssr: false }
);

const DocumentsTab = dynamic(
  () =>
    import("../applications/application-dialog/document-tab").then(
      (m) => m.DocumentsTab
    ),
  { ssr: false }
);

export function PaymentsList({
  applications,
  onStudentSelect,
  selectedIds,
  onApplicationUpdate,
  onSelectedIdsChange,
}: PaymentsListProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [selectedRowId, setSelectedRowId] = useState<string | null>(
    applications[0]?._id || null
  );

  const getStatusColor = (status: PaymentRecord["status"]): BadgeVariant => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "complete":
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
      onSelectedIdsChange(
        selectedIds.filter((s: any) => s._id !== student._id)
      );
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
  if (selectedRowId && onStudentSelect) {
    const existingApplication = applications.find(
      (app) => app._id === selectedRowId
    );
    if (existingApplication) {
      onStudentSelect(existingApplication);
      return; // ✅ Keep current selection
    }
  }

  // ✅ Fallback to first application if none selected or previous no longer exists
  if (applications.length > 0) {
    const firstApplication = applications?.[0];
    setSelectedRowId(firstApplication._id);
    onStudentSelect(firstApplication);
  } else {
    setSelectedRowId(null);
    onStudentSelect(null);
  }
}, [applications]);


  return applications.length === 0 ? (
    <div className="w-full h-full flex items-center justify-center text-center text-muted-foreground border rounded-md">
      <div>No Students found.</div>
    </div>
  ) : (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
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
            const latestCohort =
              application?.appliedCohorts?.[
                application?.appliedCohorts.length - 1
              ];
            const litmusTestDetails = latestCohort?.litmusTestDetails;
            let tokenFeeDetails = latestCohort?.tokenFeeDetails;
            const scholarshipDetails = litmusTestDetails?.scholarshipDetail;
            const paymentDetails = latestCohort?.paymentDetails;

            if (paymentDetails?.paymentPlan === "one-shot") {
              const oneShotDetails = paymentDetails?.oneShotPayment;
              if (oneShotDetails) {
                if (oneShotDetails?.verificationStatus === "paid") {
                  paidCount += 1;
                } else {
                  notPaidCount += 1;
                }

                dueDate = new Date(
                  oneShotDetails?.installmentDate
                ).toLocaleDateString();

                if (new Date(oneShotDetails?.installmentDate) < new Date()) {
                  paymentStatus = "overdue";
                } else if(oneShotDetails?.verificationStatus === "paid") {
                  paymentStatus = "complete";
                  dueDate = "--";
                } else {
                  paymentStatus = oneShotDetails?.verificationStatus;
                }
              }
            }
            if (paymentDetails?.paymentPlan === "instalments") {
              const installmentsDetails = paymentDetails?.installments;
              let earliestUnpaid = installmentsDetails?.[0]?.installments?.[0];
              let allPaid = true;

              for (const installment of installmentsDetails || []) {
                if (installment.verificationStatus !== "paid") {
                  allPaid = false;
                  earliestUnpaid = installment;
                  break;
                }
              }
              if (allPaid) {
                paymentStatus = "complete";
                dueDate = "--";
              } else if (
                new Date(earliestUnpaid.installmentDate) < new Date()
              ) {
                dueDate = new Date(
                  earliestUnpaid.installmentDate
                ).toLocaleDateString();
                paymentStatus = "overdue";
              } else {
                dueDate = new Date(
                  earliestUnpaid.installmentDate
                ).toLocaleDateString();
                paymentStatus = earliestUnpaid.verificationStatus;
              }

              installmentsDetails?.forEach((installment: any) => {
                if (installment?.verificationStatus === "paid") {
                  paidCount += 1;
                } else {
                  notPaidCount += 1;
                }
              });
            }

            return (
              <TableRow
                key={application._id}
                className={`cursor-pointer ${
                  selectedRowId === application._id ? "bg-muted" : ""
                }`}
                onClick={() => {
                  onStudentSelect(application);
                  setSelectedRowId(application._id);
                }}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.some(
                      (s: any) => s._id === application?._id
                    )}
                    onCheckedChange={() => toggleSelectStudent(application)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {`${application?.firstName || ""} ${
                    application?.lastName || ""
                  }`.trim()}
                </TableCell>
                <TableCell className="capitalize">
                  {paymentDetails?.paymentPlan || "--"}
                </TableCell>
                <TableCell>
                  {paymentDetails?.paymentPlan
                    ? `${paidCount}/${paidCount + notPaidCount} Instalments`
                    : "Admission Fee"}
                </TableCell>
                <TableCell>
                  {paymentDetails?.paymentPlan
                    ? `${dueDate}`
                    : `${new Date(
                        new Date(latestCohort?.cohortId?.startDate).setDate(
                          new Date(
                            latestCohort?.cohortId?.startDate
                          ).getDate() - 7
                        )
                      ).toLocaleDateString()}`}
                </TableCell>
                <TableCell>
                  {latestCohort?.status === "dropped" ? (
                    <Badge
                      className="capitalize max-w-28 truncate"
                      variant={getStatusColor(latestCohort?.status)}
                    >
                      {latestCohort?.status}
                    </Badge>
                  ) : paymentDetails?.paymentPlan ? (
                    <Badge
                      className="capitalize"
                      variant={getStatusColor(paymentStatus)}
                    >
                      {paymentStatus}
                    </Badge>
                  ) : (
                    <Badge
                      className="capitalize"
                      variant={getStatusColor(
                        tokenFeeDetails?.verificationStatus
                      )}
                    >
                      {tokenFeeDetails?.verificationStatus === "flagged"
                        ? "pending"
                        : tokenFeeDetails?.verificationStatus}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEyeClick(application);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {/* <Button variant="ghost" size="icon"
                    onClick={(e) => { e.stopPropagation(); console.log("Send reminder to:", application.id); }} >
                    <Mail className="h-4 w-4" />
                  </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="flex flex-col gap-4 max-w-[90vw] sm:max-w-4xl py-2 px-4 sm:px-6 h-[90vh] overflow-y-auto">
          {selectedStudentId && (
            <StudentApplicationHeader
              student={selectedStudentId}
              onUpdateStatus={() => onApplicationUpdate()}
            />
          )}

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="w-full">
              <TabsTrigger value="personal">Personal Details</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <PersonalDetailsTab
                student={selectedStudentId}
                onUpdateStatus={handleStatusUpdate}
              />
            </TabsContent>

            <TabsContent value="payment">
              <PaymentInformationTab
                student={selectedStudentId}
                onUpdateStatus={handleStatusUpdate}
              />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentsTab
                student={selectedStudentId}
                onUpdateStatus={handleStatusUpdate}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
