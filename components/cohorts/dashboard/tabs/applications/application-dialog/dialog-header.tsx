"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserMinus, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { MarkedAsDialog } from "@/components/students/sections/drop-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SchedulePresentation } from "@/components/common-dialog/schedule-presentation";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";

interface StudentHeaderProps {
  student: any;
}

export function StudentApplicationHeader({ student }: StudentHeaderProps) {
  const [markedAsDialogOpen, setMarkedAsDialogOpen] = useState(false);
  const [interviewOpen, setInterviewOpen] = useState(false);

  const latestCohort = student?.appliedCohorts?.[student?.appliedCohorts.length - 1];
  const applicationDetails = latestCohort?.applicationDetails;
  const litmusTestDetails = latestCohort?.litmusTestDetails;
  const scholarshipDetails = litmusTestDetails?.scholarshipDetail;

  const colorClasses = [
    'text-emerald-600 !bg-emerald-600/20 border-emerald-600',
    'text-[#3698FB] !bg-[#3698FB]/20 border-[#3698FB]',
    'text-[#FA69E5] !bg-[#FA69E5]/20 border-[#FA69E5]',
    'text-orange-600 !bg-orange-600/20 border-orange-600'
  ];
  
  const getColor = (slabName: string): string => {
    const index = latestCohort?.cohortId?.litmusTestDetail?.[0]?.scholarshipSlabs.findIndex(
      (slab: any) => slab.name === slabName
    );
    
    return index !== -1 ? colorClasses[index % colorClasses.length] : 'text-default';
  };

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "selected":
      case "completed":
      case "evaluated":
      case "enrolled":
      case "token paid":
        return "success";
      case "rejected":
        return "warning";
      default:
        return "secondary";
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
              <AvatarImage src={student?.profileUrl} className="object-cover" />
              <AvatarFallback>{student?.firstName?.[0] || "-"}{student?.lastName?.[0] || "-"}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-base font-semibold">{student?.firstName} {student?.lastName}</h2>
              <div className="flex gap-4 h-5 items-center">
                <p className="text-sm text-muted-foreground">{student?.email}</p>
                <Separator orientation="vertical" />
                <p className="text-sm text-muted-foreground">{student?.mobileNumber}</p>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-4 col-span-2 pt-3 border-t">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Program & Cohort</p>
                <p className="font-medium">{latestCohort?.cohortId?.programDetail.name}</p>
                <p className="text-sm">{latestCohort?.cohortId?.cohortId}</p>
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
              <Button variant="outline" className="justify-start" disabled
              // onClick={() => setInterviewOpen(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" className="border-none bg-[#FF503D1A] hover:bg-[#FF503D]/20 justify-start text-destructive" onClick={()=>setMarkedAsDialogOpen(true)}>
                    <UserMinus className="h-4 w-4 mr-2" />
                    Mark as Dropped
                  </Button>
            </div>
          </div>
          
            {/* Status Section */}
            <div className="flex justify-between items-center py-3 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Application Status</p>
                {applicationDetails?.applicationStatus ?
                <Badge className="capitalize" variant={getStatusColor(['Interview Scheduled', 'waitlist', 'selected', 'not qualified'].includes(applicationDetails?.applicationStatus) ?
                  'accepted' : applicationDetails?.applicationStatus || "--")}>
                  {['Interview Scheduled', 'waitlist', 'selected', 'not qualified'].includes(applicationDetails?.applicationStatus) ?
                  'accepted' : applicationDetails?.applicationStatus }
                </Badge> : "--"}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Interview Status</p>
                {['Interview Scheduled', 'waitlist', 'selected', 'not qualified'].includes(applicationDetails?.applicationStatus) ? 
                <Badge className="capitalize" variant={getStatusColor(applicationDetails?.applicationStatus || "--")}>
                  {applicationDetails?.applicationStatus}
                </Badge> : "--"}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">LITMUS Status</p>
                {litmusTestDetails?.status ? 
                <Badge className="capitalize" variant={getStatusColor(litmusTestDetails?.status || "--")}>
                  {litmusTestDetails?.status}
                </Badge>  : "--"}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scholarship</p>
                {scholarshipDetails ? 
                <Badge className={`capitalize ${getColor(scholarshipDetails?.scholarshipName)}`} variant="secondary">
                  {scholarshipDetails?.scholarshipName+' '+(scholarshipDetails?.scholarshipPercentage+'%')}
                </Badge> : "--"}
              </div> 
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                {student?.paymentStatus ? 
                <Badge className="capitalize" variant={getStatusColor(student.paymentStatus)}>
                  {student?.paymentStatus}
                </Badge> : "--"}
              </div>
            </div>           
          </div>
        </div>

        <Dialog open={interviewOpen} onOpenChange={setInterviewOpen}>
          <DialogContent className="max-w-2xl">
            <SchedulePresentation student={student} interviewr={['interviewer', 'evaluator']}/>
          </DialogContent>
        </Dialog>
        <Dialog open={markedAsDialogOpen} onOpenChange={setMarkedAsDialogOpen}>
        <DialogContent className="max-w-4xl py-4 px-6">
          <MarkedAsDialog student={student}/>
        </DialogContent>
      </Dialog>
      </div>
  );
}