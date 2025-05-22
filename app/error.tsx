"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}): JSX.Element {
  const showTrace = process.env.NODE_ENV !== "production";

  // Just cast it to Error so TS doesn't complain
  const customError = error as Error;
  const stackTrace = customError.stack || "No stack trace available";
  const traceTitle = "Debug Trace";

  return (
    <Drawer>
      <div className="flex flex-col gap-8 items-center justify-center h-screen text-center">
        <Link href="/" className="items-center space-x-2 flex">
          <Image
            className="h-32"
            src="/assets/images/lit-logo.svg"
            alt="The LIT School"
            width={128}
            height={128}
          />
        </Link>

        <div className="space-y-4 flex flex-col justify-center">
          <h1 className="text-4xl font-bold">Error</h1>
          <p className="text-muted-foreground">{error.message}</p>
          <div className="flex gap-2 items-center mx-auto">
            <Button
              variant="link"
              className="flex gap-2 items-center text-base"
              onClick={reset}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Separator orientation="vertical" />
            <Button
              variant="link"
              className="flex gap-2 items-center text-base"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              back
            </Button>
          </div>
        </div>

        {showTrace && (
          <DrawerTrigger asChild>
            <Button variant="outline">View Trace</Button>
          </DrawerTrigger>
        )}
      </div>

      {showTrace && (
        <DrawerContent>
          <div className="mx-auto w-full">
            <DrawerHeader>
              <DrawerTitle>Debug Trace</DrawerTitle>
              <DrawerDescription>{traceTitle}</DrawerDescription>
            </DrawerHeader>
            <div className="w-full p-4 pb-0 overflow-y-auto h-[70vh]">
              <pre>{stackTrace}</pre>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      )}
    </Drawer>
  );
}
