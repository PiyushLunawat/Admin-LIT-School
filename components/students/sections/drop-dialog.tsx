"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UserMinus } from "lucide-react";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "default";

interface MarkedAsDialogProps {
  student: any;
}

export function MarkedAsDialog({ student }: MarkedAsDialogProps) {

  if (!student) {
    return <p>Student data not available.</p>;
  }

  const firstNameInitial = student?.firstName?.[0] || "-";
  const lastNameInitial = student?.lastName?.[0] || "-";

  return (
    <div>
        <div className="grid gap-3">
          <div className="flex gap-2 text-2xl items-center">
            <UserMinus className="h-6 w-6 text-red-500" />
            Mark as Dropped
          </div>
          <div className="flex justify-between items-center border-b pb-3">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder-avatar.jpg" alt={(student.firstName + student?.lastName) || '--'} />
                <AvatarFallback>{firstNameInitial}{lastNameInitial}</AvatarFallback>
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
            <div className="flex justify-between items-center text-right">
              <div>
                <p className="text-sm text-muted-foreground">Program & Cohort</p>
                <p className="font-medium">{student.program.name}</p>
                <p className="text-sm">{student.cohort.cohortId}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4 ">
            <div className="mt-2 space-y-2">
              <h3 className="">Provide Reasons</h3>
              <Textarea className=""/>
            </div>
            <div className="flex gap-2 ">
              <Button variant="outline" className="flex-1" >Cancel</Button>
              <Button className="bg-[#FF503D]/20 hover:bg-[#FF503D]/30 text-[#FF503D] flex-1" >Mark as Dropped</Button>
            </div>
          </div>
        </div>
      </div>
  );
}