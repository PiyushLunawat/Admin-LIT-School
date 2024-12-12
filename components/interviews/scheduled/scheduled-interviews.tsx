"use client";

import { useState } from "react";
import { InterviewCalendar } from "./interview-calendar";
import { InterviewList } from "./interview-list";
import { InterviewFilters } from "./interview-filters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ScheduledInterviews() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scheduled Interviews</h2>
      </div>

      <InterviewFilters />

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <InterviewCalendar />
        </TabsContent>

        <TabsContent value="list">
          <InterviewList />
        </TabsContent>
      </Tabs>
    </div>
  );
}