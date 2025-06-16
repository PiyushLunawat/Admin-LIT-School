"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatAmount } from "@/lib/utils/helpers";
import { Calendar, CreditCard, Mail, Upload, UserMinus, X } from "lucide-react";

type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "onhold"
  | "pending"
  | "default";

interface EnrolmentDetailsProps {
  application: any;
  onClose: () => void;
  onApplicationUpdate: () => void;
}

export function EnrolmentDetails({
  application,
  onClose,
  onApplicationUpdate,
}: EnrolmentDetailsProps) {
  const latestCohort =
    application.appliedCohort?.[application.appliedCohort.length - 1];
  const applicationDetails = latestCohort?.applicationDetails;

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "pending":
      case "verification-pending":
        return "pending";
      case "paid":
        return "success";
      case "dropped":
        return "warning";
      case "flagged":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMs = now.getTime() - date.getTime(); // Difference in milliseconds

    const diffInSecs = Math.floor(diffInMs / 1000); // Seconds
    const diffInMins = Math.floor(diffInSecs / 60); // Minutes
    const diffInHours = Math.floor(diffInMins / 60); // Hours
    const diffInDays = Math.floor(diffInHours / 24); // Days

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInMins > 0) {
      return `${diffInMins} minute${diffInMins > 1 ? "s" : ""} ago`;
    } else if (diffInSecs > 0) {
      return `Just now`;
    } else {
      return ``;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-start justify-between">
        <div>
          <h3 className="font-semibold">
            {application?.firstName + " " + application?.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">{application?.email}</p>
          <p className="text-sm text-muted-foreground">
            {application?.mobileNumber}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Payment Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Current Status</h4>
              <Badge
                variant={getStatusColor(
                  application?.cousrseEnrolled?.[
                    application.cousrseEnrolled?.length - 1
                  ]?.tokenFeeDetails?.verificationStatus || ""
                )}
                className="capitalize"
              >
                {
                  application?.cousrseEnrolled?.[
                    application.cousrseEnrolled?.length - 1
                  ]?.tokenFeeDetails?.verificationStatus
                }
              </Badge>
            </div>
            <div className="flex justify-between items-center text-xs">
              <p className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(
                  application?.applicationDetails?.updatedAt
                ).toLocaleDateString()}
              </p>
              {application?.cousrseEnrolled?.[
                application.cousrseEnrolled?.length - 1
              ]?.tokenFeeDetails?.verificationStatus === "paid" ? (
                <p className="text-muted-foreground">
                  Admission Fee:{" "}
                  <span className="text-xs text-white font-normal">
                    ₹{" "}
                    {formatAmount(
                      application?.cohort?.cohortFeesDetail?.tokenFee
                    )}
                  </span>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Interview Cleared{" "}
                  {timeAgo(application?.applicationDetails?.updatedAt)}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          {latestCohort?.status === "dropped" ? (
            <div className="bg-[#FF503D1A] px-4 py-3 rounded-lg space-y-2">
              <div className="flex justify-between gap-2">
                <div className="flex gap-2 items-center justify-start text-destructive">
                  <UserMinus className="h-4 w-4 text-destructive" />
                  Dropped off
                </div>
                <div className="">By Admin</div>
              </div>
              <div className="">
                {latestCohort?.reasonForDropped?.[
                  latestCohort?.reasonForDropped.length - 1
                ]?.notes &&
                  latestCohort?.reasonForDropped?.[
                    latestCohort?.reasonForDropped.length - 1
                  ]?.notes.map((reason: any, index: any) => (
                    <div key={index} className="text-sm">
                      {reason}
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="font-medium">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
                <Button
                  variant="outline"
                  className="border-none bg-[#FF791F]/90 hover:bg-[#FF791F] justify-start text-destructivejustify-start"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Share Reminder
                </Button>
                <Button variant="outline" className="justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Receipt
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-none bg-[#FF503D1A] hover:bg-[#FF503D]/20 justify-start text-destructive"
                      disabled={
                        latestCohort?.status === "dropped" ||
                        ["incomplete", "rejected", "not qualified"].includes(
                          applicationDetails?.applicationStatus
                        )
                      }
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Mark as Dropped
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    side="top"
                    className="max-w-[345px] w-full"
                  >
                    <div className="text-base font-medium mb-2">
                      {`Are you sure you would like to drop ${application?.studentName}`}
                    </div>
                    <div className="flex gap-2 ">
                      <Button variant="outline" className="flex-1">
                        Cancel
                      </Button>
                      <Button className="bg-[#FF503D]/20 hover:bg-[#FF503D]/30 text-[#FF503D] flex-1">
                        Drop
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          <Separator />

          {/* Payment History */}
          <div className="space-y-4">
            <h4 className="font-medium">Interview:</h4>
            {application?.applicationDetails?.applicationTestInterviews.map(
              (interview: any, index: any) =>
                interview?.feedback[interview?.feedback.length - 1] && (
                  <Card key={index} className="p-4 space-y-2">
                    <div className="">
                      <h5 className="font-medium text-base text-muted-foreground">
                        Feedback:
                      </h5>
                      {interview?.feedback[
                        interview?.feedback.length - 1
                      ]?.comments.map((item: any, i: any) => (
                        <ul
                          key={i}
                          className="ml-4 sm:ml-6 space-y-2 list-disc"
                        >
                          <li className="text-sm" key={i}>
                            {item}
                          </li>
                        </ul>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-sm text-muted-foreground">
                        Updated by Admin
                      </div>
                      <div className="font-medium text-sm text-muted-foreground">
                        {new Date(
                          interview?.feedback[
                            interview?.feedback.length - 1
                          ]?.date
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                )
            )}
          </div>

          {/* <Separator /> */}

          {/* Communication History */}
          {/* <div className="space-y-4">
            <h4 className="font-medium">Communication History</h4>
            {payment.communications.map((comm, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <Badge variant="secondary">{comm.type}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(comm.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{comm.message}</p>
              </div>
            ))}
            <Textarea placeholder="Add a note..." />
            <Button className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div> */}
        </div>
      </ScrollArea>
    </div>
  );
}
