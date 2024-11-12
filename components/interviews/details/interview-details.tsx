"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Mail,
  MessageSquare,
  User,
  Video,
  MapPin,
} from "lucide-react";

interface InterviewDetailsProps {
  interviewId: string;
}

export function InterviewDetails({ interviewId }: InterviewDetailsProps) {
  const router = useRouter();

  // In a real application, this data would be fetched based on the interviewId
  const interview = {
    id: interviewId,
    applicant: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+91 98765 43210",
      program: "Creator Marketer",
      cohort: "CM01JY",
    },
    schedule: {
      date: "2024-03-25",
      time: "10:30 AM",
      duration: "45 minutes",
      mode: "Zoom",
      link: "https://zoom.us/j/123456789",
    },
    status: "Scheduled",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Interview Details</h1>
        </div>
        <Button onClick={() => router.push(`/dashboard/interviews/${interviewId}/applicant`)}>
          <User className="h-4 w-4 mr-2" />
          View Applicant Profile
        </Button>
      </div>

      {/* Applicant Information */}
      <Card>
        <CardHeader>
          <CardTitle>Applicant Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{interview.applicant.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{interview.applicant.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Program</p>
            <p className="font-medium">{interview.applicant.program}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cohort</p>
            <p className="font-medium">{interview.applicant.cohort}</p>
          </div>
        </CardContent>
      </Card>

      {/* Interview Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(interview.schedule.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{interview.schedule.time}</span>
            </div>
            <div className="flex items-center gap-2">
              {interview.schedule.mode === "Zoom" ? (
                <Video className="h-4 w-4" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              <span>{interview.schedule.mode}</span>
            </div>
            <div>
              <Badge variant="secondary">{interview.schedule.duration}</Badge>
            </div>
          </div>
          {interview.schedule.link && (
            <Button className="w-full" variant="outline">
              <Video className="h-4 w-4 mr-2" />
              Join Interview
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Note
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Reschedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}