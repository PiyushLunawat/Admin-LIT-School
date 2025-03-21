"use client";

import React, { useState } from "react";
import { MarkAsdropped } from "@/app/api/student";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UserMinus } from "lucide-react";

interface MarkedAsDialogProps {
  student: any;
  onUpdateStatus: () => void;
  onClose: () => void;
}

export function MarkedAsDialog({ student, onUpdateStatus, onClose }: MarkedAsDialogProps) {
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (!student) {
    return <p>Student data not available.</p>;
  }

  const latestCohort = student?.appliedCohorts?.[student?.appliedCohorts.length - 1];

  const handleMarkAsDropped = async () => {
    if (!notes.trim()) {
      return;
    }
    setLoading(true);
    try {
      // Split notes by newlines, trim, and filter out any empty strings.
      const notesArray = notes
        .split("\n")
        .map((note) => note.trim())
        .filter((note) => note.length > 0);

      // Build the payload as per your curl example.
      const payload = {
        studentId: student?._id,
        status: "dropped",
        notes: notesArray,
      };

      console.log("payload", payload);

      const response = await MarkAsdropped(payload);
      

      if (response.ok) {
        console.log("Student successfully marked as dropped.");
        onUpdateStatus();
        onClose();
      } else {
        console.error("Failed to mark as dropped.");
      }
    } catch (error) {
      console.error("Error marking as dropped:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-3">
      <div className="flex gap-2 text-2xl items-center justify-start text-destructive">
        <UserMinus className="h-6 w-6 text-red-500" />
        Mark as Dropped
      </div>
      <div className="flex justify-between items-center border-b pb-3">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={student?.profileUrl} className="object-cover" />
            <AvatarFallback>
              {student?.firstName?.[0] || "-"}
              {student?.lastName?.[0] || "-"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-base font-semibold">
              {student.firstName} {student.lastName}
            </h2>
            <div className="flex gap-2 h-5 items-center">
              <p className="text-sm text-muted-foreground">{student?.email}</p>
              <Separator orientation="vertical" />
              <p className="text-sm text-muted-foreground">{student?.mobileNumber}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center text-right">
          <div>
            <p className="text-sm text-muted-foreground">Program & Cohort</p>
            <p className="font-medium">
              {latestCohort?.cohortId?.programDetail.name}
            </p>
            <p className="text-sm">{latestCohort?.cohortId?.cohortId}</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="mt-2 space-y-2">
          <label className="text-lg pl-3">Provide Reasons</label>
          <Textarea
            className="h-[150px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter the reason for marking as dropped"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button
            className="bg-[#FF503D]/20 hover:bg-[#FF503D]/30 text-[#FF503D] flex-1"
            onClick={() => handleMarkAsDropped()}
            disabled={loading || !notes.trim()}
          >
            {loading ? "Processing..." : "Mark as Dropped"}
          </Button>
        </div>
      </div>
    </div>
  );
}
