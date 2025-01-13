"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

export function PaymentFilters() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search payments..." className="pl-8" />
      </div>
      <div className="flex gap-2">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="token">Admission Fee</SelectItem>
            <SelectItem value="instalment">Instalment</SelectItem>
            <SelectItem value="one-shot">One-Shot Payment</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}