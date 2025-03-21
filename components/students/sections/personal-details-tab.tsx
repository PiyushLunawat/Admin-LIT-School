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
import { getCurrentStudents, updateStudentData } from "@/app/api/student";
import { getCentres } from "@/app/api/centres";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface PersonalDetailsTabProps {
  student: any;
  onApplicationUpdate: () => void;
}

export function PersonalDetailsTab({ student, onApplicationUpdate }: PersonalDetailsTabProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCentre, setSelectedCentre] = useState("");

    const latestCohort = student?.appliedCohorts?.[student?.appliedCohorts.length - 1];
    const applicationDetails = latestCohort?.applicationDetails;
    const studentDetail = applicationDetails?.studentDetails;
    const [formData, setFormData] = useState<any>();

    useEffect(() => {
      setFormData({
        studentDetailsId: studentDetail?._id,
        studenDetails: {
          currentAddress: {
            streetAddress: studentDetail?.currentAddress?.streetAddress || "",
            city: studentDetail?.currentAddress?.city || "",
            state: studentDetail?.currentAddress?.state || "",
            postalCode: studentDetail?.currentAddress?.postalCode || "",
          },
          previousEducation: {
            highestLevelOfEducation: studentDetail?.previousEducation?.highestLevelOfEducation || "",
            fieldOfStudy: studentDetail?.previousEducation?.fieldOfStudy || "",
            nameOfInstitution: studentDetail?.previousEducation?.nameOfInstitution || "",
            yearOfGraduation: studentDetail?.previousEducation?.yearOfGraduation || "",
          },
          workExperience: {
            isExperienced: studentDetail?.workExperience?.isExperienced || false,
            experienceType: studentDetail?.workExperience?.experienceType || "",
            nameOfCompany: studentDetail?.workExperience?.nameOfCompany || "",
            duration: studentDetail?.workExperience?.duration || "",
            jobDescription: studentDetail?.workExperience?.jobDescription || "",
          },
          emergencyContact: {
            firstName: studentDetail?.emergencyContact?.firstName || "",
            lastName: studentDetail?.emergencyContact?.lastName || "",
            contactNumber: studentDetail?.emergencyContact?.contactNumber || "",
            relationshipWithStudent: studentDetail?.emergencyContact?.relationshipWithStudent || "",
          },
          parentInformation: {
            father: {
              firstName: studentDetail?.parentInformation?.father?.firstName || "",
              lastName: studentDetail?.parentInformation?.father?.lastName || "",
              contactNumber: studentDetail?.parentInformation?.father?.contactNumber || "",
              occupation: studentDetail?.parentInformation?.father?.occupation || "",
              email: studentDetail?.parentInformation?.father?.email || "",
            },
            mother: {
              firstName: studentDetail?.parentInformation?.mother?.firstName || "",
              lastName: studentDetail?.parentInformation?.mother?.lastName || "",
              contactNumber: studentDetail?.parentInformation?.mother?.contactNumber || "",
              occupation: studentDetail?.parentInformation?.mother?.occupation || "",
              email: studentDetail?.parentInformation?.mother?.email || "",
            },
          },
          financialInformation: {
            isFinanciallyIndependent: studentDetail?.financialInformation?.isFinanciallyIndependent || false,
            hasAppliedForFinancialAid: studentDetail?.financialInformation?.hasAppliedForFinancialAid || false,
          },
        },
      });
    }, [student]);
  
    // Fetch centre details on mount.
    useEffect(() => {
      async function fetchData() {
        try {
          const centresData = await getCentres();
          const center = centresData.data.find(
            (c: any) => c._id === student?.appliedCohorts?.[student?.appliedCohorts.length - 1]?.cohortId?.centerDetail
          );
          console.log("logg",center?.name);
          
          setSelectedCentre(center?.name || "--");
        } catch (error) {
          console.error("Error fetching centres:", error);
        }
      }
      fetchData();
    }, [student]);
  
    // Helper function to format dates (for cohort display).
    function formatDateToMonthYear(dateString: string): string {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "";
      }
      return format(date, "MMMM, yyyy");
    }
  
    // Update function for fields inside "studenDetails".
    const handleStudentDetailsChange = (
      section: string,
      field: string,
      value: any,
      subSection?: string
    ) => {
      if (subSection) {
        setFormData((prev: any) => ({
          ...prev,
          studenDetails: {
            ...prev.studenDetails,
            [section]: {
              ...prev.studenDetails[section],
              [subSection]: {
                ...prev.studenDetails[section][subSection],
                [field]: value,
              },
            },
          },
        }));
      } else {
        setFormData((prev: any) => ({
          ...prev,
          studenDetails: {
            ...prev.studenDetails,
            [section]: {
              ...prev.studenDetails[section],
              [field]: value,
            },
          },
        }));
      }
    };
  
    // Save handler.
    const handleSave = async () => {
      try {
        setLoading(true)
        const response = await updateStudentData(formData);
        console.log("Student updated successfully:", response);
        toast({
          title: "Details Updated",
          description: "Your changes have been saved.",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Update Failed",
          description: "An unexpected error occurred.",
          variant: "warning",
        });
        console.error("Error updating student details:", error);
      } finally {
        setLoading(false)
        setIsEditing(false);
      }
    };
  
    if (!latestCohort || !applicationDetails || !studentDetail) {
      return <div>No student details available</div>;
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
            onClick={() => {
              isEditing ? handleSave() : setIsEditing(true);
            }}
          >
            {isEditing ? (
              <Save className="h-4 w-4 mr-2" />
            ) : (
              <Edit className="h-4 w-4 mr-2" />
            )}
            {isEditing ? loading ? "Saving..." : "Save Changes" : "Edit Details"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="pl-3">Full Name</Label>
              <Input
                defaultValue={(student?.firstName + " " + student?.lastName) || "--"}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Date of Birth</Label>
              <Input
                type="date"
                defaultValue={
                  student?.dateOfBirth
                    ? format(new Date(student.dateOfBirth), "yyyy-MM-dd")
                    : ""
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Gender</Label>
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
              <Label className="pl-3" >Current Status</Label>
              <Select disabled={!isEditing} value={student?.qualification}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Highschool Graduate">Highschool Graduate</SelectItem>
                  <SelectItem value="College Graduate">College Graduate</SelectItem>
                  <SelectItem value="Working Professional">Working Professional</SelectItem>
                  <SelectItem value="Freelancer">Freelancer</SelectItem>
                  <SelectItem value="Business Owner">Business Owner</SelectItem>
                  <SelectItem value="Consultant">Consultant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Program of Interest</Label>
              <Input defaultValue={student?.appliedCohorts?.[student?.appliedCohorts.length - 1]?.cohortId?.programDetail?.name} disabled />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Cohort</Label>
              <Input
                value={
                  formatDateToMonthYear(student?.appliedCohorts?.[student?.appliedCohorts.length - 1]?.cohortId?.startDate) +
                  " " +
                  student?.appliedCohorts?.[student?.appliedCohorts.length - 1]?.cohortId?.timeSlot +
                  ", " +
                  selectedCentre
                }
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information (non-editable) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="pl-3">Email Address</Label>
              <Input type="email" defaultValue={student?.email} disabled />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Phone Number</Label>
              <Input defaultValue={student?.mobileNumber} disabled />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">LinkedIn Profile</Label>
              <Input placeholder="--" defaultValue={student?.linkedInUrl} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Instagram Profile</Label>
              <Input placeholder="--" defaultValue={student?.instagramUrl} disabled={!isEditing} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Address */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Current Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="pl-3">Street Address</Label>
              <Input
                value={formData?.studenDetails?.currentAddress.streetAddress}
                onChange={(e) =>
                  handleStudentDetailsChange("currentAddress", "streetAddress", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">City</Label>
              <Input
                value={formData?.studenDetails?.currentAddress.city}
                onChange={(e) =>
                  handleStudentDetailsChange("currentAddress", "city", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">State</Label>
              <Input
                value={formData?.studenDetails?.currentAddress.state}
                onChange={(e) =>
                  handleStudentDetailsChange("currentAddress", "state", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Postal Code</Label>
              <Input
                value={formData?.studenDetails?.currentAddress.postalCode}
                onChange={(e) =>
                  handleStudentDetailsChange("currentAddress", "postalCode", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Previous Education */}
      <Card>
        <CardHeader>
          <CardTitle>Previous Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="pl-3">Highest Level of Education Attained</Label>
              <Select disabled={!isEditing} value={formData?.studenDetails?.previousEducation?.highestLevelOfEducation}
              // onChange={(e) =>
              //   handleStudentDetailsChange(
              //     "previousEducation",
              //     "highestLevelOfEducation",
              //     e.target.value
              //   )
              // }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="highschool">High School</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Field of Study</Label>
              <Input
                value={formData?.studenDetails?.previousEducation?.fieldOfStudy}
                onChange={(e) =>
                  handleStudentDetailsChange("previousEducation", "fieldOfStudy", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Name of Institution</Label>
              <Input
                value={formData?.studenDetails?.previousEducation?.nameOfInstitution}
                onChange={(e) =>
                  handleStudentDetailsChange("previousEducation", "nameOfInstitution", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Year of Graduation</Label>
              <Input
                value={formData?.studenDetails?.previousEducation?.yearOfGraduation}
                onChange={(e) =>
                  handleStudentDetailsChange("previousEducation", "yearOfGraduation", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>
          </div>
          {formData?.studenDetails?.workExperience?.isExperienced && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="pl-3">Experience Type</Label>
                <Select disabled={!isEditing} value={formData?.studenDetails?.workExperience?.experienceType}
                // onChange={(e) =>
                //   handleStudentDetailsChange("workExperience", "experienceType", e.target.value)
                // }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Working Professional">Employee</SelectItem>
                    <SelectItem value="Freelancer">Freelancer</SelectItem>
                    <SelectItem value="Business Owner">Business Owner</SelectItem>
                    <SelectItem value="Consultant">Consultant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="pl-3">Job Description</Label>
                <Input
                  value={formData?.studenDetails?.workExperience?.jobDescription}
                  onChange={(e) =>
                    handleStudentDetailsChange("workExperience", "jobDescription", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
              {formData?.studenDetails?.workExperience?.nameOfCompany &&
                <div className="space-y-2">
                  <Label className="pl-3">Name of Company</Label>
                  <Input
                    value={formData?.studenDetails?.workExperience?.nameOfCompany}
                    onChange={(e) =>
                      handleStudentDetailsChange("workExperience", "nameOfCompany", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              }
              {formData?.studenDetails?.workExperience?.duration &&
                <div className="space-y-2">
                  <Label className="pl-3">Apx Duration of Work</Label>
                  <Input
                    value={formData?.studenDetails?.workExperience?.duration}
                    onChange={(e) =>
                      handleStudentDetailsChange("workExperience", "duration", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              }
            </div>
          )}
          </CardContent>
        </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
          {isEditing ?
            <>
              <div className="space-y-2">
                <Label className="pl-3">First Name</Label>
                <Input
                  value={formData?.studenDetails?.emergencyContact?.firstName}
                  onChange={(e) =>
                    handleStudentDetailsChange("emergencyContact", "firstName", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label className="pl-3">Last Name</Label>
                <Input
                  value={formData?.studenDetails?.emergencyContact?.lastName}
                  onChange={(e) =>
                    handleStudentDetailsChange("emergencyContact", "lastName", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
            </> : 
            formData?.studenDetails?.emergencyContact?.firstName && formData?.studenDetails?.emergencyContact?.lastName && (
            <div className="space-y-2">
              <Label className="pl-3">Contact&apos;s Name</Label>
              <Input
                defaultValue={formData?.studenDetails?.emergencyContact?.firstName + ' ' + formData?.studenDetails?.emergencyContact?.lastName}
                disabled
              />
            </div>)
            }
            <div className="space-y-2">
              <Label className="pl-3">Contact&apos;s Number</Label>
              <Input
                value={formData?.studenDetails?.emergencyContact?.contactNumber}
                onChange={(e) =>
                  handleStudentDetailsChange("emergencyContact", "contactNumber", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Relationship</Label>
              <Input
                value={formData?.studenDetails?.emergencyContact?.relationshipWithStudent}
                onChange={(e) =>
                  handleStudentDetailsChange("emergencyContact", "relationshipWithStudent", e.target.value)
                }
                disabled={!isEditing}
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
            {/* Father's Information */}
            {isEditing ?
            <>
              <div className="space-y-2">
                <Label className="pl-3">Father&apos;s First Name</Label>
                <Input
                  value={formData?.studenDetails?.parentInformation?.father?.firstName}
                  onChange={(e) =>
                    handleStudentDetailsChange("parentInformation", "firstName", e.target.value, "father")
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label className="pl-3">Father&apos;s Last Name</Label>
                <Input
                  value={formData?.studenDetails?.parentInformation?.father?.lastName}
                  onChange={(e) =>
                    handleStudentDetailsChange("parentInformation", "lastName", e.target.value, "father")
                  }
                  disabled={!isEditing}
                />
              </div>
            </> : 
            formData?.studenDetails?.parentInformation.father?.firstName && formData?.studenDetails?.parentInformation.father?.lastName && (
              <div className="space-y-2">
                <Label className="pl-3">Father&apos;s Name</Label>
                <Input
                  defaultValue={formData?.studenDetails?.parentInformation.father?.firstName + ' ' + formData?.studenDetails?.parentInformation.father?.lastName}
                  disabled
                />
              </div>
            )}
            {isEditing ? 
              <>
                <div className="space-y-2">
                  <Label className="pl-3">Mother&apos;s First Name</Label>
                  <Input
                    value={formData?.studenDetails?.parentInformation?.mother?.firstName}
                    onChange={(e) =>
                      handleStudentDetailsChange("parentInformation", "firstName", e.target.value, "mother")
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="pl-3">Mother&apos;s Last Name</Label>
                  <Input
                    value={formData?.studenDetails?.parentInformation?.mother?.lastName}
                    onChange={(e) =>
                      handleStudentDetailsChange("parentInformation", "lastName", e.target.value, "mother")
                    }
                    disabled={!isEditing}
                  />
                </div>
              </> : 
              formData?.studenDetails?.parentInformation.mother?.firstName && formData?.studenDetails?.parentInformation.mother?.lastName && (
                <div className="space-y-2">
                  <Label className="pl-3">Mother&apos;s Name</Label>
                  <Input
                    defaultValue={formData?.studenDetails?.parentInformation.mother?.firstName + ' ' + formData?.studenDetails?.parentInformation.mother?.lastName}
                    disabled
                  />
                </div>
              )}
              {(isEditing || formData?.studenDetails?.parentInformation?.father?.contactNumber) &&
                <div className="space-y-2">
                  <Label className="pl-3">Father&apos;s Contact Number</Label>
                  <Input
                    value={formData?.studenDetails?.parentInformation?.father?.contactNumber}
                    onChange={(e) =>
                      handleStudentDetailsChange("parentInformation", "contactNumber", e.target.value, "father")
                    }
                    disabled={!isEditing}
                  />
                </div>
              }
              {(isEditing || formData?.studenDetails?.parentInformation?.mother?.contactNumber) &&
                <div className="space-y-2">
                  <Label className="pl-3">Mother&apos;s Contact Number</Label>
                  <Input
                    value={formData?.studenDetails?.parentInformation?.mother?.contactNumber}
                    onChange={(e) =>
                      handleStudentDetailsChange("parentInformation", "contactNumber", e.target.value, "mother")
                    }
                    disabled={!isEditing}
                  />
                </div>
              }
              {(isEditing || formData?.studenDetails?.parentInformation?.father?.email) &&
                <div className="space-y-2">
                  <Label className="pl-3">Father&apos;s Email</Label>
                  <Input
                    value={formData?.studenDetails?.parentInformation?.father?.email}
                    onChange={(e) =>
                      handleStudentDetailsChange("parentInformation", "email", e.target.value, "father")
                    }
                    disabled={!isEditing}
                  />
                </div>
              }
              {(isEditing || formData?.studenDetails?.parentInformation?.mother?.email) &&
                <div className="space-y-2">
                  <Label className="pl-3">Mother&apos;s Email</Label>
                  <Input
                    value={formData?.studenDetails?.parentInformation?.mother?.email}
                    onChange={(e) =>
                      handleStudentDetailsChange("parentInformation", "email", e.target.value, "mother")
                    }
                    disabled={!isEditing}
                  />
                </div>
              }
              {(isEditing || formData?.studenDetails?.parentInformation?.father?.occupation) &&
                <div className="space-y-2">
                  <Label className="pl-3">Father&apos;s Occupation</Label>
                  <Input
                    value={formData?.studenDetails?.parentInformation?.father?.occupation}
                    onChange={(e) =>
                      handleStudentDetailsChange("parentInformation", "occupation", e.target.value, "father")
                    }
                    disabled={!isEditing}
                  />
                </div>
              }
              {(isEditing || formData?.studenDetails?.parentInformation?.mother?.occupation) &&
              <div className="space-y-2">
                  <Label className="pl-3">Mother&apos;s Occupation</Label>
                  <Input
                    value={formData?.studenDetails?.parentInformation?.mother?.occupation}
                    onChange={(e) =>
                      handleStudentDetailsChange("parentInformation", "occupation", e.target.value, "mother")
                    }
                    disabled={!isEditing}
                  />
                </div>
              }
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
            <div>
              {formData?.studenDetails?.financialInformation?.isFinanciallyIndependent ? (
                <Label className="pl-3 flex gap-2 items-center">
                  <CircleCheckBig className="w-3 h-3 text-[#2EB88A]" />
                  Financially independent
                </Label>
              ) : (
                <Label className="pl-3 flex gap-2 items-center">
                  <CircleMinus className="w-3 h-3 text-[#FF791F]" />
                  Financially dependent on Parents
                </Label>
              )}
            </div>
            <div>
              {formData?.studenDetails?.financialInformation?.hasAppliedForFinancialAid ? (
                <Label className="pl-3 flex gap-2 items-center">
                  <CircleCheckBig className="w-3 h-3 text-[#2EB88A]" />
                  Has tried applying for financial aid earlier
                </Label>
              ) : (
                <Label className="pl-3 flex gap-2 items-center">
                  <CircleMinus className="w-3 h-3 text-[#FF791F]" />
                  Has not tried applying for any financial aid earlier
                </Label>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}