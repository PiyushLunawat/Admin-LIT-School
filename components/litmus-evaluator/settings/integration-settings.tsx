"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, Mail } from "lucide-react";

export function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendar Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <Label>Google Calendar</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sync your presentation schedule with Google Calendar
                </p>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <Label>Microsoft Outlook</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sync your presentation schedule with Outlook Calendar
                </p>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  <Label>Gmail</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Send emails through your Gmail account
                </p>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  <Label>Outlook Email</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Send emails through your Outlook account
                </p>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-sync Calendar Events</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically sync new presentations to connected calendars
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications via Integration</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications through connected email accounts
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}