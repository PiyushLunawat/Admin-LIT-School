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

interface StudentsFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;

  programs: any[];
  selectedProgram: string;
  onProgramChange: (value: string) => void;

  cohorts: any[];
  selectedCohort: string;
  onCohortChange: (value: string) => void;

  selectedAppStatus: string;
  onAppStatusChange: (value: string) => void;

  selectedPaymentStatus: string;
  onPaymentStatusChange: (value: string) => void;
}

export function StudentsFilters({
  searchQuery,
  onSearchQueryChange,
  programs,
  selectedProgram,
  onProgramChange,
  cohorts,
  selectedCohort,
  onCohortChange,
  selectedAppStatus,
  onAppStatusChange,
  selectedPaymentStatus,
  onPaymentStatusChange,
}: StudentsFiltersProps) {
  // Reset all filters
  const handleReset = () => {
    onSearchQueryChange("");
    onProgramChange("all-programs");
    onCohortChange("all-cohorts");
    onAppStatusChange("all-statuses");
    onPaymentStatusChange("all-payments");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* SEARCH BOX */}
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search students..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
      </div>

      {/* FILTER DROPDOWNS */}
      <div className="flex flex-wrap gap-2">

        {/* Programs */}
        <Select value={selectedProgram} onValueChange={onProgramChange}>
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

        {/* Cohorts */}
        <Select value={selectedCohort} onValueChange={onCohortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Cohort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-cohorts">All Cohorts</SelectItem>
            {cohorts.map((c) => (
              <SelectItem key={c._id} value={c.cohortId}>
                {c.cohortId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Application Status */}
        <Select value={selectedAppStatus} onValueChange={onAppStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Application Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-statuses">All Statuses</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="under review">Under Review</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="enrolled">Enrolled</SelectItem>
            <SelectItem value="dropped">Dropped</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Status */}
        <Select value={selectedPaymentStatus} onValueChange={onPaymentStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-payments">All Payment Status</SelectItem>
            <SelectItem value="token paid">Admission Fee Paid</SelectItem>
            <SelectItem value="instalments pending">Instalments Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" onClick={handleReset}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
