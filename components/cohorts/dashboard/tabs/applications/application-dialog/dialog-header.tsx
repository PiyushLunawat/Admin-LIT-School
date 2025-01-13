"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Edit,
  Mail,
  Download,
  UserMinus,
  RefreshCw,
  Calendar,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator";
import { getCurrentStudents } from "@/app/api/student";
import { useEffect, useState } from "react";
import { MarkedAsDialog } from "@/components/students/sections/drop-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";

interface StudentHeaderProps {
  student: any;
}

export function StudentApplicationHeader({ student }: StudentHeaderProps) {
  const [sch, setSch] = useState<any>(null);
  const [markedAsDialogOpen, setMarkedAsDialogOpen] = useState(false)

  useEffect(() => {
    if (student?.cohort?.feeStructureDetails && student?.litmusTestDetails?.[0]?.litmusTaskId?.scholarshipDetail) {
      const scholarship = student.cohort.feeStructureDetails.find(
        (scholarship: any) =>
          scholarship._id === student.litmusTestDetails[0].litmusTaskId.scholarshipDetail
      );
      setSch(scholarship);
    }
  }, [student]);

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "completed":
      case "evaluated":
      case "enrolled":
      case "token paid":
        return "success";
      case "rejected":
        return "warning";
      default:
        return "default";
    }
  };


  if (!student) {
    return <p>Student data not available.</p>;
  }


  return (
    <div>
        <div className="grid gap-3">
          {/* Profile Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-avatar.jpg" alt={(student.firstName + student?.lastName) || '--'} />
              <AvatarFallback>{student.firstName[0]}{student.lastName[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-base font-semibold">{student.firstName} {student.lastName}</h2>
              <div className="flex gap-4 h-5 items-center">
                <p className="text-sm text-muted-foreground">{student.email}</p>
                <Separator orientation="vertical" />
                <p className="text-sm text-muted-foreground">{student.mobileNumber}</p>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-4 col-span-2 pt-3 border-t">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Program & Cohort</p>
                <p className="font-medium">{student.program.name}</p>
                <p className="text-sm">{student.cohort.cohortId}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
              {/* <Button variant="outline" className="justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="justify-start">
                <img src="/assets/images/whatsapp-icon.svg" className="h-4 w-4 mr-2" />
                Send WhatsApp
              </Button> */}
              <Button variant="outline" className="justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" className="justify-start text-destructive" onClick={()=>setMarkedAsDialogOpen(true)}>
                    <UserMinus className="h-4 w-4 mr-2" />
                    Mark as Dropped
                  </Button>
            </div>
          </div>
          
            {/* Status Section */}
            <div className="flex justify-between items-center py-3 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Application Status</p>
                <Badge className="capitalize" variant={getStatusColor(student?.applicationDetails?.applicationStatus || "--")}>
                  {student.applicationDetails.applicationStatus || "--"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Interview Status</p>
                {student.interviewStatus ? 
                <Badge className="capitalize" variant={getStatusColor(student?.interviewStatus || "--")}>
                  {student.interviewStatus}
                </Badge> : "--"}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">LITMUS Status</p>
                {student?.litmusTestDetails[0]?.litmusTaskId?.status ? 
                <Badge className="capitalize" variant={getStatusColor(student?.litmusTestDetails[0]?.litmusTaskId?.status || "--")}>
                  {student?.litmusTestDetails[0]?.litmusTaskId?.status}
                </Badge>  : "--"}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scholarship</p>
                {sch ? 
                <Badge className="capitalize" variant="secondary">{sch?.scholarshipName+' '+(sch?.scholarshipPercentage+'%')}</Badge> : "--"}
              </div> 
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                {student.paymentStatus ? 
                <Badge className="capitalize" variant={getStatusColor(student.paymentStatus)}>
                  {student.paymentStatus}
                </Badge> : "--"}
              </div>
            </div> 

            
          </div>
        </div>

        <Dialog open={markedAsDialogOpen} onOpenChange={setMarkedAsDialogOpen}>
        <DialogContent className="max-w-4xl py-4 px-6">
          <MarkedAsDialog student={student}/>
        </DialogContent>
      </Dialog>
      </div>
  );
}