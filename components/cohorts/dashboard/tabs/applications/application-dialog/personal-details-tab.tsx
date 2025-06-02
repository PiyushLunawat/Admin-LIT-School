"use client";

import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { format } from "date-fns";
import {
  Camera,
  CircleCheckBig,
  CircleMinus,
  Edit,
  PencilIcon,
  Save,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

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
import { UploadState } from "@/types/components/cohorts/dashboard/tabs/applications/application-dialog/document-tab";
import { PersonalDetailsTabProps } from "@/types/components/cohorts/dashboard/tabs/applications/application-dialog/personal-details-tab";
import axios from "axios";
import Image from "next/image";

export function PersonalDetailsTab({
  student,
  onUpdateStatus,
}: PersonalDetailsTabProps) {
  console.log("first @ cohorts/dashboard/tabs");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCentre, setSelectedCentre] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [uploadStates, setUploadStates] = useState<{
    [docId: string]: UploadState;
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
        isFinanciallyIndependent:
          studentDetail?.financialInformation?.isFinanciallyIndependent ||
          false,
        hasAppliedForFinancialAid:
          studentDetail?.financialInformation?.hasAppliedForFinancialAid ||
          false,
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
      console.log("Student updated successfully:", formData);

      const response = await updateStudentData(formData);
      onUpdateStatus();
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
      setLoading(false);
      setIsEditing(false);
    }
  };

  const generateUniqueFileName = (originalName: string) => {
    const timestamp = Date.now();
    const sanitizedName = originalName.replace(/\s+/g, "-");
    return `${timestamp}-${sanitizedName}`;
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setLoading(true);
      const fileKey = generateUniqueFileName(file.name);

      try {
        const formData = new FormData();
        formData.append("profileImage", file);
        const fileUrl = await uploadDirect(file, fileKey);
        console.log("fileUrl", fileUrl);
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
        setLoading(false);
      }
    }
  };

  const uploadDirect = async (file: File, fileKey: string) => {
    const { data } = await axios.post(
      `https://dev.apply.litschool.in/student/generate-presigned-url`,
      {
        bucketName: "dev-application-portal",
        key: fileKey,
      }
    );
    const { url } = data;
    await axios.put(url, file, {
      headers: { "Content-Type": file.type },
      onUploadProgress: (evt: any) => {
        if (!evt.total) return;
        const percentComplete = Math.round((evt.loaded / evt.total) * 100);
        setUploadStates((prev) => ({
          ...prev,
          // [docId]: {
          //   ...prev[docId],
          //   uploadProgress: Math.min(percentComplete, 100),
          // },
        }));
      },
    });
    return `${url.split("?")[0]}`;
  };

  const handleDeleteImage = async () => {
    try {
      setLoading(true);

      // Get the current image URL to extract the file key
      const currentImageUrl = profileUrl || student?.profileUrl;
      if (currentImageUrl) {
        // Extract file key from URL (assuming URL format is https://bucket.s3.region.amazonaws.com/fileKey)
        const urlParts = currentImageUrl.split("/");
        const fileKey = urlParts[urlParts.length - 1].split("?")[0]; // Remove query parameters if any

        // Delete from S3
        await handleDeleteFile(fileKey);
      }

      // Clear the profile URL from state and form data
      setProfileUrl("");
      setFormData((prev: any) => ({
        ...prev,
        studentData: {
          ...prev.studentData,
          profileUrl: "",
        },
      }));

      toast({
        title: "Image Deleted",
        description: "Profile image has been removed successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the profile image.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Also update your handleDeleteFile function to be more robust
  const handleDeleteFile = async (fileKey: string) => {
    try {
      if (!fileKey) {
        console.error("Invalid file key:", fileKey);
        return;
      }

      // AWS S3 DeleteObject Command
      const deleteCommand = new DeleteObjectCommand({
        Bucket: "dev-application-portal", // Replace with your bucket name
        Key: fileKey, // Key extracted from file URL
      });

      await s3Client.send(deleteCommand);
      console.log("File deleted successfully from S3:", fileKey);
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      throw error; // Re-throw to handle in calling function
    }
  };

  if (!latestCohort || !applicationDetails || !studentDetail) {
    return <div>No student details available</div>;
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
          <div className="w-full sm:w-[200px] h-[285px] sm:h-full bg-[#1F1F1F] flex flex-col items-center justify-center rounded-xl text-sm space-y-4">
            {profileUrl || student?.profileUrl ? (
              <div className="w-full h-full relative">
                {isEditing && (
                  <>
                    {/* Edit Button */}
                    <div className="absolute top-3 right-12 z-10">
                      <label htmlFor="passport-input-edit">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 bg-white/[0.2] border border-white rounded-full shadow hover:bg-white/[0.4]"
                          asChild
                          onClick={() => handleImageChange}
                        >
                          <PencilIcon className="w-2 h-2 cursor-pointer" />
                        </Button>
                      </label>
                      <input
                        id="passport-input-edit"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>

                    {/* Delete Button */}
                    <div className="absolute top-3 right-2 z-10">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 bg-white/[0.2] border border-white rounded-full shadow hover:bg-white/[0.4]"
                        onClick={handleDeleteImage}
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}

                <Image
                  width={32}
                  height={32}
                  src={profileUrl || student?.profileUrl}
                  alt="profile image"
                  className="w-full h-[250px] object-cover rounded-lg"
                />
              </div>
            ) : (
              <label
                htmlFor="passport-input"
                className="w-full h-[250px] cursor-pointer flex flex-col items-center justify-center bg-[#1F1F1F] px-6 rounded-xl border-[#2C2C2C]"
              >
                <div className="text-center my-auto text-muted-foreground">
                  <Camera className="mx-auto mb-2 w-8 h-8" />
                  <div className="text-wrap">
                    {loading
                      ? "Uploading your Profile Image..."
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
            <div className="flex flex-1 gap-4">
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
            <div className="flex flex-1 gap-4">
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
            <div className="flex flex-1 gap-4">
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
          <div className="grid gap-4">
            <div>
              {formData.studentDetailData.financialInformation
                .isFinanciallyIndependent ? (
                <Label className="sm:pl-3 flex gap-2 items-center">
                  <CircleCheckBig className="w-3 h-3 text-[#2EB88A]" />
                  Financially independent
                </Label>
              ) : (
                <Label className="sm:pl-3 flex gap-2 items-center">
                  <CircleMinus className="w-3 h-3 text-[#FF791F]" />
                  Financially dependent on Parents
                </Label>
              )}
            </div>
            <div>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
