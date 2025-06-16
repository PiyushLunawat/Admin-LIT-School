import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpRight,
  FileIcon,
  ImageIcon,
  Link2,
  Link2Icon,
  VideoIcon,
} from "lucide-react";
import Image from "next/image";
import React from "react";

interface SubmissionViewProps {
  tasks: any;
  submission: any;
}

export function SubmissionView({ tasks, submission }: SubmissionViewProps) {
  return (
    <div className="">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Course Dive</h3>

        <div className="space-y-1">
          <h4 className="font-medium text-[#00A3FF]">
            Why are you interested in joining The LIT School?
          </h4>
          {submission?.courseDive?.[0] && (
            <div className="mt-2">
              <div className="break-all flex items-center gap-2 text-sm mt-2 px-4 py-2 border rounded-xl">
                {submission?.courseDive?.[0]}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h4 className="font-medium text-[#00A3FF]">
            What are your career goals or aspirations??
          </h4>
          {submission?.courseDive?.[1] && (
            <div className="mt-2">
              <div className="break-all flex items-center gap-2 text-sm mt-2 px-4 py-2 border rounded-xl">
                {submission?.courseDive?.[1]}
              </div>
            </div>
          )}
        </div>
      </div>
      <Separator className="my-8" />

      {tasks.map((task: any, index: any) => (
        <React.Fragment key={index}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Task 0{index + 1}</h3>
            <div className="space-y-1">
              <h4 className="font-medium text-[#00A3FF]">{task?.title}</h4>
              <p className="text-sm text-muted-foreground">
                {task?.description}
              </p>
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
                            {`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${file.split("/").pop()}`}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => window.open(`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${file}`, "_blank")}
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
                            {`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${link}`}
                          </span>
                        </div>
                        <Button
                          onClick={() => window.open(`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${link}`, "_blank")}
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
              {submission && (
                <div className="flex justify-between items-center">
                  <Badge
                    variant="pending"
                    className="px-3 py-2 text-sm bg-[#FFF552]/[0.2] border-[#FFF552]"
                  >
                    Submission
                  </Badge>
                  <div className="text-muted-foreground capitalize text-sm mt-2">
                    Type:{" "}
                    {task?.config
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
                      {`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${textItem}`}
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
                          href={`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${linkItem}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white"
                        >
                          {`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${linkItem}`}
                        </a>
                      </div>
                      <Button
                        onClick={() => window.open(`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${linkItem}`, "_blank")}
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
                        src={`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${imageItem}`}
                        alt={`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${imageItem}`.split("/").pop() || ""}
                        width={800}
                        height={420}
                        className="w-full h-[420px] object-contain rounded-t-xl"
                      />
                      <div className="w-full flex justify-between items-center px-3 border-t">
                        <div className="flex items-center gap-2 text-sm truncate">
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-white text-sm truncate overflow-hidden whitespace-nowrap max-w-[200px] sm:max-w-[700px]">
                            {`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${imageItem}`.split("/").pop()}
                          </span>
                        </div>
                        <Button
                          onClick={() => window.open(`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${imageItem}`, "_blank")}
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
                        <source src={`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${videoItem}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="w-full flex justify-between items-center px-3 border-t">
                        <div className="flex items-center gap-2 text-sm truncate">
                          <VideoIcon className="w-4 h-4" />
                          <span className="text-white text-sm truncate overflow-hidden whitespace-nowrap max-w-[200px] sm:max-w-[700px]">
                            {`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${videoItem}`.split("/").pop()}
                          </span>
                        </div>
                        <Button
                          onClick={() => window.open(`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${videoItem}`, "_blank")}
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
                          href={`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${fileItem}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white"
                        >
                          {`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${fileItem}`.split("/").pop()}
                        </a>
                      </div>
                      <Button
                        onClick={() => window.open(`${process.env.NEXT_PUBLIC_AWS_RESOURCE_URL}/${fileItem}`, "_blank")}
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
          </div>
          {index < tasks?.length - 1 && <Separator className="my-8" />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default SubmissionView;
