"use client";

import { useEffect, useState } from "react";
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
import { getCurrentStudents } from "@/app/api/student";

interface PersonalDetailsTabProps {
  studentId: any;
}

export function PersonalDetailsTab({ studentId }: PersonalDetailsTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  async function fetchStudent() {
    try {
      const application = await getCurrentStudents(studentId);
      setStudent(application?.data || null);
      console.log("asfsfv",application?.data)
    } catch (error) {
      console.error("Failed to fetch student data:", error);
    }
  }



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
              <Input disabled
                defaultValue={student?.firstName + ' ' + student?.lastName}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input disabled={!isEditing}
                defaultValue={new Date(student?.dateOfBirth).toLocaleDateString()}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select disabled={!isEditing} value={student?.gender}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Current Status</Label>
              <Select disabled={!isEditing} value={student?.qualification}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="College Graduate">College Graduate</SelectItem>
                  <SelectItem value="Working Professional">Working Professional</SelectItem>
                  <SelectItem value="Freelancer">Freelancer</SelectItem>
                  <SelectItem value="Business Owner">Business Owner</SelectItem>
                  <SelectItem value="Consultant">Consultant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Program of Interest</Label>
              <Input disabled
                defaultValue={student?.program?.name}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Cohort</Label>
              <Input disabled
                defaultValue={student?.cohort?.cohortId}
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
              <Input disabled
                type="email"
                defaultValue={student?.email}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input disabled
                defaultValue={student?.mobileNumber}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn Profile</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.linkedInUrl}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Instagram Profile</Label>
              <Input disabled={!isEditing}
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
              <Input disabled={!isEditing}
                defaultValue={student?.studentDetails?.previousEducation?.highestLevelOfEducation}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Field of Study</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.studentDetails?.previousEducation?.fieldOfStudy}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Name of Institution</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.studentDetails?.previousEducation?.nameOfInstitution}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Year of Graduation</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.studentDetails?.previousEducation?.yearOfGraduation}
                readOnly={!isEditing}
              />
            </div>
            {student?.applicationDetails?.studenDetails?.workExperience &&
            <>
              <div className="space-y-2">
              <Label>Work Experience Type</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.applicationDetails?.studenDetails?.workExperience?.experienceType}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Job Description</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.applicationDetails?.studenDetails?.workExperience?.jobDescription}
                readOnly={!isEditing}
              />
            </div>
            {student?.applicationDetails?.studenDetails?.workExperience?.nameOfCompany &&
            <div className="space-y-2">
              <Label>Name of Company</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.applicationDetails?.studenDetails?.workExperience?.nameOfCompany}
                readOnly={!isEditing}
              />
            </div>}
            {student?.applicationDetails?.studenDetails?.workExperience?.duration &&
            <div className="space-y-2">
              <Label>Apx Duration of Work</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.applicationDetails?.studenDetails?.workExperience?.duration}
                readOnly={!isEditing}
              />
            </div>}
            </>}
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
              <Input disabled={!isEditing}
                defaultValue={student?.studentDetails?.emergencyContact?.firstName+' '+student?.studentDetails?.emergencyContact?.lastName}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.studentDetails?.emergencyContact?.contactNumber}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Relationship</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.studentDetails?.emergencyContact?.relationshipWithStudent}
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
              <Input disabled={!isEditing}
                defaultValue={student?.studentDetails?.parentInformation?.father?.firstName+' '+student?.studentDetails?.parentInformation?.father?.lastName}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Mother&apos;s Name</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.studentDetails?.parentInformation?.mother?.firstName+' '+student?.studentDetails?.parentInformation?.mother?.lastName}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Father&apos;s Contact Number</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.studentDetails?.parentInformation?.father?.contactNumber}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Mother&apos;s Contact Number</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.studentDetails?.parentInformation?.mother?.contactNumber}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Father&apos;s Email</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.studentDetails?.parentInformation?.father?.email}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Mother&apos;s Email</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.studentDetails?.parentInformation?.mother?.email}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Father&apos;s Occupation</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.studentDetails?.parentInformation?.father?.occupation}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Mother&apos;s Occupation</Label>
              <Input disabled={!isEditing}
                defaultValue={student?.studentDetails?.parentInformation?.mother?.occupation}
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
              {student?.studentDetails?.financialInformation?.isFinanciallyIndependent === false ? 
                <Label className="flex gap-2 items-center"><CircleMinus className="w-3 h-3 text-[#FF791F] " />Financially dependent on Parents</Label> : 
                <Label className="flex gap-2 items-center"><CircleCheckBig className="w-3 h-3 text-[#2EB88A] " />Financially Independent</Label>
              }
            </div>
            <div className="">
              {student?.studentDetails?.financialInformation?.hasAppliedForFinancialAid === true ? 
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