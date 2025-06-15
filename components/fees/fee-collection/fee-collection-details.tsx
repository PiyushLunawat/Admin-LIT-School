"use client";

import { AwardScholarship } from "@/components/cohorts/dashboard/tabs/litmus/litmus-test-dialog/award-scholarship";
import { MarkedAsDialog } from "@/components/students/sections/drop-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatAmount } from "@/lib/utils/helpers";
import {
  Calendar,
  Download,
  DownloadIcon,
  Eye,
  FilePenLine,
  Mail,
  UploadIcon,
  UserMinus,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type BadgeVariant =
  | "destructive"
  | "warning"
  | "secondary"
  | "success"
  | "onhold"
  | "pending"
  | "default";

interface FeeCollectionDetailsProps {
  application: any;
  onClose: () => void;
  onApplicationUpdate: () => void;
}

export function FeeCollectionDetails({
  application,
  onClose,
  onApplicationUpdate,
}: FeeCollectionDetailsProps) {
  const [markedAsDialogOpen, setMarkedAsDialogOpen] = useState(false);
  const [sch, setSch] = useState<any>(null);
  const [schOpen, setSchOpen] = useState(false);
  const [showAllSemesters, setShowAllSemesters] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleView = (url: string) => {
    setImageUrl(url);
    setOpen(true);
  };

  const lastCourse =
    application.cousrseEnrolled?.[application.cousrseEnrolled.length - 1];
  const latestCohort =
    application.appliedCohort?.[application.appliedCohort.length - 1];
  const applicationDetails = latestCohort?.applicationDetails;

  let lastStatus = "";

  const visibleSemesters = showAllSemesters
    ? lastCourse?.installmentDetails
    : lastCourse?.installmentDetails?.slice(0, 1);

  const colorClasses = [
    "text-emerald-600",
    "text-[#3698FB]",
    "text-[#FA69E5]",
    "text-orange-600",
  ];

  let paidAmount = 0;
  let notPaidAmount = 0;

  const lastEnrolled = lastCourse;
  if (lastEnrolled?.feeSetup?.installmentType === "one shot payment") {
    const oneShotDetails = lastEnrolled?.oneShotPayment;
    if (oneShotDetails) {
      if (oneShotDetails?.verificationStatus === "paid") {
        paidAmount += oneShotDetails?.amountPayable;
      } else {
        notPaidAmount += oneShotDetails?.amountPayable;
      }
    }
  }
  if (lastEnrolled?.feeSetup?.installmentType === "instalments") {
    lastEnrolled?.installmentDetails?.forEach((semesterDetail: any) => {
      const installments = semesterDetail?.installments;
      installments?.forEach((instalment: any) => {
        if (instalment?.verificationStatus === "paid") {
          paidAmount += instalment?.amountPayable;
        } else {
          notPaidAmount += instalment?.amountPayable;
        }
      });
    });
  }

  useEffect(() => {
    setSch(
      application?.cousrseEnrolled?.[application?.cousrseEnrolled?.length - 1]
        ?.semesterFeeDetails
    );
  }, [application]);

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "default";
      case "overdue":
        return "warning";
      case "verification pending":
        return "pending";
      default:
        return "default";
    }
  };

  const getColor = (slabName: string): string => {
    const index =
      application?.cohort?.litmusTestDetail?.[0]?.scholarshipSlabs.findIndex(
        (slab: any) => slab.name === slabName
      );

    return index !== -1
      ? colorClasses[index % colorClasses.length]
      : "text-default";
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
          {/* Payment Overview */}
          <div className="space-y-2">
            <h4 className="font-medium">Payment Overview</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-medium">
                  ₹{formatAmount(paidAmount + notPaidAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Amount</p>
                <p className="font-medium">₹{formatAmount(paidAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scholarship</p>
                <p
                  className={`flex gap-1 font-medium ${getColor(
                    sch?.scholarshipName || ""
                  )}`}
                >
                  {sch?.scholarshipName ? (
                    <>
                      <div className="truncate">{sch?.scholarshipName}</div>
                      <span className="text-white">
                        ({sch?.scholarshipPercentage}%)
                      </span>
                    </>
                  ) : (
                    "--"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Admission Fee Status
                </p>
                <span className="text-base mr-2">
                  ₹
                  {formatAmount(
                    application?.cohort?.cohortFeesDetail?.tokenFee
                  )}
                </span>
                <Badge
                  className="capitalize"
                  variant={getStatusColor(
                    lastCourse?.tokenFeeDetails?.verificationStatus || "pending"
                  )}
                >
                  {lastCourse?.tokenFeeDetails?.verificationStatus ||
                    "payment due"}
                </Badge>
              </div>
            </div>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-sm">
                <span>Payment Progress</span>
                <span>{((paidAmount / notPaidAmount) * 100).toFixed(0)}%</span>
              </div>
              <Progress
                states={[
                  {
                    value: paidAmount,
                    widt: (paidAmount / notPaidAmount) * 100,
                    color: "#2EB88A",
                  },
                ]}
              />
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          {latestCohort?.status === "dropped" ? (
            <div className="bg-[#FF503D1A] px-4 py-3 rounded-lg space-y-2">
              <div className="flex justify-between gap-2">
                <div className="flex gap-2 items-center justify-start text-destructive">
                  <UserMinus className="h-4 w-4 text-red-500" />
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
                <Button
                  variant="outline"
                  className="border-none bg-[#FF791F]/90 hover:bg-[#FF791F] justify-start text-destructivejustify-start"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Share Reminder
                </Button>
                <Button variant="outline" className="justify-start">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download Files
                </Button>
                <Button variant="outline" className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Present...
                </Button>
                <Button
                  variant="outline"
                  className="border-none bg-[#FF503D1A] hover:bg-[#FF503D]/20 justify-start text-destructive"
                  onClick={() => setMarkedAsDialogOpen(true)}
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

                <Dialog
                  open={markedAsDialogOpen}
                  onOpenChange={setMarkedAsDialogOpen}
                >
                  <DialogTitle></DialogTitle>
                  <DialogContent className="max-w-[90vw] sm:max-w-4xl py-4 px-6">
                    <MarkedAsDialog
                      student={application}
                      onUpdateStatus={() => onApplicationUpdate()}
                      onClose={() => setMarkedAsDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}

          <Separator />

          {/* Instalments */}
          <div className="space-y-4">
            <h4 className="font-medium">Payment Schedule</h4>

            {lastCourse?.feeSetup?.installmentType === "one shot payment" ? (
              <Card className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">One Shot Payement</h5>
                  </div>
                  <div className="flex items-center gap-2">
                    {new Date(lastCourse?.oneShotPayment?.installmentDate) <
                      new Date() &&
                    lastCourse?.oneShotPayment?.verificationStatus ===
                      "pending" ? (
                      <Badge variant={getStatusColor("overdue")}>overdue</Badge>
                    ) : (
                      <Badge
                        variant={getStatusColor(
                          lastCourse?.oneShotPayment?.verificationStatus || ""
                        )}
                      >
                        {lastCourse?.oneShotPayment?.verificationStatus}
                      </Badge>
                    )}
                    {`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${
                      lastCourse?.oneShotPayment?.receiptUrls[
                        lastCourse?.oneShotPayment?.receiptUrls.length - 1
                      ]?.url
                    }}` && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleView(
                            `
                          ${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${
                              lastCourse?.oneShotPayment?.receiptUrls[
                                lastCourse?.oneShotPayment?.receiptUrls.length -
                                  1
                              ]?.url
                            }}`
                          )
                        }
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm ">
                    Amount: ₹
                    {formatAmount(lastCourse?.oneShotPayment?.amountPayable)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Base Amount: ₹
                    {formatAmount(lastCourse?.oneShotPayment?.baseFee)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    One Shot Discount: ₹
                    {formatAmount(
                      lastCourse?.oneShotPayment?.OneShotPaymentAmount
                    )}
                  </p>
                  {lastCourse?.oneShotPayment?.baseFee *
                    sch?.scholarshipPercentage !==
                    0 && (
                    <p className="text-xs text-muted-foreground">
                      Scholarship Waiver:{" "}
                      <span
                        className={`${getColor(sch?.scholarshipName || "")}`}
                      >
                        ₹
                        {formatAmount(
                          lastCourse?.oneShotPayment?.baseFee *
                            sch?.scholarshipPercentage *
                            0.01
                        )}
                      </span>
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Due:{" "}
                    {new Date(
                      lastCourse?.oneShotPayment?.installmentDate
                    ).toLocaleDateString()}
                  </div>
                  {lastCourse?.oneShotPayment?.receiptUrls[
                    lastCourse?.oneShotPayment?.receiptUrls.length - 1
                  ]?.uploadedDate && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Paid:{" "}
                      {new Date(
                        lastCourse?.oneShotPayment?.receiptUrls[
                          lastCourse?.oneShotPayment?.receiptUrls.length - 1
                        ]?.uploadedDate
                      ).toLocaleDateString()}
                    </div>
                  )}
                </div>
                {`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${
                  lastCourse?.oneShotPayment?.receiptUrls[
                    lastCourse?.oneShotPayment?.receiptUrls.length - 1
                  ]?.url
                }}` ? (
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload Receipt
                  </Button>
                )}
              </Card>
            ) : (
              <div className="space-y-2">
                {visibleSemesters?.map(
                  (semesterDetail: any, semesterIndex: number) => (
                    <div key={semesterIndex} className="space-y-2">
                      {semesterDetail?.installments?.map(
                        (instalment: any, installmentIndex: number) => (
                          <Card
                            key={installmentIndex}
                            className="p-4 space-y-2"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h5 className="font-medium">
                                  instalment {installmentIndex + 1}
                                </h5>
                                <p className="text-xs text-[#00A3FF]">
                                  Semester {semesterDetail.semester}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {lastStatus !== "pending" &&
                                  (new Date(instalment?.installmentDate) <
                                    new Date() &&
                                  instalment?.verificationStatus ===
                                    "pending" &&
                                  !instalment.receiptUrls[0]?.uploadedDate ? (
                                    <Badge variant={getStatusColor("overdue")}>
                                      overdue
                                    </Badge>
                                  ) : (
                                    <Badge
                                      className="capitalize"
                                      variant={getStatusColor(
                                        instalment.verificationStatus || ""
                                      )}
                                    >
                                      {instalment.verificationStatus}
                                    </Badge>
                                  ))}
                                <div className="hidden">
                                  {(lastStatus = instalment.verificationStatus)}
                                </div>
                                {`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${
                                  instalment.receiptUrls[
                                    instalment.receiptUrls.length - 1
                                  ]?.url
                                }}` && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleView(
                                        `${
                                          process.env
                                            .NEXT_PUBLIC_AWS_RESOURCE_URL
                                        }/${
                                          instalment.receiptUrls[
                                            instalment.receiptUrls.length - 1
                                          ]?.url
                                        }}`
                                      )
                                    }
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm ">
                                Amount Payable: ₹
                                {formatAmount(instalment.amountPayable)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Base Amount: ₹
                                {formatAmount(
                                  instalment.baseFee +
                                    instalment.scholarshipAmount
                                )}
                              </p>
                              {instalment.scholarshipAmount !== 0 && (
                                <p className="text-xs text-muted-foreground">
                                  Scholarship Waiver:{" "}
                                  <span
                                    className={`${getColor(
                                      sch.scholarshipName || ""
                                    )}`}
                                  >
                                    ₹
                                    {formatAmount(instalment.scholarshipAmount)}
                                  </span>
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-2" />
                                Due:{" "}
                                {new Date(
                                  instalment.installmentDate
                                ).toLocaleDateString()}
                              </div>
                              {instalment.receiptUrls?.[0]?.uploadedDate && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Paid:{" "}
                                  {new Date(
                                    instalment.receiptUrls[0]?.uploadedDate
                                  ).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                            {`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${
                              instalment.receiptUrls[
                                instalment.receiptUrls.length - 1
                              ]?.url
                            }}` ? (
                              instalment.verificationStatus ===
                              "verification pending" ? (
                                <Button
                                  size="sm"
                                  className="w-full mt-2"
                                  // onClick={() => window.open(instalment.receiptUrls[0]?.url, "_blank")}
                                >
                                  <FilePenLine className="h-4 w-4 mr-2" />
                                  Verify Acknowledgement Receipt
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full mt-2"
                                  onClick={() =>
                                    window.open(
                                      `${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${instalment.receiptUrls[0]?.url}}`,
                                      "_blank"
                                    )
                                  }
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download Receipt
                                </Button>
                              )
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-2"
                              >
                                <UploadIcon className="h-4 w-4 mr-2" />
                                Upload Receipt
                              </Button>
                            )}
                          </Card>
                        )
                      )}
                    </div>
                  )
                )}
                {sch?.scholarshipDetails?.length > 1 && (
                  <Button
                    variant="ghost"
                    className="w-full underline text-muted-foreground"
                    onClick={() => setShowAllSemesters(!showAllSemesters)}
                  >
                    {showAllSemesters ? "View Less" : "View More"}
                  </Button>
                )}
              </div>
            )}
          </div>

          <Dialog open={schOpen} onOpenChange={setSchOpen}>
            <DialogTitle></DialogTitle>
            <DialogContent className="max-w-[90vw] sm:max-w-5xl">
              <AwardScholarship student={application} />
            </DialogContent>
          </Dialog>

          {/* <Separator /> */}

          {/* Communication History */}
          {/* <div className="space-y-4">
            <h4 className="font-medium">Communication History</h4>
            {payment.communications.map((comm, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <Badge variant="secondary" className="bg-[#262626]">{comm.type}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(comm.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{comm.message}</p>
              </div>
            ))}
          </div> */}
        </div>
      </ScrollArea>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-[90vw] sm:max-w-4xl py-2 px-6 overflow-y-auto">
          {imageUrl ? (
            <Image
              width={600}
              height={400}
              src={imageUrl}
              alt="Receipt"
              className="mx-auto h-[50vh] object-contain"
            />
          ) : (
            <p className="text-center text-muted-foreground">
              No receipt found.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
