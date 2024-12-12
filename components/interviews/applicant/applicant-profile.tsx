"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PersonalDetailsSection } from "./personal-details-section";
import { EducationExperienceSection } from "./education-experience-section";
import { ContactDetailsSection } from "./contact-details-section";

interface ApplicantProfileProps {
  interviewId: string;
}

export function ApplicantProfile({ interviewId }: ApplicantProfileProps) {
  const router = useRouter();

  // In a real application, this data would be fetched based on the interviewId
  const applicantData = {
    personal: {
      photo: "/placeholder-avatar.jpg",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+91 98765 43210",
      dateOfBirth: "1998-05-15",
      currentStatus: "College Student",
      program: "Creator Marketer",
      cohort: "CM01JY",
      gender: "Male",
      linkedinUrl: "linkedin.com/in/johndoe",
      instagramUrl: "instagram.com/johndoe",
      address: {
        street: "123 Main Street",
        state: "Karnataka",
        city: "Bangalore",
        zipCode: "560001",
      },
    },
    educationExperience: {
      education: {
        level: "College Graduate",
        fieldOfStudy: "Computer Science",
        graduationYear: "2020",
        institution: "Example University",
        hasGraduated: true,
      },
      experience: {
        hasExperience: true,
        type: "Working Professional",
        details: {
          description: "Full Stack Developer",
          company: "Tech Corp",
          duration: "2 years",
        },
      },
    },
    contacts: {
      emergency: {
        firstName: "Jane",
        lastName: "Doe",
        phone: "+91 98765 43211",
        relationship: "Mother",
      },
      parents: {
        father: {
          firstName: "James",
          lastName: "Doe",
          phone: "+91 98765 43212",
          occupation: "Business Owner",
        },
        mother: {
          firstName: "Jane",
          lastName: "Doe",
          phone: "+91 98765 43211",
          occupation: "Teacher",
        },
        isFinanciallyDependent: true,
        hasAppliedForAid: false,
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Interview
        </Button>
        <h1 className="text-3xl font-bold">Applicant Profile</h1>
      </div>

      <div className="space-y-6">
        <PersonalDetailsSection data={applicantData.personal} />
        <EducationExperienceSection data={applicantData.educationExperience} />
        <ContactDetailsSection data={applicantData.contacts} />
      </div>
    </div>
  );
}