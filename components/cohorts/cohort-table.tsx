"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CohortTableProps {
  type: "active" | "archived";
}

export function CohortTable({ type }: CohortTableProps) {
  const cohorts = [
    {
      id: "CM01JY",
      program: "Creator Marketer",
      centre: "Jayanagar",
      startDate: "2024-09-01",
      endDate: "2025-02-28",
      schedule: "M-W-F Morning",
      seats: "50",
      filled: "32",
      status: type === "active" ? "In Progress" : "Completed",
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cohort ID</TableHead>
          <TableHead>Program</TableHead>
          <TableHead>Centre</TableHead>
          <TableHead>Schedule</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Seats</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cohorts.map((cohort) => (
          <TableRow key={cohort.id}>
            <TableCell className="font-medium">{cohort.id}</TableCell>
            <TableCell>{cohort.program}</TableCell>
            <TableCell>{cohort.centre}</TableCell>
            {/* <TableCell>{cohort?.schedule}</TableCell> */}
            <TableCell>
              {new Date(cohort.startDate).toLocaleDateString()} -{" "}
              {new Date(cohort.endDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {cohort.filled}/{cohort.seats}
            </TableCell>
            <TableCell>
              <Badge
                variant={type === "active" ? "default" : "secondary"}
              >
                {cohort.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
              {type === "active" && (
                <Button variant="ghost" size="sm">
                  Archive
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}