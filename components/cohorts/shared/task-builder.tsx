"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

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
import {
  Task,
  TaskBuilderProps,
} from "@/types/components/cohorts/shared/task-builder";

export function TaskBuilder({
  tasks,
  onTasksChange,
  typeOptions,
  fileTypeOptions,
}: TaskBuilderProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [openTypeSelect, setOpenTypeSelect] = useState<string | null>(null);

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
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetId) return;

    const draggedIndex = tasks.findIndex((t) => t.id === draggedTaskId);
    const targetIndex = tasks.findIndex((t) => t.id === targetId);

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);
    onTasksChange(newTasks);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
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
                  characterLimit: parseInt(e.target.value) || undefined,
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
                    maxFiles: parseInt(e.target.value) || undefined,
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
                    maxFileSize: parseInt(e.target.value) || undefined,
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
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
          onDragOver={(e) => handleDragOver(e, task.id)}
          onDragEnd={handleDragEnd}
          className={`transition-opacity ${
            draggedTaskId === task.id ? "opacity-50" : ""
          }`}
        >
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="cursor-move p-2 hover:bg-muted rounded"
                    onMouseDown={(e) => e.preventDefault()}
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
