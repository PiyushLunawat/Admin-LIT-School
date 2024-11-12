"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StudentReportsProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export function StudentReports({ dateRange }: StudentReportsProps) {
  // In a real application, this data would be fetched based on the dateRange
  const defaulters = [
    {
      name: "John Doe",
      program: "Creator Marketer",
      cohort: "CM01JY",
      outstandingAmount: "₹1,65,833",
      daysOverdue: 15,
    },
    {
      name: "Jane Smith",
      program: "Digital Marketing",
      cohort: "DM01JY",
      outstandingAmount: "₹3,31,666",
      daysOverdue: 30,
    },
  ];

  const scholarships = [
    {
      name: "Smart Mouth",
      recipients: 5,
      totalAmount: "₹2,48,750",
      percentage: "5%",
    },
    {
      name: "Smart Ass",
      recipients: 4,
      totalAmount: "₹3,18,400",
      percentage: "8%",
    },
    {
      name: "Wise Ass",
      recipients: 3,
      totalAmount: "₹2,98,500",
      percentage: "10%",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Defaulters List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Days Overdue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {defaulters.map((defaulter, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {defaulter.name}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span>{defaulter.program}</span>
                      <p className="text-sm text-muted-foreground">
                        {defaulter.cohort}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{defaulter.outstandingAmount}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">
                      {defaulter.daysOverdue} days
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scholarship Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slab</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scholarships.map((scholarship, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {scholarship.name}
                  </TableCell>
                  <TableCell>{scholarship.recipients}</TableCell>
                  <TableCell>{scholarship.totalAmount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {scholarship.percentage}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}