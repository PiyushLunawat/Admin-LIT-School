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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
}

interface TemplateManagerProps {
  templates: Template[];
  onTemplateCreate: (template: Omit<Template, "id">) => void;
  onTemplateUpdate: (template: Template) => void;
  onTemplateDelete: (id: string) => void;
}

export function TemplateManager({
  templates,
  onTemplateCreate,
  onTemplateUpdate,
  onTemplateDelete,
}: TemplateManagerProps) {
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const templateData = {
      name: formData.get("name") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
    };

    if (editingTemplate) {
      onTemplateUpdate({ ...templateData, id: editingTemplate.id });
    } else {
      onTemplateCreate(templateData);
    }

    setIsDialogOpen(false);
    setEditingTemplate(null);
  };

  const categories = ["Interview", "Scheduling", "Follow-up"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Message Templates</h2>
          <p className="text-muted-foreground">
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingTemplate?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue={editingTemplate?.category || categories[0]}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Template Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={editingTemplate?.content}
                  className="min-h-[200px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingTemplate ? "Update Template" : "Create Template"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {categories.map((category) => {
          const categoryTemplates = templates.filter(
            (t) => t.category === category
          );
          return (
            categoryTemplates.length > 0 && (
              <Card key={category}>
                <CardHeader>
                  <CardTitle>{category} Templates</CardTitle>
                  <CardDescription>
                    Templates for {category.toLowerCase()} communications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{template.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {template.content.substring(0, 100)}
                          {template.content.length > 100 ? "..." : ""}
                        </p>
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
                          onClick={() => onTemplateDelete(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          );
        })}
      </div>
    </div>
  );
}