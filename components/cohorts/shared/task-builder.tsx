"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

export interface Task {
  id: string;
  title: string;
  type: string;
  description: string;
  config: {
    characterLimit?: number;
    maxFiles?: number;
    maxFileSize?: number;
    allowedTypes?: string[];
  };
}

interface TaskBuilderProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  typeOptions: {
    value: string;
    label: string;
  }[];
  fileTypeOptions?: {
    [key: string]: {
      value: string;
      label: string;
    }[];
  };
}

export function TaskBuilder({
  tasks,
  onTasksChange,
  typeOptions,
  fileTypeOptions,
}: TaskBuilderProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addTask = () => {
    onTasksChange([
      ...tasks,
      {
        id: Math.random().toString(36).substr(2, 9),
        title: "",
        type: "",
        description: "",
        config: {},
      },
    ]);
  };

  const removeTask = (id: string) => {
    onTasksChange(tasks.filter((task) => task.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    onTasksChange(
      tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const updateTaskConfig = (id: string, config: Partial<Task["config"]>) => {
    onTasksChange(
      tasks.map((task) =>
        task.id === id
          ? { ...task, config: { ...task.config, ...config } }
          : task
      )
    );
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    // Store the dragged task ID
    setDraggedTaskId(taskId);
    setIsDragging(true);

    // Set drag image (optional - makes the drag preview look better)
    const taskCard = document.getElementById(`task-card-${taskId}`);
    if (taskCard) {
      // Create a ghost image for dragging
      const rect = taskCard.getBoundingClientRect();
      const ghostElement = taskCard.cloneNode(true) as HTMLElement;

      // Style the ghost element
      ghostElement.style.width = `${rect.width}px`;
      ghostElement.style.opacity = "0.5";
      ghostElement.style.position = "absolute";
      ghostElement.style.top = "-1000px";
      ghostElement.style.backgroundColor = "white";
      ghostElement.style.border = "1px dashed #ccc";

      // Add the ghost element to the document
      document.body.appendChild(ghostElement);

      // Set the drag image
      e.dataTransfer.setDragImage(ghostElement, 20, 20);

      // Clean up the ghost element after a short delay
      setTimeout(() => {
        document.body.removeChild(ghostElement);
      }, 0);
    }

    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetId) return;

    setDragOverTaskId(targetId);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetId) return;

    const draggedIndex = tasks.findIndex((t) => t.id === draggedTaskId);
    const targetIndex = tasks.findIndex((t) => t.id === targetId);

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);
    onTasksChange(newTasks);

    setDragOverTaskId(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverTaskId(null);
    setIsDragging(false);
  };

  const renderConfigFields = (task: Task) => {
    switch (task.type) {
      case "short":
      case "long":
        return (
          <div className="grid gap-2">
            <Label>Character Limit</Label>
            <Input
              type="number"
              placeholder="Enter maximum characters"
              value={task.config.characterLimit || ""}
              onChange={(e) =>
                updateTaskConfig(task.id, {
                  characterLimit: Number.parseInt(e.target.value) || undefined,
                })
              }
            />
          </div>
        );

      case "file":
      case "image":
      case "video":
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Maximum Files</Label>
              <Input
                type="number"
                placeholder="Enter maximum number of files"
                value={task.config.maxFiles || ""}
                onChange={(e) =>
                  updateTaskConfig(task.id, {
                    maxFiles: Number.parseInt(e.target.value) || undefined,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Maximum File Size (MB)</Label>
              <Input
                type="number"
                placeholder="Enter maximum file size in MB"
                value={task.config.maxFileSize || ""}
                onChange={(e) =>
                  updateTaskConfig(task.id, {
                    maxFileSize: Number.parseInt(e.target.value) || undefined,
                  })
                }
              />
            </div>
            {fileTypeOptions && fileTypeOptions[task.type] && (
              <div className="grid gap-2">
                <Label>Allowed File Types</Label>
                <Select
                  value={task.config.allowedTypes?.[0] || ""}
                  onValueChange={(value) =>
                    updateTaskConfig(task.id, { allowedTypes: [value] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fileTypeOptions[task.type].map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card
          key={task.id}
          id={`task-card-${task.id}`}
          className={`transition-all ${
            draggedTaskId === task.id ? "opacity-50" : ""
          } ${
            dragOverTaskId === task.id
              ? "border-2 border-primary border-dashed"
              : ""
          }`}
          onDragOver={(e) => handleDragOver(e, task.id)}
          onDrop={(e) => handleDrop(e, task.id)}
        >
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="cursor-grab p-2 hover:bg-muted rounded touch-none"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    ref={draggedTaskId === task.id ? dragNodeRef : null}
                  >
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="grid gap-2 flex-1">
                    <Label>Task Title</Label>
                    <Input
                      placeholder="Enter task title"
                      value={task.title}
                      onChange={(e) =>
                        updateTask(task.id, { title: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removeTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-2">
                <Label>Submission Type</Label>
                <Select
                  value={task.type}
                  onValueChange={(value) =>
                    updateTask(task.id, { type: value, config: {} })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {task.type && renderConfigFields(task)}
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Instructions or details"
                  value={task.description}
                  onChange={(e) =>
                    updateTask(task.id, { description: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addTask} variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Task
      </Button>
    </div>
  );
}
