"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils/utils";

// Define variants for TabsList
const tabsListVariants = cva(
  "inline-flex h-10 items-center justify-center p-1 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-muted rounded-md",
        outline:
          "border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950",
        ghost: "bg-transparent",
        secondary: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Define variants for TabsTrigger
const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        destructive: "text-destructive dark:text-red-900",
        outline:
          "border border-slate-200 text-slate-900 dark:border-slate-800 dark:text-slate-50",
        secondary:
          "text-white dark:text-slate-50 data-[state=active]:bg-[#212936] ",
        sm: "h-8 rounded-full data-[state=active]:text-white text-sm data-[state=active]:bg-[#27272A]",
        xs: "h-7 rounded-full data-[state=active]:text-white text-[13px] data-[state=active]:bg-[#6808FE]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Tabs = TabsPrimitive.Root;

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, className }))}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, className }))}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
