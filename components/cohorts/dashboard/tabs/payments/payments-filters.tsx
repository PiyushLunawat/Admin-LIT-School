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
import { Dispatch, SetStateAction } from "react";
import { Search, X } from "lucide-react";

interface PaymentsFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  scholarship: any[];
  selectedScholarship: string;
  onScholarshipChange: (value: string) => void;
  selectedPaymentStatus: string;
  onPaymentStatusChange: (value: string) => void;
  selectedPaymentPlan: string;
  onPaymentPlanChange: (value: string) => void;
}

export function PaymentsFilters({
  searchQuery,
  onSearchQueryChange,
  scholarship,
  selectedScholarship,
  onScholarshipChange,
  selectedPaymentStatus,
  onPaymentStatusChange,
  selectedPaymentPlan,
  onPaymentPlanChange,
}: PaymentsFiltersProps) {
  const handleReset = () => {
    onSearchQueryChange("");
    onPaymentStatusChange("all");
    onPaymentPlanChange("all");
    onScholarshipChange("all");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search students..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Payment Status Filter */}
        <Select
          value={selectedPaymentStatus}
          onValueChange={onPaymentStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="on time">On Time</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="pending">Next Payment Pending</SelectItem>
            <SelectItem value="complete">All Payments Complete</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Plan Filter */}
        <Select
          value={selectedPaymentPlan}
          onValueChange={onPaymentPlanChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="one shot payment">One-Shot</SelectItem>
            <SelectItem value="instalments">Instalments</SelectItem>
          </SelectContent>
        </Select>

        {/* Scholarship Filter */}
        <Select
          value={selectedScholarship}
          onValueChange={onScholarshipChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Scholarship" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scholarships</SelectItem>
            {scholarship.map((sch) => (
              <SelectItem key={sch.id} value={sch.name}>
                {sch.name} ({sch.percentage}%)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button */}
        <Button variant="ghost" size="icon" onClick={handleReset}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
