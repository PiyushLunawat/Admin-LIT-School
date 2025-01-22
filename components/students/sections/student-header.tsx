"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Edit,
  Mail,
  Download,
  UserMinus,
  RefreshCw,
} from "lucide-react";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";

interface StudentHeaderProps {
  studentId: string;
}

export function StudentHeader({ studentId }: StudentHeaderProps) {
  // In a real application, this data would be fetched based on the studentId
  const student = {
    name: "John Doe",
    profileUrl: "",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    program: "Creator Marketer",
    cohort: "CM01JY",
    applicationId: "APP001",
    applicationStatus: "Accepted",
    interviewStatus: "Completed",
    litmusStatus: "Evaluated",
    scholarship: "Smart Mouth (5%)",
    enrollmentStatus: "Enrolled",
    paymentStatus: "Token Paid",
  };

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "success";
      case "completed":
        return "success";
      case "evaluated":
        return "success";
      case "enrolled":
        return "success";
      case "token paid":
        return "success";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={student?.profileUrl} className="object-cover" />
              <AvatarFallback>{student?.name?.[0] || "-"}{student?.name?.[0] || "-"}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-sm text-muted-foreground">{student.email}</p>
              <p className="text-sm text-muted-foreground">{student.phone}</p>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-4 col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Program & Cohort</p>
                <p className="font-medium">{student.program}</p>
                <p className="text-sm">{student.cohort}</p>
              </div>
              {/* <div>
                <p className="text-sm text-muted-foreground">Application Status</p>
                <Badge variant={getStatusColor(student.applicationStatus)}>
                  {student.applicationStatus}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Interview Status</p>
                <Badge variant={getStatusColor(student.interviewStatus)}>
                  {student.interviewStatus}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">LITMUS Status</p>
                <Badge variant={getStatusColor(student.litmusStatus)}>
                  {student.litmusStatus}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scholarship</p>
                <Badge variant="secondary">{student.scholarship}</Badge>
              </div> */}
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <Badge variant={getStatusColor(student.paymentStatus)}>
                  {student.paymentStatus}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            {/* <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Status
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Communicate
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm" className="text-destructive">
                <UserMinus className="h-4 w-4 mr-2" />
                Mark as Dropped
              </Button>
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}