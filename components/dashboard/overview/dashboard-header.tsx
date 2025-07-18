"use client";

import { DateRangePicker } from "@/components/dashboard/overview/date-range-picker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { DateRange } from "react-day-picker";

interface CohortHeaderProps {
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;

  programs: any[];
  selectedProgram: string;
  onProgramChange: (value: string) => void;

  cohorts: any[];
  selectedCohort: string;
  onCohortChange: (value: string) => void;
}

export function DashboardHeader({
  setDateRange,
  searchQuery,
  onSearchQueryChange,
  programs,
  selectedProgram,
  onProgramChange,
  cohorts,
  selectedCohort,
  onCohortChange,
}: CohortHeaderProps) {
  const [selectedProgramId, setSelectedProgramId] = useState("");

  const handleProgramChange = (value: string) => {
    onProgramChange(value);
    const selected = programs.find((prog) => prog.name === value);
    setSelectedProgramId(selected?._id || "");
    onCohortChange("all-cohorts");
  };

  const resetDateRange = () => {
    setSelectedProgramId("");
    onProgramChange("all-programs");
    onCohortChange("all-cohorts");
  };

  return (
    <div className="space-y-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening at LIT School today.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-1">
          {/* <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cohorts, programs, or students..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
            />
          </div> */}
          <DateRangePicker setDateRange={setDateRange} />
        </div>
        <div className="flex gap-2">
          <Select value={selectedProgram} onValueChange={handleProgramChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-programs">All Programs</SelectItem>
              {programs.map((prog) => (
                <SelectItem key={prog._id} value={prog.name}>
                  {prog.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCohort} onValueChange={onCohortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Cohort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-cohorts">All Cohorts</SelectItem>
              {cohorts
                .filter((c) =>
                  selectedProgramId === ""
                    ? true
                    : c.programDetail === selectedProgramId
                )
                .map((c) => (
                  <SelectItem key={c._id} value={c.cohortId}>
                    {c.cohortId}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        {!(
          selectedProgram === "all-programs" && selectedCohort === "all-cohorts"
        ) && (
          <Button
            variant="ghost"
            size="icon"
            className="-ml-3"
            onClick={resetDateRange}
          >
            <X className="ml-4 sm:ml-0 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
