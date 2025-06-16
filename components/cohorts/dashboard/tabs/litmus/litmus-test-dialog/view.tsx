"use client";

import {
  ArrowUpRight,
  FileIcon,
  ImageIcon,
  Link2,
  Link2Icon,
  VideoIcon,
} from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ReviewComponentProps } from "@/types/components/cohorts/dashboard/tabs/litmus/litmus-test-dialog/view";

export function ViewComponent({
  application,
  onApplicationUpdate,
}: ReviewComponentProps) {
  const latestCohort =
    application?.appliedCohorts?.[application?.appliedCohorts.length - 1];
  const cohortDetails = latestCohort?.cohortId;
  const litmusTestDetails = latestCohort?.litmusTestDetails;
  const tasks = cohortDetails?.litmusTestDetail?.[0]?.litmusTasks || [];
  const submission =
    litmusTestDetails?.litmusTasks?.[litmusTestDetails?.litmusTasks.length - 1];

  return (
    <div className="space-y-3">
      {/* Header Section */}
      <div className="flex items-center gap-4 border-b pb-3">
        <Avatar className="h-16 w-16">
          <AvatarImage src={application?.profileUrl} className="object-cover" />
          <AvatarFallback>
            {application?.firstName?.[0] || "-"}
            {application?.lastName?.[0] || "-"}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-base font-semibold">
            {application?.firstName + " " + application?.lastName}
          </h2>
          <div className="flex gap-2 h-5 items-center">
            <p className="text-sm text-muted-foreground">
              {application?.email}
            </p>
            <Separator orientation="vertical" />
            <p className="text-sm text-muted-foreground">
              {application?.mobileNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Task Section */}
      {tasks.map((task: any, index: any) => (
        <div key={index} className="space-y-4">
          <h3 className="text-[#00A3FF] text-lg font-semibold">
            Task 0{index + 1}
          </h3>
          <div className="space-y-1">
            <h4 className="text-lg font-semibold">{task?.title}</h4>
            <p className="text-sm ">{task?.description}</p>
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold pl-3">Resources</h4>
            <div className="space-y-2">
              <div className="w-full space-y-2">
                {task?.resources?.resourceFiles.map(
                  (file: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 mt-2 px-3 border rounded-xl "
                    >
                      <div className="flex items-center gap-2">
                        <FileIcon className="w-4 h-4" />
                        <span className="text-white text-sm truncate overflow-hidden whitespace-nowrap max-w-[200px] sm:max-w-[700px]">
                          {file.split("/").pop()}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() =>
                          window.open(
                            `
                        ${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${file}`,
                            "_blank"
                          )
                        }
                        className="text-white rounded-xl"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )
                )}

                {task?.resources?.resourceLinks.map(
                  (link: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 mt-2 px-3 border rounded-xl "
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Link2 className="w-4 h-4" />
                        <span className="text-white text-sm truncate overflow-hidden whitespace-nowrap max-w-[200px] sm:max-w-[700px]">
                          {link}
                        </span>
                      </div>
                      <Button
                        onClick={() => window.open(link, "_blank")}
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="text-white rounded-xl"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            {submission?.tasks && (
              <div className="flex justify-between items-center">
                <Badge
                  variant="pending"
                  className="px-3 py-2 text-sm bg-[#FFF552]/[0.2] border-[#FFF552]"
                >
                  Submission 0{index + 1}
                </Badge>
                <div className="text-muted-foreground capitalize text-sm mt-2">
                  Type:{" "}
                  {task?.submissionTypes
                    .map((configItem: any) => configItem?.type)
                    .join(", ")}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {submission?.tasks[index]?.text?.map(
                (textItem: string, id: number) => (
                  <div
                    key={`text-${id}`}
                    className="break-all w-full flex items-center gap-2 text-sm px-4 py-2 border rounded-xl"
                  >
                    {textItem}
                  </div>
                )
              )}
              {submission?.tasks[index]?.links?.map(
                (linkItem: string, id: number) => (
                  <div
                    key={`link-${id}`}
                    className="w-full flex items-center justify-between gap-2 text-sm px-3 border rounded-xl"
                  >
                    <div className="flex items-center gap-2 text-sm truncate">
                      <Link2Icon className="w-4 h-4" />
                      <a
                        href={linkItem}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white"
                      >
                        {linkItem}
                      </a>
                    </div>
                    <Button
                      onClick={() => window.open(linkItem, "_blank")}
                      variant="ghost"
                      size="icon"
                      type="button"
                      className="text-white rounded-xl"
                    >
                      <ArrowUpRight className="w-4 h-4 " />
                    </Button>
                  </div>
                )
              )}
              {submission?.tasks[index]?.images?.map(
                (imageItem: string, id: number) => (
                  <div
                    key={`image-${id}`}
                    className="w-full flex flex-col items-center text-sm border rounded-xl"
                  >
                    <Image
                      width={800}
                      height={420}
                      src={`
                        ${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${imageItem}`}
                      alt={imageItem.split("/").pop() || ""}
                      className="w-full h-[420px] object-contain rounded-t-xl"
                    />
                    <div className="w-full flex justify-between items-center px-3 border-t">
                      <div className="flex items-center gap-2 text-sm truncate">
                        <ImageIcon className="w-4 h-4" />
                        <span className="w-[220px] text-white truncate">
                          {imageItem.split("/").pop()}
                        </span>
                      </div>
                      <Button
                        onClick={() =>
                          window.open(
                            `
                        ${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${imageItem}`,
                            "_blank"
                          )
                        }
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="text-white rounded-xl"
                      >
                        <ArrowUpRight className="w-4 h-4 " />
                      </Button>
                    </div>
                  </div>
                )
              )}
              {submission?.tasks[index]?.videos?.map(
                (videoItem: string, id: number) => (
                  <div
                    key={`video-${id}`}
                    className="w-full flex flex-col items-center text-sm border rounded-xl"
                  >
                    <video
                      controls
                      preload="none"
                      className="h-[420px] rounded-t-xl"
                    >
                      <source
                        src={`
                        ${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${videoItem}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                    <div className="w-full flex justify-between items-center px-3 border-t">
                      <div className="flex items-center gap-2 text-sm truncate">
                        <VideoIcon className="w-4 h-4" />
                        <span className="w-[220px] text-white truncate">
                          {videoItem.split("/").pop()}
                        </span>
                      </div>
                      <Button
                        onClick={() =>
                          window.open(
                            `
                        ${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${videoItem}`,
                            "_blank"
                          )
                        }
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="text-white rounded-xl"
                      >
                        <ArrowUpRight className="w-4 h-4 " />
                      </Button>
                    </div>
                  </div>
                )
              )}
              {submission?.tasks[index]?.files?.map(
                (fileItem: string, id: number) => (
                  <div
                    key={`file-${id}`}
                    className="w-full flex items-center justify-between gap-2 text-sm px-3 border rounded-xl"
                  >
                    <div className="flex items-center gap-2 text-sm truncate">
                      <FileIcon className="w-4 h-4" />
                      <a
                        href={`
                        ${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${fileItem}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white"
                      >
                        {fileItem.split("/").pop()}
                      </a>
                    </div>
                    <Button
                      onClick={() =>
                        window.open(
                          `
                        ${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${fileItem}`,
                          "_blank"
                        )
                      }
                      variant="ghost"
                      size="icon"
                      type="button"
                      className="text-white rounded-xl"
                    >
                      <ArrowUpRight className="w-4 h-4 " />
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
          {index < tasks?.length - 1 && <Separator className="my-8" />}
        </div>
      ))}
    </div>
  );
}
