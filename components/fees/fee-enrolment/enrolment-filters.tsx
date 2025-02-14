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

interface EnrolmentFiltersProps {
  searchQuery: string;
  onSearchQueryChange: Dispatch<SetStateAction<string>>;
  cohorts: any[];
  selectedCohort: string;
  onCohortChange: (value: string) => void;
  selectedStatus: string;
  onSelectedStatusChange: Dispatch<SetStateAction<string>>;
  sortBy: string;
  onSortByChange: Dispatch<SetStateAction<string>>;
}

export function EnrolmentFilters({
  searchQuery,
  onSearchQueryChange,
  cohorts,
  selectedCohort,
  onCohortChange,
  selectedStatus,
  onSelectedStatusChange,
  sortBy,
  onSortByChange,
}: EnrolmentFiltersProps) {

  const handleClearFilters = useCallback(() => {
    onSearchQueryChange("");
    onCohortChange("all-cohorts")
    onSelectedStatusChange("all-status");
    onSortByChange("newest");
  }, [onSearchQueryChange, onCohortChange, onSelectedStatusChange, onSortByChange]);

  return (
    <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
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
    
              <Select value={selectedStatus} onValueChange={onSelectedStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="pending">pending</SelectItem>
                  <SelectItem value="verification-pending">Verification Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
    
              <Select value={sortBy} onValueChange={onSortByChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(searchQuery !== "" || selectedCohort !== "all-cohorts" || selectedStatus !== "all-status" || sortBy !== "newest") && 
             <Button variant="ghost" size="icon" onClick={handleClearFilters}>
                <X className="-ml-4 h-4 w-4" />
              </Button>
            }
          </div>
        </div>
  );
}