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
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import internalNotes from "@/app/api/student";

interface InternalNotesTabProps {
  student: any;
  onApplicationUpdate: () => void;
}

export function InternalNotesTab({ student, onApplicationUpdate }: InternalNotesTabProps) {
  
  const latestCohort = student?.appliedCohorts?.[student?.appliedCohorts.length - 1];
  const cohortDetails = latestCohort?.cohortId;

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [internalNote, setInternalNote] = useState<any>([]);

  const [category, setCategory] = useState<string>("null");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    setInternalNote(latestCohort?.internalNotes)
  }, [latestCohort]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        studentId: student?._id,
        category,
        cohortId: cohortDetails?._id,
        content: [content], // Wrapped in array as per your payload format
      };
      
      const res = await internalNotes(payload);

      setInternalNote(res?.internalNote)
      toast({ description: res?.message, variant: "success", });

      setContent(""); // Clear input
      setCategory(""); // Reset category
      onApplicationUpdate(); // Refresh data if needed
    } catch (error: any) {
      toast({
        description: error.message || "An unexpected error occurred.",
        variant: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Note */}
      <Card>
        <CardHeader>
          <CardTitle>Add Note</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setCategory}>
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button className="w-full" onClick={handleSubmit} disabled={loading || content === "" || category === "" }>
            <Plus className="h-4 w-4 mr-2" />
            {loading ? 'Adding...' : 'Add Note'}
          </Button>
        </CardContent>
      </Card>

      {/* Notes List */}
      {internalNote !== undefined &&
        <Card>
          <CardHeader>
            <CardTitle>Internal Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {internalNote?.notes?.map((note: any, index: any) => (
                <div key={index} className="border rounded-lg p-4 space-y-2" >
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="capitalize">{note?.category}</Badge>
                    <p className="text-sm text-muted-foreground uppercase">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {note.content.map((item: string, index: number) => (
                    <div className="pl-3" key={index}>{item}</div>
                  ))}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>Added by {note.addedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      }
    </div>
  );
}