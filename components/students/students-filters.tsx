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
import { getCohorts } from "@/app/api/cohorts";
import { useEffect, useState } from "react";
import { getCentres } from "@/app/api/centres";
import { getPrograms } from "@/app/api/programs";

export function StudentsFilters() {
  const [interest, setInterest] = useState<any[]>([]);  
  const [programs, setPrograms] = useState<any[]>([]);  
  const [centres, setCentres] = useState<any[]>([]);  
  const [cohorts, setCohorts] = useState<any[]>([]);  
  useEffect(() => {
    async function fetchData() {
      try {
        const cohortsData = await getCohorts();
        const programsData = await getPrograms();
        setPrograms(programsData.data);
        const centresData = await getCentres();
        setCentres(centresData.data);
        setInterest(programsData.data);
        console.log("sg",programsData.data);
        
        setCohorts(cohortsData.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    }
    fetchData();
  }, []);

  
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search students..." className="pl-8" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Select defaultValue="all-programs">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-programs">All Programs</SelectItem>
            {interest.map((int) => (
              <SelectItem key={int.name} value={int.name}>
                {(int.programDetail)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue="all-cohorts">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Cohort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-cohorts">All Cohorts</SelectItem>
            <SelectItem value="cm01jy">CM01JY</SelectItem>
            <SelectItem value="cm02jy">CM02JY</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-statuses">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-statuses">All Statuses</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="under-review">Under Review</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="enrolled">Enrolled</SelectItem>
            <SelectItem value="dropped">Dropped</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-payments">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-payments">All Payment Status</SelectItem>
            <SelectItem value="token-paid">Token Paid</SelectItem>
            <SelectItem value="instalments-pending">Instalments Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}