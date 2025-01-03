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

interface ApplicationFiltersProps {
  searchTerm: string;
  onSearchTermChange: Dispatch<SetStateAction<string>>;
  selectedStatus: string;
  onSelectedStatusChange: Dispatch<SetStateAction<string>>;
  sortBy: string;
  onSortByChange: Dispatch<SetStateAction<string>>;
}

export function ApplicationFilters({
  searchTerm,
  onSearchTermChange,
  selectedStatus,
  onSelectedStatusChange,
  sortBy,
  onSortByChange,
}: ApplicationFiltersProps) {
  const handleClearFilters = useCallback(() => {
      onSearchTermChange("");
      onSelectedStatusChange("all");
      onSortByChange("newest");
    }, [onSearchTermChange, onSelectedStatusChange, onSortByChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search applications..." className="pl-8" 
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select 
          value={selectedStatus}
          onValueChange={(value) => onSelectedStatusChange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="initiated">Initiated</SelectItem>
            <SelectItem value="under review">Under Review</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="on hold">On Hold</SelectItem>
            <SelectItem value="interview scheduled">Interview Scheduled</SelectItem>
            <SelectItem value="dropped">Dropped</SelectItem>
          </SelectContent>
        </Select>
        <Select 
          value={sortBy}
          onValueChange={(value) => onSortByChange(value)}
        >
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
        <Button variant="ghost" size="icon" onClick={handleClearFilters}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}