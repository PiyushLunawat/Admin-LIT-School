"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "onhold" | "lemon" | "default";

interface FeeCollectionListProps {
  applications: any;
  onApplicationSelect: (id: any) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

export function FeeCollectionList({
  applications,
  onApplicationSelect,
  selectedIds,
  onSelectedIdsChange,
}: FeeCollectionListProps) {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  
    const colorClasses = [
      'text-emerald-600',
      'text-[#3698FB]',
      'text-[#FA69E5]',
      'text-orange-600'
    ];
    
      const toggleSelectAll = () => {
        if (selectedIds.length === applications.length) {
          onSelectedIdsChange([]);
        } else {
          onSelectedIdsChange(applications.map((app: any) => app._id));
        }
      };
    
      const toggleSelectApplication = (id: string) => {
        if (selectedIds.includes(id)) {
          onSelectedIdsChange(selectedIds.filter(selectedId => selectedId !== id));
        } else {
          onSelectedIdsChange([...selectedIds, id]);
        }
      };
    
      const getStatusColor = (status: string): BadgeVariant => {
        switch (status?.toLowerCase()) {
          case "paid":
            return "success";
          case "overdue":
          case "flagged":
            return "warning";
          case "verification pending":
          case "pending":
            return "lemon";
          case "complete":
            return "default";
          default:
            return "default";
        }
      };
  
      const getColor = (slabName: string, application: any): string => {
        const index = application?.cohort?.litmusTestDetail?.[0]?.scholarshipSlabs.findIndex(
          (slab: any) => slab.name === slabName
        );
        
        return index !== -1 ? colorClasses[index % colorClasses.length] : 'text-default';
      };
  
      const timeAgo = (timestamp: string) => {
        const now = new Date();
        const date = new Date(timestamp);
        const diffInMs = now.getTime() - date.getTime(); // Difference in milliseconds
        
        const diffInSecs = Math.floor(diffInMs / 1000); // Seconds
        const diffInMins = Math.floor(diffInSecs / 60); // Minutes
        const diffInHours = Math.floor(diffInMins / 60); // Hours
        const diffInDays = Math.floor(diffInHours / 24); // Days
        
        if (diffInDays > 0) {
          return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
        } else if (diffInHours > 0) {
          return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
        } else if (diffInMins > 0) {
          return `${diffInMins} minute${diffInMins > 1 ? "s" : ""} ago`;
        } else if (diffInSecs > 0) {
          return `Just now`;
        } else {
          return ``;
        }
      };
    
      const formatAmount = (value: number | undefined) =>
        value !== undefined
          ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value))
          : "--";
  
      useEffect(() => {
        if (applications.length > 0) {
          const firstApplication = applications[0];
          setSelectedRowId(firstApplication._id); // Set the selected row ID to the first application
          onApplicationSelect(firstApplication); // Call the onApplicationSelect function for the first application
        }
      }, [applications]);

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
            <TableHead>Application ID</TableHead>
            <TableHead>Scholarship</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application: any) => {
            let paidCount = 0;
            let notPaidCount = 0;
            let dueDate = "--";
            let paidDate = "--";
            let paymentStatus = "pending";
            const lastEnrolled = application.cousrseEnrolled?.[application.cousrseEnrolled.length - 1];

            
            if (lastEnrolled?.feeSetup?.installmentType === 'one shot payment') {
              const oneShotDetails = lastEnrolled?.oneShotPayment;
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
                  paidDate = oneShotDetails?.receiptUrls?.uploadedDate ;
                }

              }
            }
            if (lastEnrolled?.feeSetup?.installmentType === 'instalments') {
            let earliestUnpaid= lastEnrolled?.installmentDetails[0]?.installments[0];
            let allPaid = true;

            outer: for (const semesterDetail of lastEnrolled?.installmentDetails || []) {
              for (const installment of semesterDetail.installments || []) {
                if (installment.verificationStatus !== "paid") {
                  allPaid = false;
                  earliestUnpaid = installment;
                  break outer;
                }
              }
            }
            
            if (allPaid) {
              paymentStatus = "complete";
              dueDate = "--";
            } else if (new Date(earliestUnpaid.installmentDate) < new Date()) {

              dueDate = new Date(earliestUnpaid.installmentDate).toLocaleDateString();
              paymentStatus = "overdue";
            } else {
              dueDate = new Date(earliestUnpaid.installmentDate).toLocaleDateString();
              paymentStatus = earliestUnpaid.verificationStatus;
              paidDate = earliestUnpaid?.receiptUrls?.uploadedDate
            }

            lastEnrolled?.installmentDetails.forEach((semesterDetail: any) => {
              const installments = semesterDetail?.installments;
              installments.forEach((installment: any) => {
                if (installment?.verificationStatus === 'paid') {
                  paidCount += 1;
                } else {
                  notPaidCount += 1;
                }    
              });
            });
          }

          return(
            <TableRow 
            key={application._id}
            className={`cursor-pointer ${selectedRowId === application._id ? "bg-muted" : ""}`}            
            onClick={() => {
              onApplicationSelect(application)
              setSelectedRowId(application._id);
            }}
          >
            <TableCell onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedIds.includes(application._id)}
                onCheckedChange={() => toggleSelectApplication(application._id)}
              />
            </TableCell>
            <TableCell className="font-medium">{application?.firstName || '-'} {application?.lastName || '-'}</TableCell>
            <TableCell className="">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="max-w-[100px] truncate">{application?._id || "--"}</TooltipTrigger>
                  <TooltipContent>
                    <p>{application?._id || "--"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="w-fit px-1.5 py-0.5 text-xs font-normal bg-[#FFFFFF]/10 rounded-sm">
                {application?.cohort?.cohortId}
              </div>
            </TableCell>
            <TableCell>
              {application?.litmusTestDetails?.[0]?.litmusTaskId?.scholarshipDetail ? (
                <div className="space-y-1">
                  <div className={`text-xs ${getColor(application?.cousrseEnrolled?.[application?.cousrseEnrolled?.length - 1]?.semesterFeeDetails?.scholarshipName, application)}`}>
                    {application?.cousrseEnrolled?.[application?.cousrseEnrolled?.length - 1]?.semesterFeeDetails?.scholarshipName}
                  </div>
                  <div className="text-base font-semibold">
                    {application?.cousrseEnrolled?.[application?.cousrseEnrolled?.length - 1]?.semesterFeeDetails?.scholarshipPercentage}% Wavier
                  </div>
                </div>
              ) : ( '--' )}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Badge className="capitalize" variant={getStatusColor(paymentStatus)}>
                    {paymentStatus}
                  </Badge>
                  {['pending', 'overdue'].includes(paymentStatus) ? 
                    <div className="text-xs">Due on {dueDate}</div> :
                    ['verification pending'].includes(paymentStatus) ? 
                      <div className="text-xs">Uploaded on {dueDate}</div> : 
                      <div className="text-xs">Cleared on {dueDate}</div> 
                  }
                </div>
              </TableCell>
              <TableCell>
                {application?.cousrseEnrolled[application.cousrseEnrolled.length-1]?.feeSetup?.installmentType ?
                  <Badge variant={"secondary"} className="font-normal">
                    {paidCount}/{(paidCount + notPaidCount)}
                    {application?.cousrseEnrolled[application.cousrseEnrolled.length-1]?.feeSetup?.installmentType === 'one shot payment' ? 
                      ' One-Shot' : ' Instalments'
                    }
                  </Badge> :
                  <div className="text-destructive">Not Setup</div>
                }
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplicationSelect(application._id);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  );
}