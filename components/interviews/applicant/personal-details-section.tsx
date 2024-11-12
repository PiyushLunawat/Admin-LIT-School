"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PersonalDetailsSectionProps {
  data: {
    photo?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    currentStatus: string;
    program: string;
    cohort: string;
    gender: string;
    linkedinUrl?: string;
    instagramUrl?: string;
    address: {
      street: string;
      state: string;
      city: string;
      zipCode: string;
    };
  };
}

export function PersonalDetailsSection({ data }: PersonalDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info with Photo */}
        <div className="flex gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={data.photo} alt={`${data.firstName} ${data.lastName}`} />
            <AvatarFallback>{`${data.firstName[0]}${data.lastName[0]}`}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">{`${data.firstName} ${data.lastName}`}</h3>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{data.email}</p>
              <p className="text-sm text-muted-foreground">{data.phone}</p>
            </div>
          </div>
        </div>

        {/* Program Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Program</p>
            <p className="font-medium">{data.program}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cohort</p>
            <p className="font-medium">{data.cohort}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Status</p>
            <Badge variant="secondary">{data.currentStatus}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gender</p>
            <p className="font-medium">{data.gender}</p>
          </div>
        </div>

        {/* Social Links */}
        {(data.linkedinUrl || data.instagramUrl) && (
          <div className="space-y-2">
            <h4 className="font-medium">Social Profiles</h4>
            <div className="space-y-1">
              {data.linkedinUrl && (
                <p className="text-sm">
                  <span className="text-muted-foreground">LinkedIn:</span>{" "}
                  <a href={data.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {data.linkedinUrl}
                  </a>
                </p>
              )}
              {data.instagramUrl && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Instagram:</span>{" "}
                  <a href={data.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {data.instagramUrl}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Address */}
        <div className="space-y-2">
          <h4 className="font-medium">Current Address</h4>
          <div className="space-y-1">
            <p className="text-sm">{data.address.street}</p>
            <p className="text-sm">
              {data.address.city}, {data.address.state} {data.address.zipCode}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}