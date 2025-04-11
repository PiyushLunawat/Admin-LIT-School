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

interface LitmusTestFiltersProps {
  searchTerm: string;
  onSearchTermChange: Dispatch<SetStateAction<string>>;
  selectedStatus: string;
  onSelectedStatusChange: Dispatch<SetStateAction<string>>;
  sortBy: string;
  onSortByChange: Dispatch<SetStateAction<string>>;
}

export function LitmusTestFilters({
  searchTerm,
  onSearchTermChange,
  selectedStatus,
  onSelectedStatusChange,
  sortBy,
  onSortByChange,
}: LitmusTestFiltersProps) {

  const handleClearFilters = useCallback(() => {
    onSearchTermChange("");
    onSelectedStatusChange("all-status");
    onSortByChange("newest");
  }, [onSearchTermChange, onSelectedStatusChange, onSortByChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search by name */}
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search submissions..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>

      {/* Status & Sort Dropdowns */}
      <div className="flex gap-2">
        <Select
          value={selectedStatus}
          onValueChange={(value) => onSelectedStatusChange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="submitted">Submitted Task</SelectItem>
            <SelectItem value="interview scheduled">Presentation Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
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

        {!(searchTerm === "" && selectedStatus === "all-status" && sortBy === "newest") &&
          <Button variant="ghost" size="icon" onClick={handleClearFilters}>
            <X className="h-4 w-4" />
          </Button>
        }
      </div>
    </div>
  );
}
