"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Current Password</Label>
            <Input type="password" />
          </div>
          <div className="grid gap-2">
            <Label>New Password</Label>
            <Input type="password" />
          </div>
          <div className="grid gap-2">
            <Label>Confirm New Password</Label>
            <Input type="password" />
          </div>
          <Button className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Enable Two-Factor Authentication
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
