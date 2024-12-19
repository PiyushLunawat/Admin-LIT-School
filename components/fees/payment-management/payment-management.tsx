"use client";

import { useState } from "react";
import { PaymentsList } from "./payments-list";
import { PaymentFilters } from "./payment-filters";
import { PaymentDetails } from "./payment-details";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Mail } from "lucide-react";

export function PaymentManagement() {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<string[]>([]);

  const handleBulkReminder = () => {
    console.log("Sending payment reminders to:", selectedPaymentIds);
  };

  const handleBulkExport = () => {
    console.log("Exporting payment data for:", selectedPaymentIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment Management</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleBulkReminder}
            disabled={selectedPaymentIds.length === 0}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Reminders
          </Button>
          <Button
            variant="outline"
            onClick={handleBulkExport}
            disabled={selectedPaymentIds.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Selected
          </Button>
        </div>
      </div>

      <PaymentFilters />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PaymentsList
            onPaymentSelect={(id) => setSelectedPaymentId(id)}
            selectedIds={selectedPaymentIds}
            onSelectedIdsChange={setSelectedPaymentIds}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="h-[calc(100vh-7rem)] overflow-hidden">
              {selectedPaymentId ? (
                <PaymentDetails
                  paymentId={selectedPaymentId}
                  onClose={() => setSelectedPaymentId(null)}
                />
              ) : (
                <div className="h-full flex items-center justify-center p-6 text-muted-foreground">
                  <p className="text-center">
                    Select a payment to view details
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}