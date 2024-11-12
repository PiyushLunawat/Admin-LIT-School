"use client";

import { GlobalSearch } from "@/components/dashboard/overview/global-search";
import { DateRangePicker } from "@/components/dashboard/overview/date-range-picker";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DashboardHeader() {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at LIT School today.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <GlobalSearch />
        <div className="flex gap-2">
          <Select defaultValue="all-programs">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-programs">All Programs</SelectItem>
              <SelectItem value="creator-marketer">Creator Marketer</SelectItem>
              <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-cohorts">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Cohort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-cohorts">All Cohorts</SelectItem>
              <SelectItem value="cm01jy">CM01JY</SelectItem>
              <SelectItem value="cm02jy">CM02JY</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DateRangePicker />
    </div>
  );
}