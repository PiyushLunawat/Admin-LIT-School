"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  X,
  MessageSquare,
  PlayCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PresentationDetailsProps {
  presentationId: string;
  onClose: () => void;
}

export function PresentationDetails({ presentationId, onClose }: PresentationDetailsProps) {
  // In a real application, this data would be fetched based on the presentationId
  const presentation = {
    id: presentationId,
    applicantName: "John Doe",
    date: "2024-03-25",
    time: "10:30 AM",
    mode: "Zoom",
    link: "https://zoom.us/j/123456789",
    status: "Scheduled",
    evaluator: "Sarah Admin",
    notes: [
      {
        author: "Sarah Admin",
        text: "Presentation materials received and reviewed",
        timestamp: "2024-03-24 02:30 PM",
      },
    ],
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{presentation.applicantName}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(presentation.date).toLocaleDateString()} at {presentation.time}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Status Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Presentation Status</h4>
              <Badge>{presentation.status}</Badge>
            </div>
            <Select defaultValue={presentation.status.toLowerCase()}>
              <SelectTrigger>
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Details Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Presentation Details</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(presentation.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{presentation.time}</span>
              </div>
              <div className="flex items-center gap-2">
                {presentation.mode === "Zoom" ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                <span>{presentation.mode}</span>
              </div>
              {presentation.link && (
                <Button className="w-full" variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Join Meeting
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-medium">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start">
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Presentation
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Reschedule
              </Button>
            </div>
          </div>

          <Separator />

          {/* Notes Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Notes</h4>
            {presentation.notes.map((note, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <p className="font-medium">{note.author}</p>
                  <p className="text-sm text-muted-foreground">{note.timestamp}</p>
                </div>
                <p className="text-sm">{note.text}</p>
              </div>
            ))}
            <Textarea placeholder="Add a note..." />
            <Button className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}