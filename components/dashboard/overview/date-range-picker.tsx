"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/utils";
import { addDays, format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
}

export function DateRangePicker({ setDateRange }: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [selectedValue, setSelectedValue] = useState("all");

  const presets = [
    { label: "Select Range", value: "all" },
    { label: "Today", value: "today", days: 0 },
    { label: "Yesterday", value: "yesterday", days: -1 },
    { label: "Last 7 days", value: "7days", days: -7 },
    { label: "Last 30 days", value: "30days", days: -30 },
    { label: "Last 90 days", value: "90days", days: -90 },
    { label: "Last year", value: "365days", days: -365 },
  ];

  const handleDateChange = useCallback(
    (range: DateRange | undefined) => {
      setDate(range);
      setDateRange(range);
    },
    [setDateRange]
  );

  const resetDateRange = () => {
    setDate(undefined); // Reset calendar date range
    setDateRange(undefined); // Clear the selected range
    setSelectedValue("all"); // Reset the selected value in Select
  };

  return (
    <div className="flex flex-wrap items-center gap-1 sm:gap-4">
      <Select
        value={selectedValue}
        onValueChange={(value) => {
          setSelectedValue(value);
          if (value === "all") {
            handleDateChange(undefined); // No date range selected
          } else {
            const preset = presets.find((p) => p.value === value);
            if (preset) {
              const to = new Date();
              const from =
                preset.days !== undefined
                  ? addDays(to, preset.days)
                  : undefined;
              handleDateChange({ from, to });
            }
          }
        }}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.value} value={preset.value}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal w-auto sm:w-[300px]",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => {
              handleDateChange(range);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        size="icon"
        className="-ml-3"
        onClick={resetDateRange}
      >
        <X className="ml-4 sm:ml-0 h-4 w-4" />
      </Button>
    </div>
  );
}
