"use client";

import { Edit } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FeePreviewForm = dynamic(
  () => import("../steps/fee-preview-form").then((m) => m.FeePreviewForm),
  { ssr: false }
);

export function FeeStructurePreview() {
  const [editingCohort, setEditingCohort] = useState<any | null>(null);

  const handleCohortCreated = (cohort: any) => {
    setEditingCohort(cohort);
    // fetchCohorts();
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const feeDetails = {
    applicationFee: "₹500",
    tokenFee: "₹50,000",
    oneShotDiscount: "10%",
    semesters: "3",
    installmentsPerSemester: "3",
  };

  const installments = [
    { date: "22-Sep-2024", amount: "₹99,472.22" },
    { date: "22-Oct-2024", amount: "₹99,472.22" },
    { date: "22-Nov-2024", amount: "₹99,472.22" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Fee Structure</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsDialogOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Application Fee</p>
            <p className="font-medium">{feeDetails.applicationFee}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Admission Fee</p>
            <p className="font-medium">{feeDetails.tokenFee}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">One-Shot Discount</p>
            <p className="font-medium">{feeDetails.oneShotDiscount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Number of Semesters</p>
            <p className="font-medium">{feeDetails.semesters}</p>
          </div>
        </div>

        <Tabs defaultValue="effort_excellence" className="space-y-4">
          <h4 className="font-medium">Installment Schedule</h4>
          <TabsList variant="ghost">
            <TabsTrigger variant="xs" value="effort_excellence">
              Effort Excellence (5%)
            </TabsTrigger>
            <TabsTrigger variant="xs" value="strategic_scholar">
              Strategic Scholar (8%)
            </TabsTrigger>
            <TabsTrigger variant="xs" value="innovative_initiator">
              Innovative Initiator (12%)
            </TabsTrigger>
            <TabsTrigger variant="xs" value="creative_crusader">
              Creative Crusader (15%)
            </TabsTrigger>
          </TabsList>
          <TabsContent value="effort_excellence">
            <div className="space-y-4">
              <div className="space-y-2">
                <Card>
                  <CardHeader className="">
                    <div className="text-[#00A3FF]">Semester 01</div>
                  </CardHeader>
                  <CardContent className="">
                    {installments.map((installment, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b py-2"
                      >
                        <span className="text-sm">{installment.date}</span>
                        <span className="font-medium">
                          {installment.amount}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="">
                    <div className="text-[#00A3FF]">Semester 02</div>
                    {installments.map((installment, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b py-2"
                      >
                        <span className="text-sm">{installment.date}</span>
                        <span className="font-medium">
                          {installment.amount}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="">
                    <div className="text-[#00A3FF] ">Semester 03</div>
                    {installments.map((installment, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b py-2 mb-2"
                      >
                        <span className="text-sm">{installment.date}</span>
                        <span className="font-medium">
                          {installment.amount}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Dialog for Fee Structure Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-4xl p-6">
          {/* <FeeStructureForm onNext={() => console.log("Navigating to collaborators")} /> */}
          <FeePreviewForm
            onNext={() => console.log("Navigating to collaborators")}
            onCohortCreated={handleCohortCreated}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
