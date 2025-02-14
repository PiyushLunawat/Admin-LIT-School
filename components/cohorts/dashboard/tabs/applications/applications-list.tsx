"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock4Icon, Eye } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentApplicationHeader } from "./application-dialog/dialog-header";
import { PersonalDetailsTab } from "./application-dialog/personal-details-tab";
import { PaymentInformationTab } from "./application-dialog/payment-info-tab";
import { DocumentsTab } from "./application-dialog/document-tab";
import { getStudents } from "@/app/api/student";
import { DateRange } from "react-day-picker";

type BadgeVariant = "destructive" | "warning" | "secondary" | "success" | "lemon" | "onhold" | "default";
interface Application {
  id: string;
  name: string;
  applicationId: string;
  submissionDate: string;
  applicationStatus: string;
  interviewDate?: string;
  interviewTime?: string;
}

interface ApplicationsListProps {
  cohortId: string;
  onApplicationSelect: (id: string) => void;
  selectedIds: string[];
  selectedDateRange: DateRange | undefined;
  onSelectedIdsChange: (ids: string[]) => void;
  onApplicationUpdate: () => void;
  searchTerm: string;
  selectedStatus: string;
  sortBy: string;
}

export function ApplicationsList({
  cohortId,
  onApplicationSelect,
  selectedIds,
  selectedDateRange,
  onSelectedIdsChange,
  onApplicationUpdate,
  searchTerm,
  selectedStatus,
  sortBy,
}: ApplicationsListProps) {
  const [open, setOpen] = useState(false);
  const [applications, setApplications] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await getStudents();
        const mappedStudents =
          response.data.filter(
            (student: any) =>
              student?.applicationDetails !== undefined &&
              student.cohort?._id === cohortId
          )    

          setApplications(mappedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);


  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "initiated":
        return "default";
      case "under review":
        return "secondary";
      case "accepted":
      case "selected":
        return "success";
      case "rejected":
      case "not qualified":
        return "warning";
      case "on hold":
      case "waitlist":
        return "onhold";
      case "interview scheduled":
        return "default";
      case "interview rescheduled":
        return "lemon";
      case "interview concluded":
        return "lemon";
      default:
        return "secondary";
    }
  };

  const filteredAndSortedApplications = useMemo(() => {

    const filteredApplications = applications.filter((app: any) => {
      if (!selectedDateRange) return true;
      const appDate = new Date(app.updatedAt);
      const { from, to } = selectedDateRange;
      return (!from || appDate >= from) && (!to || appDate <= to);
    });
    // 1) Filter

    filteredApplications.sort((a: any, b: any) => {
      const dateA = new Date(a?.updatedAt);
      const dateB = new Date(b?.updatedAt);
  
      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
  
      const monthA = dateA.getMonth();
      const monthB = dateB.getMonth();
  
      if (monthA > monthB) return -1;
      if (monthA < monthB) return 1;
  
      const yearA = dateA.getFullYear(); 
      const yearB = dateB.getFullYear(); 
  
      if (yearA > yearB) return -1; 
      if (yearA < yearB) return 1; 
  
      return 0;
    });
  
    let filtered = filteredApplications;

    // a) Search filter by applicant name
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((app: any) => {
        const name = `${app.firstName ?? ""} ${app.lastName ?? ""}`.toLowerCase();
        return name.includes(lowerSearch);
      });
    }

    // b) Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((app: any) => {
        const status = app.applicationDetails?.applicationStatus?.toLowerCase() || "pending";
        return status === selectedStatus;
      });
    }

    // 2) Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a: any, b: any) => {
          const dateA = new Date(
            a?.applicationDetails?.updatedAt
          ).getTime();
          const dateB = new Date(
            b?.applicationDetails?.updatedAt
          ).getTime();
          return dateB - dateA; // newest first
        });
        break;

      case "oldest":
        filtered.sort((a: any, b: any) => {
          const dateA = new Date(
            a?.applicationDetails?.updatedAt
          ).getTime();
          const dateB = new Date(
            b?.applicationDetails?.updatedAt
          ).getTime();
          return dateA - dateB; // oldest first
        });
        break;

      case "name-asc":
        filtered.sort((a: any, b: any) => {
          const nameA = `${a.firstName ?? ""} ${a.lastName ?? ""}`.toLowerCase();
          const nameB = `${b.firstName ?? ""} ${b.lastName ?? ""}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
        break;

      case "name-desc":
        filtered.sort((a: any, b: any) => {
          const nameA = `${a.firstName ?? ""} ${a.lastName ?? ""}`.toLowerCase();
          const nameB = `${b.firstName ?? ""} ${b.lastName ?? ""}`.toLowerCase();
          return nameB.localeCompare(nameA);
        });
        break;
    }

    return filtered;
  }, [applications, searchTerm, selectedStatus, sortBy, selectedDateRange]);

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(applications.map((app: any) => app._id));
    }
  };

  const toggleSelectApplication = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedIdsChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onSelectedIdsChange([...selectedIds, id]);
    }
  };

  const handleEyeClick = (student: any) => {
    setSelectedStudentId(student); // Set the selected student ID
    setOpen(true); // Open the dialog
  };

  const handleStatusUpdate = () => {
    onApplicationUpdate();
  };

  useEffect(() => {
    if (filteredAndSortedApplications.length > 0) {
      const firstApplication = filteredAndSortedApplications[0];
      setSelectedRowId(firstApplication._id); // Set the selected row ID to the first application
      onApplicationSelect(firstApplication); // Call the onApplicationSelect function for the first application
    }
  }, [filteredAndSortedApplications]);

  return (
    applications.length === 0 ?
    <div className="w-full h-full flex items-center justify-center text-center text-muted-foreground border rounded-md">
      <div >All your students will appear here</div>
    </div> :
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === applications.length}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Application ID</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Interview</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedApplications.map((application: any) => (
            <TableRow
              key={application._id}
              className={`cursor-pointer ${selectedRowId === application._id ? "bg-muted" : ""}`}            
              onClick={() => {
                onApplicationSelect(application)
                setSelectedRowId(application._id);
              }}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(application._id)}
                  onCheckedChange={() => toggleSelectApplication(application._id)}
                />
              </TableCell>
              <TableCell className="font-medium">{application?.firstName || '-'} {application?.lastName || '-'}</TableCell>
              <TableCell className="max-w-[42px] truncate">{application?._id || "--"}</TableCell>
              <TableCell>
                {new Date(application?.applicationDetails?.updatedAt).toLocaleDateString() || "--"}
              </TableCell>
              <TableCell className="space-y-1">
                <Badge className="capitalize max-w-28 pr-2 truncate" variant={getStatusColor(application?.applicationDetails?.applicationStatus || "--")}>
                  {application?.applicationDetails?.applicationStatus || "--"}
                </Badge>
                {(application?.applicationDetails?.applicationStatus === 'under review' && application?.applicationDetails?.applicationTasks?.length > 1) &&
                <Badge className="capitalize flex items-center gap-1 bg-[#00A3FF1A] text-[#00A3FF] hover:bg-[#00A3FF]/20 w-fit">
                  <CheckCircle className="w-3 h-3"/> App. Revised
                </Badge>}
              </TableCell>
              <TableCell>
                {application?.applicationDetails?.applicationTestInterviews[application?.applicationDetails?.applicationTestInterviews.length - 1] ? (
                  <>
                    <div className="flex items-center text-sm">
                      <Clock4Icon className="h-3 w-3 mr-1" />
                      {application?.applicationDetails?.applicationTestInterviews[application?.applicationDetails?.applicationTestInterviews.length - 1]?.startTime}
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(application?.applicationDetails?.applicationTestInterviews[application?.applicationDetails?.applicationTestInterviews.length - 1]?.meetingDate).toLocaleDateString() || "--"}
                    </div>
                  </>
                ) : "--"}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon" className="hover:bg-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEyeClick(application);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog to display "Hi" message */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl py-2 px-6 h-[90vh] overflow-y-auto">
          {selectedStudentId && (
            <StudentApplicationHeader student={selectedStudentId} />
          )}

            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="w-full">
                <TabsTrigger value="personal">Personal Details</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <PersonalDetailsTab student={selectedStudentId} />
              </TabsContent>

              <TabsContent value="payment">
                <PaymentInformationTab student={selectedStudentId} />
              </TabsContent>

              <TabsContent value="documents">
                <DocumentsTab student={selectedStudentId} onUpdateStatus={handleStatusUpdate} />
              </TabsContent>
            </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
