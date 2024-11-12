"use client";

import { useState } from "react";
import { ReportsOverview } from "./reports-overview";
import { PaymentReports } from "./payment-reports";
import { StudentReports } from "./student-reports";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DateRangePicker } from "./date-range-picker";
import { Card } from "@/components/ui/card";

export function FeesReports() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleExport = (format: "pdf" | "excel") => {
    console.log(`Exporting report in ${format} format for date range:`, dateRange);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Reports</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("excel")}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </Card>

      <div className="grid gap-6">
        <ReportsOverview dateRange={dateRange} />
        <PaymentReports dateRange={dateRange} />
        <StudentReports dateRange={dateRange} />
      </div>
    </div>
  );
}