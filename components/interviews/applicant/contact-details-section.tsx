"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactDetailsSectionProps {
  data: {
    emergency: {
      firstName: string;
      lastName: string;
      phone: string;
      relationship: string;
    };
    parents: {
      father: {
        firstName: string;
        lastName: string;
        phone: string;
        occupation: string;
      };
      mother?: {
        firstName: string;
        lastName: string;
        phone: string;
        occupation: string;
      };
      isFinanciallyDependent: boolean;
      hasAppliedForAid: boolean;
    };
  };
}

export function ContactDetailsSection({ data }: ContactDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emergency Contact */}
        <div className="space-y-4">
          <h3 className="font-medium">Emergency Contact</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{`${data.emergency.firstName} ${data.emergency.lastName}`}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Relationship</p>
              <p className="font-medium">{data.emergency.relationship}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Contact Number</p>
              <p className="font-medium">{data.emergency.phone}</p>
            </div>
          </div>
        </div>

        {/* Parental Information */}
        <div className="space-y-4">
          <h3 className="font-medium">Parental Information</h3>
          
          {/* Father's Details */}
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Father&apos;s/Guardian&apos;s Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{`${data.parents.father.firstName} ${data.parents.father.lastName}`}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Occupation</p>
                <p className="font-medium">{data.parents.father.occupation}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Contact Number</p>
                <p className="font-medium">{data.parents.father.phone}</p>
              </div>
            </div>
          </div>

          {/* Mother's Details */}
          {data.parents.mother && (
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Mother&apos;s Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{`${data.parents.mother.firstName} ${data.parents.mother.lastName}`}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Occupation</p>
                  <p className="font-medium">{data.parents.mother.occupation}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Contact Number</p>
                  <p className="font-medium">{data.parents.mother.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Financial Information */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Financially Dependent on Parents</p>
              <p className="font-medium">{data.parents.isFinanciallyDependent ? "Yes" : "No"}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Previous Financial Aid Applications</p>
              <p className="font-medium">{data.parents.hasAppliedForAid ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}