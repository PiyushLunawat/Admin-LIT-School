"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Edit, ExternalLink } from "lucide-react"; 
import { LitmusTestForm } from "../steps/litmus-test-form";

export function LitmusTestPreview() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const tasks = [
    {
      title: "Create a pitch deck",
      type: "File Upload",
      description: "Present your startup idea...",
    },
  ];

  const scholarshipSlabs = [
    { name: "Smart Mouth", percentage: 5, amount: "₹49,750" },
    { name: "Smart Ass", percentage: 8, amount: "₹79,600" },
    { name: "Wise Ass", percentage: 10, amount: "₹99,500" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>LITMUS Test</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsDialogOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
      <div className="space-y-4">
          <h4 className="font-medium">Tasks</h4>
          {tasks.map((task, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <h4 className="font-medium">{task.title}</h4>
              <p className="text-sm text-muted-foreground">Type: {task.type}</p>
              <p className="text-sm">{task.description}</p>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <h4 className="font-medium">Scholarship Slabs</h4>
          <div className="grid grid-cols-3 gap-4">
            {scholarshipSlabs.map((slab, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium">{slab.name}</h4>
                <p className="text-sm text-muted-foreground">{slab.percentage}% (10-30% test Clearance)</p>
                <p className="text-sm">Amount: {slab.amount}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium">Interview Scheduler</h4>
          <p className="text-sm text-muted-foreground flex gap-2 items-center"><ExternalLink className="w-4 text-white" />Calendly integration configured</p>
        </div>
      </CardContent>

      {/* Dialog for Litmus Test Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl p-6">
          <LitmusTestForm onNext={() => console.log("Navigating to fee-structure")} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
