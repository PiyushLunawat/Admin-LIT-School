"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function AutomationSettings({ cohortId }: { cohortId: string }) {
  const automationGroups = [
    {
      title: "Application Status",
      description: "Notifications for application status changes",
      settings: [
        {
          id: "app-received",
          label: "Application Received",
          description: "Send confirmation when application is submitted",
          enabled: true,
          template: "application-received",
        },
        {
          id: "app-status",
          label: "Status Updates",
          description: "Notify when application status changes",
          enabled: true,
          template: "status-update",
        },
      ],
    },
    {
      title: "Interviews",
      description: "Interview-related notifications",
      settings: [
        {
          id: "interview-scheduled",
          label: "interview scheduled",
          description: "Send confirmation when interview is scheduled",
          enabled: true,
          template: "interview-confirmation",
        },
        {
          id: "interview-reminder",
          label: "Interview Reminders",
          description: "Send reminder 24 hours before interview",
          enabled: true,
          template: "interview-reminder",
        },
      ],
    },
    {
      title: "LITMUS Test",
      description: "LITMUS test notifications",
      settings: [
        {
          id: "litmus-deadline-1",
          label: "Submission Deadline",
          description: "Remind about approaching deadlines",
          enabled: true,
          template: "litmus-deadline",
        },
        {
          id: "litmus-deadline-2",
          label: "Submission Deadline",
          description: "Remind about approaching deadlines",
          enabled: true,
          template: "litmus-deadline",
        },
        {
          id: "litmus-evaluated",
          label: "Evaluation Complete",
          description: "Notify when LITMUS test is evaluated",
          enabled: true,
          template: "litmus-evaluated",
        },
      ],
    },
    {
      title: "Payments",
      description: "Payment-related notifications",
      settings: [
        {
          id: "payment-due",
          label: "Payment Due",
          description: "Send reminder before payment due date",
          enabled: true,
          template: "payment-reminder",
        },
        {
          id: "payment-overdue",
          label: "Payment Overdue",
          description: "Send notification for overdue payments",
          enabled: true,
          template: "interview-confirmation",
        },
        {
          id: "token-fee-overdue",
          label: "Admission Fee Overdue",
          description: "Send notification for overdue payments",
          enabled: true,
          template: "status-update",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Automation Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure automated notifications for various events
          </p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {automationGroups.map((group) => (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle>{group.title}</CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {group.settings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={setting.id}
                        defaultChecked={setting.enabled}
                      />
                      <Label htmlFor={setting.id}>{setting.label}</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {setting.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Select defaultValue={setting.template}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="application-received">
                          Application Received
                        </SelectItem>
                        <SelectItem value="status-update">
                          Status Update
                        </SelectItem>
                        <SelectItem value="interview-confirmation">
                          Interview Confirmation
                        </SelectItem>
                        <SelectItem value="payment-reminder">
                          Payment Reminder
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Days before"
                      className="w-[200px]"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
