"use client";

import { useState } from "react";
import { PresentationCalendar } from "./presentation-calendar";
import { PresentationList } from "./presentation-list";
import { PresentationDetails } from "./presentation-details";
import { PresentationFilters } from "./presentation-filters";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LitmusPresentations() {
  const [selectedPresentationId, setSelectedPresentationId] = useState<string | null>(null);
  const [selectedPresentationIds, setSelectedPresentationIds] = useState<string[]>([]);

  const handleBulkExport = () => {
    console.log("Exporting data for:", selectedPresentationIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Presentation Schedule</h2>
        <Button
          variant="outline"
          onClick={handleBulkExport}
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