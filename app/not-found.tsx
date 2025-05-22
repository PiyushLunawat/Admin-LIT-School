"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  // Show the "Debug Trace" drawer only in non-production environments.
  const showTrace = process.env.NODE_ENV !== "production";

  // Generate a stack trace to display.
  // This is just an example; adjust to suit your needs.
  const stackTrace =
    new Error("Page Not Found").stack || "No stack trace available";
  const traceTitle = "Debug Trace";

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <Link href="/" className="items-center space-x-2 flex">
        <Image
          width={128}
          height={128}
          className="h-32"
          src="/assets/images/lit-logo.svg"
          alt="The LIT School"
        />
      </Link>

      <div className="space-y-4 mb-2 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mt-10">404 | Page Not Found</h1>
        <p className="text-muted-foreground">
          Lost? This page is too. Let’s find our way back!
        </p>
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
  );
}
