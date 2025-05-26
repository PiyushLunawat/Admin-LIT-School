"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function TemplatesManager() {
  const [templates, setTemplates] = useState([
    {
      id: "1",
      name: "Presentation Confirmation",
      subject: "LITMUS Test Presentation Confirmation",
      content: "Dear {{name}}, Your LITMUS test presentation is scheduled for {{date}}...",
      category: "Presentations",
    },
    {
      id: "2",
      name: "Evaluation Feedback",
      subject: "LITMUS Test Evaluation Feedback",
      content: "Dear {{name}}, We have completed the evaluation of your LITMUS test...",
      category: "Evaluation",
    },
    {
      id: "3",
      name: "Scholarship Award",
      subject: "LITMUS Test Scholarship Decision",
      content: "Dear {{name}}, We are pleased to inform you that you have been awarded...",
      category: "Scholarship",
    },
  ]);

  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Message Templates</h3>
          <p className="text-sm text-muted-foreground">
            Manage your communication templates
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTemplate(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? "Edit Template" : "Create Template"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input placeholder="e.g., Presentation Confirmation" />
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input placeholder="e.g., LITMUS Test Presentation Confirmation" />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  placeholder="Enter template content..."
                  className="min-h-[200px]"
                />
              </div>
              <Button className="w-full">
                {editingTemplate ? "Update Template" : "Create Template"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.subject}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingTemplate(template);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{template.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}