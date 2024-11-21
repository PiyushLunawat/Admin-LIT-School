"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleCheck, CircleCheckBig, CircleMinus, Edit, Save } from "lucide-react";

interface PersonalDetailsTabProps {
  studentId: string;
}

export function PersonalDetailsTab({ studentId }: PersonalDetailsTabProps) {
  const [isEditing, setIsEditing] = useState(false);

  // In a real application, this data would be fetched based on the studentId
  const student = {
    name: "John Doe",
    dob: "1998-05-15",
    gender: "Male",
    programofInterest: "",
    cohort: "Creatorpreneur",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    currentStatus: "College Student",
    linkedin: "linkedin.com/in/johndoe",
    instagram: "instagram.com/johndoe",
    streetAddress: "A-5, 5th Block",
    city: "Banglore",
    state: "Karnataka",
    postalZipCode: "560011",
    previousEducation: {
      HighestLevelofEducation: "Bachloer's Degree",
      FieldofStudy: "Designing",
      NameofInstitution: "Crist",
      YearofGraduation: "2024",
      ExperienceType: "Freelancer",
      ApxDuration: "3 Months",
      financialDependency: "No",
      financialAidHistory: "Yes",
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Mother",
      phone: "+91 98765 43211",
    },
    parentalInfo: {
      fatherName: "James Doe",
      fatherOccupation: "Business Owner",
      fatherContact: "9834339823",
      motherName: "Jane Doe",
      motherOccupation: "Teacher",
      motherContact: "9834339823",
      financialDependency: "No",
      financialAidHistory: "Yes",
    },
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Personal Details</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <Save className="h-4 w-4 mr-2" />
            ) : (
              <Edit className="h-4 w-4 mr-2" />
            )}
            {isEditing ? "Save Changes" : "Edit Details"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                defaultValue={student.name}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input
                type="date"
                defaultValue={student.dob}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select disabled={!isEditing} defaultValue={student.gender.toLowerCase()}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Current Status</Label>
              <Select disabled={!isEditing} defaultValue={student.currentStatus.toLowerCase().replace(" ", "-")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="college-student">College Student</SelectItem>
                  <SelectItem value="working-professional">Working Professional</SelectItem>
                  <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Program of Interest</Label>
              <Input
                defaultValue={student.programofInterest}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Cohort</Label>
              <Input
                defaultValue={student.cohort}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                defaultValue={student.email}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                defaultValue={student.phone}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn Profile</Label>
              <Input
                defaultValue={student.linkedin}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Instagram Profile</Label>
              <Input
                defaultValue={student.instagram}
                readOnly={!isEditing}
              />
            </div>
          </div>  
        </CardContent>
      </Card>

      {/* Previous Education and Experience */}
      <Card>
        <CardHeader>
          <CardTitle>Previous Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Highest Level of Education Attained</Label>
              <Input
                defaultValue={student.previousEducation.HighestLevelofEducation}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Field of Study</Label>
              <Input
                defaultValue={student.previousEducation.FieldofStudy}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Name of Institution</Label>
              <Input
                defaultValue={student.previousEducation.NameofInstitution}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Year of Graduation</Label>
              <Input
                defaultValue={student.previousEducation.YearofGraduation}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Work Experience Type</Label>
              <Input
                defaultValue={student.previousEducation.ExperienceType}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Apx. Duration of Work</Label>
              <Input
                defaultValue={student.previousEducation.ApxDuration}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contact Name</Label>
              <Input
                defaultValue={student.emergencyContact.name}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input
                defaultValue={student.emergencyContact.phone}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Relationship</Label>
              <Input
                defaultValue={student.emergencyContact.relationship}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parental Information */}
      <Card>
        <CardHeader>
          <CardTitle>Parental Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Father&apos;s Name</Label>
              <Input
                defaultValue={student.parentalInfo.fatherName}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Mother&apos;s Name</Label>
              <Input
                defaultValue={student.parentalInfo.motherName}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Father&apos;s Contact Number</Label>
              <Input
                defaultValue={student.parentalInfo.fatherContact}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Mother&apos;s Contact Number</Label>
              <Input
                defaultValue={student.parentalInfo.motherContact}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Father&apos;s Occupation</Label>
              <Input
                defaultValue={student.parentalInfo.fatherOccupation}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Mother&apos;s Occupation</Label>
              <Input
                defaultValue={student.parentalInfo.motherOccupation}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="">
              {student.parentalInfo.financialDependency === "Yes" ? 
                <Label className="flex gap-2 items-center"><CircleCheckBig className="w-3 h-3 text-[#2EB88A] " />Financially dependent on Parents</Label> : 
                <Label className="flex gap-2 items-center"><CircleMinus className="w-3 h-3 text-[#FF791F] " />Financially independent on Parents</Label>
              }
            </div>
            <div className="">
              {student.parentalInfo.financialAidHistory === "Yes" ? 
                <Label className="flex gap-2 items-center"><CircleCheckBig className="w-3 h-3 text-[#2EB88A] " />Has tried applying for financial aid earlier</Label> : 
                <Label className="flex gap-2 items-center"><CircleMinus className="w-3 h-3 text-[#FF791F] " />Has not tried applying for any financial aid earlier</Label>
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}