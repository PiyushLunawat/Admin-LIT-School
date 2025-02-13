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
import { Dispatch, SetStateAction, useCallback } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "./date-range-picker";

interface ReportFiltersProps {
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
  cohorts: any[];
  selectedCohort: string;
  onCohortChange: (value: string) => void;
}

export function ReportFilters({
  setDateRange,
  cohorts,
  selectedCohort,
  onCohortChange,
}: ReportFiltersProps) {

  const handleClearFilters = useCallback(() => {
    onCohortChange("all-cohorts")
  }, [onCohortChange]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedCohort} onValueChange={onCohortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Cohort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-cohorts">All Cohorts</SelectItem>
              {cohorts.map((c: any) => (
                <SelectItem key={c._id} value={c.cohortId}>
                  {c.cohortId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="">
            <DateRangePicker setDateRange={setDateRange} />
          </div>
      </div>
    </div>
  );
}
