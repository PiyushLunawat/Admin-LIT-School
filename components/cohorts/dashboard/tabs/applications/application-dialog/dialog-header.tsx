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
import { Separator } from "@/components/ui/separator";
import { getCurrentStudents } from "@/app/api/student";
import { useEffect, useState } from "react";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";

interface StudentHeaderProps {
  student: any;
}

export function StudentApplicationHeader({ student }: StudentHeaderProps) {

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
              <Button variant="outline" className="justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="justify-start">
                <img src="/assets/images/whatsapp-icon.svg" className="h-4 w-4 mr-2" />
                Send WhatsApp
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" className="justify-start text-destructive">
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
                {student.interviewStatus ? <Badge variant={getStatusColor(student?.interviewStatus || "--")}>
                  {student.interviewStatus}
                </Badge> : "--"}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">LITMUS Status</p>
                {student.litmusStatus ? <Badge variant={getStatusColor(student?.litmusStatus || "--")}>
                  {student.litmusStatus}
                </Badge>  : "--"}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scholarship</p>
                {student.scholarship ? <Badge variant="secondary">{student?.scholarship}</Badge> : "--"}
              </div> 
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                {student.paymentStatus ? <Badge variant={getStatusColor(student.paymentStatus)}>
                  {student.paymentStatus}
                </Badge> : "--"}
              </div>
            </div> 

            
          </div>
        </div>
      </div>
  );
}