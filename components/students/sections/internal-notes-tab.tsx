"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Plus } from "lucide-react";

interface InternalNotesTabProps {
  studentId: string;
}

export function InternalNotesTab({ studentId }: InternalNotesTabProps) {
  // In a real application, this data would be fetched based on the studentId
  const notes = [
    {
      id: "1",
      category: "Interview",
      note: "Strong communication skills, shows leadership potential.",
      author: "Sarah Admin",
      timestamp: "2024-03-20 10:30 AM",
    },
    {
      id: "2",
      category: "Payment",
      note: "Requested scholarship consideration.",
      author: "Finance Team",
      timestamp: "2024-03-19 02:15 PM",
    },
    {
      id: "3",
      category: "General",
      note: "Very enthusiastic about the program.",
      author: "Tom Evaluator",
      timestamp: "2024-03-18 11:45 AM",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Add New Note */}
      <Card>
        <CardHeader>
          <CardTitle>Add Note</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Type your note here..."
            className="min-h-[100px]"
          />
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </CardContent>
      </Card>

      {/* Notes List */}
      <Card>
        <CardHeader>
          <CardTitle>Internal Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{note.category}</Badge>
                  <p className="text-sm text-muted-foreground">
                    {note.timestamp}
                  </p>
                </div>
                <p>{note.note}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>Added by {note.author}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}