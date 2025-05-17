"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExcelJS from "exceljs";
import { Download } from "lucide-react";
import { useState } from "react";
import { PresentationCalendar } from "./presentation-calendar";
import { PresentationDetails } from "./presentation-details";
import { PresentationFilters } from "./presentation-filters";
import { PresentationList } from "./presentation-list";

export function LitmusPresentations() {
  const [selectedPresentationId, setSelectedPresentationId] = useState<
    string | null
  >(null);
  const [selectedPresentationIds, setSelectedPresentationIds] = useState<
    string[]
  >([]);

  const handleBulkExport = async (selectedStudents: any[]) => {
    if (selectedStudents.length === 0) {
      console.log("No students selected for export.");
      return;
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Students");

    // Define columns with explicit types
    worksheet.columns = [
      { header: "Student's Name", key: "name", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone No.", key: "phone", width: 15, style: { numFmt: "@" } },
      { header: "Address", key: "address", width: 40 },
      { header: "Fathers' Name", key: "fatherName", width: 20 },
      {
        header: "Father's Contact",
        key: "fatherContact",
        width: 15,
        style: { numFmt: "@" },
      },
      { header: "Father's Email", key: "fatherEmail", width: 30 },
      { header: "Mother's Name", key: "motherName", width: 20 },
      {
        header: "Mother's Contact",
        key: "motherContact",
        width: 15,
        style: { numFmt: "@" },
      },
      { header: "Mother's Email", key: "motherEmail", width: 30 },
      { header: "Emergency Contact Name", key: "emergencyName", width: 20 },
      {
        header: "Emergency Contact Number",
        key: "emergencyNumber",
        width: 15,
        style: { numFmt: "@" },
      },
      { header: "Emergency Contact Email", key: "emergencyEmail", width: 30 },
    ];

    // Add rows
    selectedStudents.forEach((student) => {
      const studentDetails =
        student.appliedCohorts?.[student.appliedCohorts.length - 1]
          ?.applicationDetails?.studentDetails;

      worksheet.addRow({
        name: `${student?.firstName || ""} ${student?.lastName || ""}`.trim(),
        email: student?.email || "",
        phone: student?.mobileNumber || "",
        address: `${studentDetails?.currentAddress?.streetAddress || ""} ${
          studentDetails?.currentAddress?.city || ""
        } ${studentDetails?.currentAddress?.state || ""} ${
          studentDetails?.currentAddress?.postalCode || ""
        }`.trim(),
        fatherName: `${
          studentDetails?.parentInformation?.father?.firstName || ""
        } ${studentDetails?.parentInformation?.father?.lastName || ""}`.trim(),
        fatherContact:
          studentDetails?.parentInformation?.father?.contactNumber || "",
        fatherEmail: studentDetails?.parentInformation?.father?.email || "",
        motherName: `${
          studentDetails?.parentInformation?.mother?.firstName || ""
        } ${studentDetails?.parentInformation?.mother?.lastName || ""}`.trim(),
        motherContact:
          studentDetails?.parentInformation?.mother?.contactNumber || "",
        motherEmail: studentDetails?.parentInformation?.mother?.email || "",
        emergencyName: `${studentDetails?.emergencyContact?.firstName || ""} ${
          studentDetails?.emergencyContact?.lastName || ""
        }`.trim(),
        emergencyNumber: studentDetails?.emergencyContact?.contactNumber || "",
        emergencyEmail: studentDetails?.emergencyContact?.email || "",
      });
    });

    // Force all phone number columns to be text format
    ["phone", "fatherContact", "motherContact", "emergencyNumber"].forEach(
      (column) => {
        worksheet
          .getColumn(column)
          .eachCell({ includeEmpty: false }, (cell) => {
            cell.numFmt = "@";
          });
      }
    );

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create blob and download
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students_export.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Presentation Schedule</h2>
        <Button
          variant="outline"
          onClick={() => handleBulkExport(selectedPresentationIds)}
          disabled={selectedPresentationIds.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Selected
        </Button>
      </div>

      <PresentationFilters />

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <PresentationCalendar
            onPresentationSelect={(id) => setSelectedPresentationId(id)}
          />
        </TabsContent>

        <TabsContent value="list">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PresentationList
                onPresentationSelect={(id) => setSelectedPresentationId(id)}
                selectedIds={selectedPresentationIds}
                onSelectedIdsChange={setSelectedPresentationIds}
              />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Card className="h-[calc(100vh-7rem)] overflow-hidden">
                  {selectedPresentationId ? (
                    <PresentationDetails
                      presentationId={selectedPresentationId}
                      onClose={() => setSelectedPresentationId(null)}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center p-6 text-muted-foreground">
                      <p className="text-center">
                        Select a presentation to view details
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
