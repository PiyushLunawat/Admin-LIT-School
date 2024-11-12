"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap } from "lucide-react";

interface EducationExperienceSectionProps {
  data: {
    education: {
      level: string;
      fieldOfStudy?: string;
      graduationYear: string;
      institution: string;
      hasGraduated: boolean;
    };
    experience: {
      hasExperience: boolean;
      type?: "Freelancer" | "Working Professional" | "Business Owner";
      details?: {
        description?: string;
        company?: string;
        duration?: string;
        revenue?: string;
        startDate?: string;
      };
    };
  };
}

export function EducationExperienceSection({ data }: EducationExperienceSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Education & Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Education */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            <h3 className="font-medium">Education</h3>
          </div>
          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{data.education.level}</h4>
                <p className="text-sm text-muted-foreground">{data.education.institution}</p>
              </div>
              <Badge variant="secondary">
                {data.education.hasGraduated ? "Graduated" : "Ongoing"}
              </Badge>
            </div>
            {data.education.fieldOfStudy && (
              <p className="text-sm">Field: {data.education.fieldOfStudy}</p>
            )}
            <p className="text-sm">
              Year: {data.education.graduationYear}
              {!data.education.hasGraduated && " (Expected)"}
            </p>
          </div>
        </div>

        {/* Work Experience */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            <h3 className="font-medium">Work Experience</h3>
          </div>
          {data.experience.hasExperience ? (
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{data.experience.type}</h4>
                  {data.experience.details?.company && (
                    <p className="text-sm text-muted-foreground">
                      {data.experience.details.company}
                    </p>
                  )}
                </div>
                {data.experience.details?.duration && (
                  <Badge variant="outline">{data.experience.details.duration}</Badge>
                )}
              </div>
              {data.experience.details?.description && (
                <p className="text-sm">{data.experience.details.description}</p>
              )}
              {data.experience.type === "Business Owner" && (
                <div className="space-y-1">
                  {data.experience.details?.revenue && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Revenue:</span>{" "}
                      {data.experience.details.revenue}
                    </p>
                  )}
                  {data.experience.details?.startDate && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Started:</span>{" "}
                      {data.experience.details.startDate}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No work experience</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}