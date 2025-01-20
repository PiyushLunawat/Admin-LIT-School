"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Save } from "lucide-react";

export function FeesSettings() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure general fee settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Default Currency</Label>
              <Select defaultValue="inr">
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                  <SelectItem value="usd">US Dollar ($)</SelectItem>
                  <SelectItem value="eur">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Payment Due Reminder Days</Label>
              <Input type="number" placeholder="7" />
            </div>
            <div className="grid gap-2">
              <Label>Late Payment Grace Period (Days)</Label>
              <Input type="number" placeholder="3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Configure accepted payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Online Payment</Label>
                <p className="text-sm text-muted-foreground">
                  Accept payments through payment gateway
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Bank Transfer</Label>
                <p className="text-sm text-muted-foreground">
                  Accept direct bank transfers
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cash Payment</Label>
                <p className="text-sm text-muted-foreground">
                  Accept cash payments at centre
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fee Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Structure Settings</CardTitle>
          <CardDescription>Configure fee structure defaults</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Default Admission Fee Amount (%)</Label>
              <Input type="number" placeholder="5" />
            </div>
            <div className="grid gap-2">
              <Label>Default Number of Installments</Label>
              <Input type="number" placeholder="6" />
            </div>
            <div className="grid gap-2">
              <Label>One-Shot Payment Discount (%)</Label>
              <Input type="number" placeholder="10" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Late Payment */}
      <Card>
        <CardHeader>
          <CardTitle>Late Payment Settings</CardTitle>
          <CardDescription>Configure late payment policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Late Fee</Label>
                <p className="text-sm text-muted-foreground">
                  Charge additional fee for late payments
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="grid gap-2">
              <Label>Late Fee Amount (%)</Label>
              <Input type="number" placeholder="2" />
            </div>
            <div className="grid gap-2">
              <Label>Maximum Late Fee (%)</Label>
              <Input type="number" placeholder="10" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Save Settings
      </Button>
    </div>
  );
}