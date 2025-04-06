"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink } from "lucide-react";
import { useState } from "react";import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ApplicationFormBuilder } from "../steps/application-form-builder";


export function ApplicationFormPreview() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tasks = [
    {
      title: "Share an Embarrassing Story",
      type: "Long Text",
      description: "Tell us about a moment that shaped you...",
    },
    {
      title: "Portfolio Submission",
      type: "File Upload",
      description: "Submit your creative work samples...",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Application Form</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => {setIsDialogOpen(true);}}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <h4 className="font-medium">{task.title}</h4>
              <p className="text-sm text-muted-foreground">Type: {task.type}</p>
              <p className="text-sm">{task.description}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h4 className="font-medium">Interview Scheduler</h4>
          <p className="text-sm text-muted-foreground flex gap-2 items-center"><ExternalLink className="w-4 text-white" />Calendly integration configured</p>
        </div>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTitle></DialogTitle>
        <DialogContent className="max-w-4xl p-6">
          {/* <ApplicationFormBuilder onNext={() => console.log("Next clicked")} /> */}
        </DialogContent>
      </Dialog>
    </Card>
  );
}