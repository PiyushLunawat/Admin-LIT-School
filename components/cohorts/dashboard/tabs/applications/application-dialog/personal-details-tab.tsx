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
  student: any;
}

export function PersonalDetailsTab({ student }: PersonalDetailsTabProps) {
  const [isEditing, setIsEditing] = useState(false);


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
                defaultValue={(student?.firstName +' '+ student?.lastName) || '--'}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input
                type="date"
                defaultValue={student?.dateOfBirth}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select disabled={!isEditing} defaultValue={student?.gender?.toLowerCase()}>
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
              <Select disabled={!isEditing} defaultValue={student?.currentStatus?.toLowerCase().replace(" ", "-")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="CollegeGraduate">College Graduate</SelectItem>
                  <SelectItem value="WorkingProfessional">Working Professional</SelectItem>
                  <SelectItem value="Freelancer">Freelancer</SelectItem>
                  <SelectItem value="BusinessOwner">Business Owner</SelectItem>
                  <SelectItem value="Consultant">Consultant</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Program of Interest</Label>
              <Input
                defaultValue={student?.program?.name}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Cohort</Label>
              <Input
                defaultValue={new Date(student?.cohort?.startDate).toLocaleDateString() +' '+(student?.cohort.timeSlot)+', '+ student?.cohort?.centerDetail}
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
                defaultValue={student?.email}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                defaultValue={student?.mobileNumber}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn Profile</Label>
              <Input
                defaultValue={student?.linkedInUrl}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Instagram Profile</Label>
              <Input
                defaultValue={student?.instagramUrl}
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
                defaultValue={student?.applicationDetails?.studenDetails?.previousEducation?.highestLevelOfEducation}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Field of Study</Label>
              <Input
                defaultValue={student?.applicationDetails?.studenDetails?.previousEducation?.fieldOfStudy}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Name of Institution</Label>
              <Input
                defaultValue={student?.applicationDetails?.studenDetails?.previousEducation?.nameOfInstitution}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Year of Graduation</Label>
              <Input
                defaultValue={student?.applicationDetails?.studenDetails?.previousEducation?.yearOfGraduation}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Work Experience Type</Label>
              <Input
                defaultValue={student?.applicationDetails?.studenDetails?.previousEducation?.ExperienceType}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Apx. Duration of Work</Label>
              <Input
                defaultValue={student?.applicationDetails?.studenDetails?.previousEducation?.ApxDuration}
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
                defaultValue={student?.applicationDetails?.studenDetails?.emergencyContact?.firstName+' '+student?.applicationDetails?.studenDetails?.emergencyContact?.lastName}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input
                defaultValue={student?.applicationDetails?.studenDetails?.emergencyContact?.contactNumber}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Relationship</Label>
              <Input
                defaultValue={student?.applicationDetails?.studenDetails?.emergencyContact?.relationshipWithStudent}
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
                defaultValue={student?.applicationDetails?.studenDetails?.parentInformation?.father?.firstName+' '+student?.applicationDetails?.studenDetails?.parentInformation?.father?.lastName}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Mother&apos;s Name</Label>
              <Input
                defaultValue={student?.applicationDetails?.studenDetails?.parentInformation?.mother?.firstName+' '+student?.applicationDetails?.studenDetails?.parentInformation?.mother?.lastName}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Father&apos;s Contact Number</Label>
              <Input
                defaultValue={student?.applicationDetails?.studenDetails?.parentInformation?.father?.contactNumber}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Mother&apos;s Contact Number</Label>
              <Input
                defaultValue={student?.applicationDetails?.studenDetails?.parentInformation?.mother?.contactNumber}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Father&apos;s Email</Label>
              <Input
                defaultValue={student?.applicationDetails?.studenDetails?.parentInformation?.father?.email}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Mother&apos;s Email</Label>
              <Input
                defaultValue={student?.applicationDetails?.studenDetails?.parentInformation?.mother?.email}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Father&apos;s Occupation</Label>
              <Input
                defaultValue={student?.applicationDetails?.studenDetails?.parentInformation?.father?.occupation}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Mother&apos;s Occupation</Label>
              <Input
                defaultValue={student?.applicationDetails?.studenDetails?.parentInformation?.mother?.occupation}
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
              {student?.applicationDetails?.studenDetails?.financialInformation?.isFinanciallyIndependent === true ? 
                <Label className="flex gap-2 items-center"><CircleMinus className="w-3 h-3 text-[#FF791F] " />Financially dependent on Parents</Label> : 
                <Label className="flex gap-2 items-center"><CircleCheckBig className="w-3 h-3 text-[#2EB88A] " />Financially independent on Parents</Label>
              }
            </div>
            <div className="">
              {student?.applicationDetails?.studenDetails?.financialInformation?.hasAppliedForFinancialAid === true ? 
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