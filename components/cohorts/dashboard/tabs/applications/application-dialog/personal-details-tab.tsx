"use client";

import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { format } from "date-fns";
import {
  AlertCircle,
  Camera,
  CircleCheckBig,
  CircleMinus,
  Edit,
  LoaderCircle,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { uploadDirect } from "@/app/api/aws";
import { getCentres } from "@/app/api/centres";
import { updateStudentData } from "@/app/api/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { generateUniqueFileName } from "@/lib/utils/helpers";
import { PersonalDetailsTabProps } from "@/types/components/cohorts/dashboard/tabs/applications/application-dialog/personal-details-tab";
import Image from "next/image";

interface UploadState {
  uploading: boolean;
  uploadProgress: number;
  fileName: string;
  error: string;
}

export function PersonalDetailsTab({
  student,
  onUpdateStatus,
}: PersonalDetailsTabProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCentre, setSelectedCentre] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [uploadStates, setUploadStates] = useState<{
    profilePic?: UploadState;
  }>({});

  const latestCohort =
    student?.appliedCohorts?.[student?.appliedCohorts.length - 1];
  const applicationDetails = latestCohort?.applicationDetails;
  const studentDetail = applicationDetails?.studentDetails;

  const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
    },
  });

  // Initialize formData with the new structure.
  const [formData, setFormData] = useState({
    studentDetailId: studentDetail?._id,
    studentId: student?._id,

    studentData: {
      linkedInUrl: student?.linkedInUrl ?? "",
      instagramUrl: student?.instagramUrl ?? "",
      profileUrl: student?.profileUrl ?? "",
    },

    studentDetailData: {
      currentAddress: {
        streetAddress: studentDetail?.currentAddress?.streetAddress || "",
        city: studentDetail?.currentAddress?.city || "",
        state: studentDetail?.currentAddress?.state || "",
        postalCode: studentDetail?.currentAddress?.postalCode || "",
      },
      previousEducation: {
        highestLevelOfEducation:
          studentDetail?.previousEducation?.highestLevelOfEducation || "",
        fieldOfStudy: studentDetail?.previousEducation?.fieldOfStudy || "",
        nameOfInstitution:
          studentDetail?.previousEducation?.nameOfInstitution || "",
        yearOfGraduation:
          studentDetail?.previousEducation?.yearOfGraduation || "",
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
        relationshipWithStudent:
          studentDetail?.emergencyContact?.relationshipWithStudent || "",
      },
      parentInformation: {
        father: {
          firstName: studentDetail?.parentInformation?.father?.firstName || "",
          lastName: studentDetail?.parentInformation?.father?.lastName || "",
          contactNumber:
            studentDetail?.parentInformation?.father?.contactNumber || "",
          occupation:
            studentDetail?.parentInformation?.father?.occupation || "",
          email: studentDetail?.parentInformation?.father?.email || "",
        },
        mother: {
          firstName: studentDetail?.parentInformation?.mother?.firstName || "",
          lastName: studentDetail?.parentInformation?.mother?.lastName || "",
          contactNumber:
            studentDetail?.parentInformation?.mother?.contactNumber || "",
          occupation:
            studentDetail?.parentInformation?.mother?.occupation || "",
          email: studentDetail?.parentInformation?.mother?.email || "",
        },
      },
      financialInformation: {
        hasAppliedForFinancialAid:
          studentDetail?.financialInformation?.hasAppliedForFinancialAid ||
          false,
        annualFamilyIncome:
          studentDetail?.financialInformation?.annualFamilyIncome || "",
        cibilScore: studentDetail?.financialInformation?.cibilScore || 0,
        loanApplicant: studentDetail?.financialInformation?.loanApplicant || "",
        loanType: studentDetail?.financialInformation?.loanType || "",
        requestedLoanAmount:
          studentDetail?.financialInformation?.requestedLoanAmount || 0,
      },
    },
  });

  // Fetch centre details on mount.
  useEffect(() => {
    async function fetchData() {
      try {
        const centresData = await getCentres();
        const center = centresData.data.find(
          (c: any) =>
            c._id ===
            student?.appliedCohorts?.[student?.appliedCohorts.length - 1]
              ?.cohortId?.centerDetail
        );
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

  // Update function for fields inside "studentDetailData".
  const handleStudentDetailsChange = (
    section: string,
    field: string,
    value: any,
    subSection?: string
  ) => {
    if (section === "studentData") {
      // Update top-level studentData fields like instagramUrl, linkedInUrl
      setFormData((prev: any) => ({
        ...prev,
        studentData: {
          ...prev.studentData,
          [field]: value,
        },
      }));
      return;
    }

    if (subSection) {
      // For nested items, e.g. father/mother
      setFormData((prev: any) => ({
        ...prev,
        studentDetailData: {
          ...prev.studentDetailData,
          [section]: {
            ...prev.studentDetailData[section],
            [subSection]: {
              ...prev.studentDetailData[section][subSection],
              [field]: value,
            },
          },
        },
      }));
    } else {
      // For direct keys in studentDetailData
      setFormData((prev: any) => ({
        ...prev,
        studentDetailData: {
          ...prev.studentDetailData,
          [section]: {
            ...prev.studentDetailData[section],
            [field]: value,
          },
        },
      }));
    }
  };

  // Save handler.
  const handleSave = async () => {
    try {
      setLoading(true);
      // console.log("Student payload:", formData);

      const response = await updateStudentData(formData);
      onUpdateStatus();
      // console.log("Student updated successfully:", response);
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
      setLoading(false);
      setIsEditing(false);
    }
  };

  const handleDeleteFile = async (fileKey: string, index?: number) => {
    try {
      if (!fileKey) {
        console.error("Invalid file URL:", fileKey);
        return;
      }
      // console.log("file URL:", fileKey);

      // AWS S3 DeleteObject Command
      const deleteCommand = new DeleteObjectCommand({
        Bucket: "dev-application-portal", // Replace with your bucket name
        Key: fileKey, // Key extracted from file URL
      });

      await s3Client.send(deleteCommand);
      console.log("File deleted successfully from S3:", fileKey);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    if (fileInputRef.current && isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setUploadStates((prev) => ({
          ...prev,
          profilePic: {
            ...prev.profilePic!,
            error: "Image size exceeds 5 MB",
          },
        }));
        return;
      }
      const fileKey = generateUniqueFileName(file.name, "student_profile_pic");

      try {
        setUploadStates((prev) => ({
          ...prev,
          profilePic: {
            uploading: true,
            uploadProgress: 0,
            fileName: file.name,
            error: "",
          },
        }));
        const fileUrl = await uploadDirect({
          file,
          fileKey,
          onProgress: (percentComplete) => {
            setUploadStates((prev) => ({
              ...prev,
              profilePic: {
                ...prev.profilePic!,
                uploadProgress: Math.min(percentComplete, 100),
              },
            }));
          },
        });

        setProfileUrl(fileUrl);
        setFormData((prev: any) => ({
          ...prev,
          studentData: {
            ...prev.studentData,
            profileUrl: fileUrl,
          },
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
        // alert("An error occurred while uploading the image.");
      } finally {
        setUploadStates((prev) => ({
          ...prev,
          profilePic: {
            ...prev.profilePic!,
            uploading: false,
          },
        }));
      }
    }
  };

  if (!latestCohort || !applicationDetails || !studentDetail) {
    return (
      <div className="text-center text-muted-foreground border-b border-t py-4">
        <div className="flex justify-center items-center animate-pulse h-full">
          No student details available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Information (non-editable fields) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Personal Details</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            disabled={loading || latestCohort?.status === "dropped"}
            onClick={() => {
              isEditing ? handleSave() : setIsEditing(true);
            }}
          >
            {isEditing ? (
              <Save className="h-4 w-4 mr-2" />
            ) : (
              <Edit className="h-4 w-4 mr-2" />
            )}
            {isEditing
              ? loading
                ? "Saving..."
                : "Save Changes"
              : "Edit Details"}
          </Button>
        </CardHeader>
        <CardContent className="flex flex-wrap flex-col sm:flex-row justify-center px-4 sm:px-6 gap-4">
          <div className="w-full sm:w-[200px] h-[220px] sm:h-full bg-[#1F1F1F] flex flex-col items-center justify-center rounded-xl text-sm space-y-4">
            {uploadStates.profilePic?.uploading ? (
              <label
                htmlFor="passport-input"
                className="w-full h-[220px] flex flex-col items-center justify-center bg-[#09090b] px-6 rounded-xl border border-[#2C2C2C]"
              >
                <div className="text-center my-auto text-muted-foreground">
                  <LoaderCircle className="mx-auto mb-2 w-8 h-8 animate-spin" />
                  <div className="text-wrap">
                    {`Uploading... ${uploadStates.profilePic.uploadProgress}%`}
                  </div>
                </div>
              </label>
            ) : profileUrl || student?.profileUrl ? (
              <div className="w-full h-full relative">
                <Image
                  width={32}
                  height={32}
                  src={`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${
                    profileUrl || student?.profileUrl
                  }`}
                  alt="PROFILE piC"
                  className="w-full h-[220px] object-cover rounded-lg"
                />
                {isEditing && (
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <input
                      ref={fileInputRef}
                      id="passport-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={!isEditing}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 bg-white/[0.2] border border-white rounded-full shadow mix-blend-hard-light hover:bg-white/[0.4]"
                      onClick={handleEditClick}
                      disabled={!isEditing}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 !bg-white/[0.2] border border-white rounded-full shadow mix-blend-hard-light hover:bg-white/[0.4]"
                      onClick={() =>
                        handleDeleteFile(profileUrl || student?.profileUrl)
                      }
                      disabled={!isEditing}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <label
                htmlFor="passport-input"
                className="w-full h-[220px] cursor-pointer flex flex-col items-center justify-center bg-[#1F1F1F] px-6 rounded-xl border-[#2C2C2C]"
              >
                <div
                  className={`text-center my-auto ${
                    uploadStates.profilePic?.error
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {uploadStates.profilePic?.error ? (
                    <AlertCircle className="text-destructive mx-auto mb-2 w-8 h-8" />
                  ) : (
                    <Camera className="mx-auto mb-2 w-8 h-8" />
                  )}
                  <div className="text-wrap">
                    {uploadStates.profilePic?.error
                      ? `${uploadStates.profilePic?.error}`
                      : "Upload a Passport size Image of Yourself. Ensure that your face covers 60% of this picture."}
                  </div>
                </div>
                <input
                  id="passport-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={!isEditing}
                />
              </label>
            )}
          </div>
          <div className="flex flex-col flex-1 gap-4">
            <div className="flex flex-col sm:flex-row flex-1 gap-4">
              <div className="flex flex-col flex-1 gap-2">
                <Label className="pl-3">Full Name</Label>
                <Input
                  defaultValue={
                    student?.firstName + " " + student?.lastName || "--"
                  }
                  disabled
                />
              </div>
              <div className="flex flex-col flex-1 gap-2">
                <Label className="pl-3">Date of Birth</Label>
                <Input
                  type="date"
                  defaultValue={
                    student?.dateOfBirth
                      ? format(new Date(student.dateOfBirth), "yyyy-MM-dd")
                      : ""
                  }
                  disabled
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row flex-1 gap-4">
              <div className="flex flex-col flex-1 gap-2">
                <Label className="pl-3">Gender</Label>
                <Select disabled defaultValue={student?.gender?.toLowerCase()}>
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
              <div className="flex flex-col flex-1 gap-2">
                <Label className="pl-3">Current Status</Label>
                <Select disabled value={latestCohort?.qualification}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Highschool Graduate">
                      Highschool Graduate
                    </SelectItem>
                    <SelectItem value="College Graduate">
                      College Graduate
                    </SelectItem>
                    <SelectItem value="Working Professional">
                      Working Professional
                    </SelectItem>
                    <SelectItem value="Freelancer">Freelancer</SelectItem>
                    <SelectItem value="Business Owner">
                      Business Owner
                    </SelectItem>
                    <SelectItem value="Consultant">Consultant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row flex-1 gap-4">
              <div className="flex flex-col flex-1 gap-2">
                <Label className="pl-3">Program of Interest</Label>
                <Input
                  defaultValue={
                    student?.appliedCohorts?.[
                      student?.appliedCohorts.length - 1
                    ]?.cohortId?.programDetail?.name
                  }
                  disabled
                />
              </div>
              <div className="flex flex-col flex-1 gap-2">
                <Label className="pl-3">Cohort</Label>
                <Input
                  value={
                    formatDateToMonthYear(
                      student?.appliedCohorts?.[
                        student?.appliedCohorts.length - 1
                      ]?.cohortId?.startDate
                    ) +
                    " " +
                    student?.appliedCohorts?.[
                      student?.appliedCohorts.length - 1
                    ]?.cohortId?.timeSlot +
                    ", " +
                    selectedCentre
                  }
                  disabled
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information (non-editable) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
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
              <Input
                placeholder="--"
                value={formData.studentData.linkedInUrl}
                onChange={(e) =>
                  handleStudentDetailsChange(
                    "studentData",
                    "linkedInUrl",
                    e.target.value
                  )
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Instagram Profile</Label>
              <Input
                placeholder="--"
                value={formData.studentData.instagramUrl}
                onChange={(e) =>
                  handleStudentDetailsChange(
                    "studentData",
                    "instagramUrl",
                    e.target.value
                  )
                }
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Address */}
      <Card>
        <CardHeader>
          <CardTitle>Current Address</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
            <div className="space-y-2">
              <Label className="pl-3">Street Address</Label>
              <Input
                value={formData.studentDetailData.currentAddress.streetAddress}
                onChange={(e) =>
                  handleStudentDetailsChange(
                    "currentAddress",
                    "streetAddress",
                    e.target.value
                  )
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">City</Label>
              <Input
                value={formData.studentDetailData.currentAddress.city}
                onChange={(e) =>
                  handleStudentDetailsChange(
                    "currentAddress",
                    "city",
                    e.target.value
                  )
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">State</Label>
              <Input
                value={formData.studentDetailData.currentAddress.state}
                onChange={(e) =>
                  handleStudentDetailsChange(
                    "currentAddress",
                    "state",
                    e.target.value
                  )
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Postal Code</Label>
              <Input
                value={formData.studentDetailData.currentAddress.postalCode}
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/[^0-9]/g, "");
                  handleStudentDetailsChange(
                    "currentAddress",
                    "postalCode",
                    target.value
                  );
                }}
                maxLength={10}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Previous Education */}
      <Card>
        <CardHeader>
          <CardTitle>Previous Education</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
            <div className="space-y-2">
              <Label className="pl-3">
                Highest Level of Education Attained
              </Label>
              <Select
                disabled={!isEditing}
                value={
                  formData.studentDetailData.previousEducation
                    .highestLevelOfEducation
                }
                onValueChange={(val) =>
                  handleStudentDetailsChange(
                    "previousEducation",
                    "highestLevelOfEducation",
                    val
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="highschool">High School</SelectItem>
                  <SelectItem value="bachelor">
                    Bachelor&apos;s Degree
                  </SelectItem>
                  <SelectItem value="master">Master&apos;s Degree</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Field of Study</Label>
              <Input
                value={
                  formData.studentDetailData.previousEducation.fieldOfStudy
                }
                onChange={(e) =>
                  handleStudentDetailsChange(
                    "previousEducation",
                    "fieldOfStudy",
                    e.target.value
                  )
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Name of Institution</Label>
              <Input
                value={
                  formData.studentDetailData.previousEducation.nameOfInstitution
                }
                onChange={(e) =>
                  handleStudentDetailsChange(
                    "previousEducation",
                    "nameOfInstitution",
                    e.target.value
                  )
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Year of Graduation</Label>
              <Input
                value={
                  formData.studentDetailData.previousEducation.yearOfGraduation
                }
                onChange={(e) =>
                  handleStudentDetailsChange(
                    "previousEducation",
                    "yearOfGraduation",
                    e.target.value
                  )
                }
                disabled={!isEditing}
              />
            </div>
          </div>
          {formData.studentDetailData.workExperience.isExperienced && (
            <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
              <div className="space-y-2">
                <Label className="pl-3">Experience Type</Label>
                <Select
                  disabled={!isEditing}
                  value={
                    formData.studentDetailData.workExperience.experienceType
                  }
                  onValueChange={(val) =>
                    handleStudentDetailsChange(
                      "workExperience",
                      "experienceType",
                      val
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Working Professional">
                      Employee
                    </SelectItem>
                    <SelectItem value="Freelancer">Freelancer</SelectItem>
                    <SelectItem value="Business Owner">
                      Business Owner
                    </SelectItem>
                    <SelectItem value="Consultant">Consultant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="pl-3">Job Description</Label>
                <Input
                  value={
                    formData.studentDetailData.workExperience.jobDescription
                  }
                  onChange={(e) =>
                    handleStudentDetailsChange(
                      "workExperience",
                      "jobDescription",
                      e.target.value
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              {formData.studentDetailData.workExperience.nameOfCompany && (
                <div className="space-y-2">
                  <Label className="pl-3">Name of Company</Label>
                  <Input
                    value={
                      formData.studentDetailData.workExperience.nameOfCompany
                    }
                    onChange={(e) =>
                      handleStudentDetailsChange(
                        "workExperience",
                        "nameOfCompany",
                        e.target.value
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>
              )}
              {formData.studentDetailData.workExperience.duration && (
                <div className="space-y-2">
                  <Label className="pl-3">Apx Duration of Work</Label>
                  <Input
                    value={formData.studentDetailData.workExperience.duration}
                    onChange={(e) =>
                      handleStudentDetailsChange(
                        "workExperience",
                        "duration",
                        e.target.value
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label className="pl-3">First Name</Label>
                  <Input
                    value={
                      formData.studentDetailData.emergencyContact.firstName
                    }
                    onChange={(e) =>
                      handleStudentDetailsChange(
                        "emergencyContact",
                        "firstName",
                        e.target.value
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="pl-3">Last Name</Label>
                  <Input
                    value={formData.studentDetailData.emergencyContact.lastName}
                    onChange={(e) =>
                      handleStudentDetailsChange(
                        "emergencyContact",
                        "lastName",
                        e.target.value
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>
              </>
            ) : (
              formData.studentDetailData.emergencyContact?.firstName &&
              formData.studentDetailData.emergencyContact?.lastName && (
                <div className="space-y-2">
                  <Label className="pl-3">Contact&apos;s Name</Label>
                  <Input
                    defaultValue={
                      formData.studentDetailData.emergencyContact?.firstName +
                      " " +
                      formData.studentDetailData.emergencyContact?.lastName
                    }
                    disabled
                  />
                </div>
              )
            )}
            <div className="space-y-2">
              <Label className="pl-3">Contact&apos;s Number</Label>
              <Input
                value={
                  formData.studentDetailData.emergencyContact.contactNumber
                }
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/[^0-9]/g, "");
                  handleStudentDetailsChange(
                    "emergencyContact",
                    "contactNumber",
                    target.value
                  );
                }}
                maxLength={10}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="pl-3">Relationship</Label>
              <Input
                value={
                  formData.studentDetailData.emergencyContact
                    .relationshipWithStudent
                }
                onChange={(e) =>
                  handleStudentDetailsChange(
                    "emergencyContact",
                    "relationshipWithStudent",
                    e.target.value
                  )
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
        <CardContent className="px-4 sm:px-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Father's Information */}
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label className="pl-3">Father&apos;s First Name</Label>
                  <Input
                    value={
                      formData.studentDetailData.parentInformation.father
                        .firstName
                    }
                    onChange={(e) =>
                      handleStudentDetailsChange(
                        "parentInformation",
                        "firstName",
                        e.target.value,
                        "father"
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="pl-3">Father&apos;s Last Name</Label>
                  <Input
                    value={
                      formData.studentDetailData.parentInformation.father
                        .lastName
                    }
                    onChange={(e) =>
                      handleStudentDetailsChange(
                        "parentInformation",
                        "lastName",
                        e.target.value,
                        "father"
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>
              </>
            ) : (
              formData.studentDetailData.parentInformation.father?.firstName &&
              formData.studentDetailData.parentInformation.father?.lastName && (
                <div className="space-y-2">
                  <Label className="pl-3">Father&apos;s Name</Label>
                  <Input
                    defaultValue={
                      formData.studentDetailData.parentInformation.father
                        ?.firstName +
                      " " +
                      formData.studentDetailData.parentInformation.father
                        ?.lastName
                    }
                    disabled
                  />
                </div>
              )
            )}
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label className="pl-3">Mother&apos;s First Name</Label>
                  <Input
                    value={
                      formData.studentDetailData.parentInformation.mother
                        .firstName
                    }
                    onChange={(e) =>
                      handleStudentDetailsChange(
                        "parentInformation",
                        "firstName",
                        e.target.value,
                        "mother"
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="pl-3">Mother&apos;s Last Name</Label>
                  <Input
                    value={
                      formData.studentDetailData.parentInformation.mother
                        .lastName
                    }
                    onChange={(e) =>
                      handleStudentDetailsChange(
                        "parentInformation",
                        "lastName",
                        e.target.value,
                        "mother"
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>
              </>
            ) : (
              formData.studentDetailData.parentInformation.mother?.firstName &&
              formData.studentDetailData.parentInformation.mother?.lastName && (
                <div className="space-y-2">
                  <Label className="pl-3">Mother&apos;s Name</Label>
                  <Input
                    defaultValue={
                      formData.studentDetailData.parentInformation.mother
                        ?.firstName +
                      " " +
                      formData.studentDetailData.parentInformation.mother
                        ?.lastName
                    }
                    disabled
                  />
                </div>
              )
            )}
            {(isEditing ||
              formData.studentDetailData.parentInformation.father
                .contactNumber) && (
              <div className="space-y-2">
                <Label className="pl-3">Father&apos;s Contact Number</Label>
                <Input
                  value={
                    formData.studentDetailData.parentInformation.father
                      .contactNumber
                  }
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/[^0-9]/g, "");
                    handleStudentDetailsChange(
                      "parentInformation",
                      "contactNumber",
                      target.value,
                      "father"
                    );
                  }}
                  maxLength={10}
                  disabled={!isEditing}
                />
              </div>
            )}
            {(isEditing ||
              formData.studentDetailData.parentInformation.mother
                .contactNumber) && (
              <div className="space-y-2">
                <Label className="pl-3">Mother&apos;s Contact Number</Label>
                <Input
                  value={
                    formData.studentDetailData.parentInformation.mother
                      .contactNumber
                  }
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/[^0-9]/g, "");
                    handleStudentDetailsChange(
                      "parentInformation",
                      "contactNumber",
                      target.value,
                      "mother"
                    );
                  }}
                  maxLength={10}
                  disabled={!isEditing}
                />
              </div>
            )}
            {(isEditing ||
              formData.studentDetailData.parentInformation.father.email) && (
              <div className="space-y-2">
                <Label className="pl-3">Father&apos;s Email</Label>
                <Input
                  value={
                    formData.studentDetailData.parentInformation.father.email
                  }
                  onChange={(e) =>
                    handleStudentDetailsChange(
                      "parentInformation",
                      "email",
                      e.target.value,
                      "father"
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
            )}
            {(isEditing ||
              formData.studentDetailData.parentInformation.mother.email) && (
              <div className="space-y-2">
                <Label className="pl-3">Mother&apos;s Email</Label>
                <Input
                  value={
                    formData.studentDetailData.parentInformation.mother.email
                  }
                  onChange={(e) =>
                    handleStudentDetailsChange(
                      "parentInformation",
                      "email",
                      e.target.value,
                      "mother"
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
            )}
            {(isEditing ||
              formData.studentDetailData.parentInformation.father
                .occupation) && (
              <div className="space-y-2">
                <Label className="pl-3">Father&apos;s Occupation</Label>
                <Input
                  value={
                    formData.studentDetailData.parentInformation.father
                      .occupation
                  }
                  onChange={(e) =>
                    handleStudentDetailsChange(
                      "parentInformation",
                      "occupation",
                      e.target.value,
                      "father"
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
            )}
            {(isEditing ||
              formData.studentDetailData.parentInformation.mother
                .occupation) && (
              <div className="space-y-2">
                <Label className="pl-3">Mother&apos;s Occupation</Label>
                <Input
                  value={
                    formData.studentDetailData.parentInformation.mother
                      .occupation
                  }
                  onChange={(e) =>
                    handleStudentDetailsChange(
                      "parentInformation",
                      "occupation",
                      e.target.value,
                      "mother"
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 space-y-4">
          <div className="mb-6">
            {formData.studentDetailData.financialInformation
              .hasAppliedForFinancialAid ? (
              <Label className="sm:pl-3 flex gap-2 items-center">
                <CircleCheckBig className="w-3 h-3 text-[#2EB88A]" />
                Has tried applying for financial aid earlier
              </Label>
            ) : (
              <Label className="sm:pl-3 flex gap-2 items-center">
                <CircleMinus className="w-3 h-3 text-[#FF791F]" />
                Has not tried applying for any financial aid earlier
              </Label>
            )}
          </div>

          {formData.studentDetailData.financialInformation
            .hasAppliedForFinancialAid && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="pl-3">Loan Applicant</Label>
                <Select
                  disabled={!isEditing}
                  value={
                    formData.studentDetailData.financialInformation
                      .loanApplicant
                  }
                  onValueChange={(val) =>
                    handleStudentDetailsChange(
                      "financialInformation",
                      "loanApplicant",
                      val
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">Father</SelectItem>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="pl-3">Loan Type</Label>
                <Select
                  disabled={!isEditing}
                  value={
                    formData.studentDetailData.financialInformation.loanType
                  }
                  onValueChange={(val) =>
                    handleStudentDetailsChange(
                      "financialInformation",
                      "loanType",
                      val
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home Loan</SelectItem>
                    <SelectItem value="gold">Gold Loan</SelectItem>
                    <SelectItem value="vehicle">Vehicle Loan</SelectItem>
                    <SelectItem value="personal">Personal Loan</SelectItem>
                    <SelectItem value="short-term business">
                      Short-term Business Loan
                    </SelectItem>
                    <SelectItem value="education">Education Loan</SelectItem>
                    <SelectItem value="other">other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="pl-3">Requested Loan Amount</Label>
                <Input
                  value={
                    formData.studentDetailData.financialInformation
                      .requestedLoanAmount
                  }
                  maxLength={12}
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/[^0-9]/g, "");
                    handleStudentDetailsChange(
                      "financialInformation",
                      "requestedLoanAmount",
                      target.value
                    );
                  }}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label className="pl-3">CIBIL Score</Label>
                <Input
                  value={
                    formData.studentDetailData.financialInformation.cibilScore
                  }
                  maxLength={3}
                  minLength={3}
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/[^0-9]/g, "");
                    handleStudentDetailsChange(
                      "financialInformation",
                      "cibilScore",
                      target.value
                    );
                  }}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label className="pl-3">Annual Family Income</Label>
                <Select
                  disabled={!isEditing}
                  value={
                    formData.studentDetailData.financialInformation
                      .annualFamilyIncome
                  }
                  onValueChange={(val) =>
                    handleStudentDetailsChange(
                      "financialInformation",
                      "annualFamilyIncome",
                      val
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="below5L">Below 5L</SelectItem>
                    <SelectItem value="5-10L">5-10L</SelectItem>
                    <SelectItem value="10-25L">10-25L</SelectItem>
                    <SelectItem value="25-50L">25-50L</SelectItem>
                    <SelectItem value="50-75L">50-75L</SelectItem>
                    <SelectItem value="75-100L">75L–1Cr</SelectItem>
                    <SelectItem value="above1Cr">Above 1 Cr.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
