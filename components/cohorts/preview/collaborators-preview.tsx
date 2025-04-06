"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { CollaboratorsForm } from "../steps/collaborators-form";

export function CollaboratorsPreview() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const collaborators = [
    {
      email: "john@example.com",
      role: "Application Reviewer",
    },
    {
      email: "sarah@example.com",
      role: "Interviewer",
    },
    {
      email: "mike@example.com",
      role: "Fee Collector",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Collaborators</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsDialogOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {collaborators.map((collaborator, index) => (
          <div key={index} className="flex justify-between items-center border-b py-2 last:border-0">
            <div>
              <p className="font-medium">{collaborator.email}</p>
              <p className="text-sm text-muted-foreground">{collaborator.role}</p>
            </div>
          </div>
        ))}
      </CardContent>
      
      {/* Dialog for Collaborators Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTitle></DialogTitle>
        <DialogContent className="max-w-4xl p-6">
          {/* <CollaboratorsForm onComplete={() => console.log("Form complete")} /> */}
        </DialogContent>
      </Dialog>
    </Card>
  );
}