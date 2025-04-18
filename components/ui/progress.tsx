"use client";

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils/utils';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'; // Adjust import path as needed

interface ProgressState {
  value: number; // Percentage value for this state
  widt: number; // Percentage value for this state
  color?: string; // Background color for this state (optional)
}

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  states?: ProgressState[]; // Array of states with value and optional color
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, states = [], ...props }, ref) => {
  let cumulativePercentage = 0;

  // If only one state is provided, default its color if none is set
  const normalizedStates =
    states.length === 1 && !states[0].color
      ? [{ ...states[0], color: '#00AB7B' }]
      : states;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
      {...props}
    >
      <TooltipProvider>
        {normalizedStates.map((state, index) => {
          const leftPosition = cumulativePercentage;
          cumulativePercentage += state.widt;

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <ProgressPrimitive.Indicator
                  className="absolute h-full transition-all"
                  style={{
                    width: `${state.widt}%`,
                    left: `${leftPosition}%`,
                    backgroundColor: state.color,
                    cursor: 'pointer', // Optional: makes it clearer that it's hoverable
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{`${state.value}`}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
