"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react"; 
import { BasicDetailsForm } from "../steps/basic-details-form";

export function BasicDetailsPreview() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const details = {
    cohortId: "CM01JY",
    program: "Creator Marketer",
    centre: "Jayanagar",
    startDate: "Sep 22, 2024",
    endDate: "Feb 28, 2025",
    schedule: "Morning Batch (M-W-F)",
    seats: "50",
    baseFee: "₹9,95,000",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Basic Details</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsDialogOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Cohort ID</p>
          <p className="font-medium">{details.cohortId}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Program</p>
          <p className="font-medium">{details.program}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Centre</p>
          <p className="font-medium">{details.centre}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Schedule</p>
          <p className="font-medium">{details.schedule}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Duration</p>
          <p className="font-medium">
            {details.startDate} - {details.endDate}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Seats</p>
          <p className="font-medium">{details.seats}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Base Fee</p>
          <p className="font-medium">{details.baseFee}</p>
        </div>
      </CardContent>

      {/* Dialog for Edit Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl p-6">
          <BasicDetailsForm onNext={() => console.log("Next clicked")} initialData={details} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
