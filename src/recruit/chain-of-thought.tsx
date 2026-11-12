"use client"

// Adapted from Prompt Kit's ChainOfThought (MIT, Copyright (c) 2025 Julien
// Thibeaut), commit 5a9496635cc0e1bf7679fe2a9e35d9b36b99c08a:
// https://github.com/ibelick/prompt-kit/blob/5a9496635cc0e1bf7679fe2a9e35d9b36b99c08a/components/prompt-kit/chain-of-thought.tsx
// THIRD_PARTY_NOTICES.md holds the license and what was changed. It is the
// timeline SourcingTrace draws, and is not exported from the package.

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@epicbagel/saas-kit/primitives/collapsible"
import { cn } from "@epicbagel/saas-kit/lib/utils"
import { ChevronDown, Circle } from "lucide-react"
import React from "react"

export type ChainOfThoughtItemProps = React.ComponentProps<"div">

export const ChainOfThoughtItem = ({
  children,
  className,
  ...props
}: ChainOfThoughtItemProps) => (
  <div className={cn("text-muted-foreground min-w-0 text-sm wrap-anywhere", className)} {...props}>
    {children}
  </div>
)

type ChainOfThoughtLineProps = {
  leftIcon?: React.ReactNode
  description?: React.ReactNode
  status?: "pending" | "running" | "error"
}

export type ChainOfThoughtTriggerProps = React.ComponentProps<
  typeof CollapsibleTrigger
> & ChainOfThoughtLineProps & {
  swapIconOnHover?: boolean
}

const lineClassName = "text-muted-foreground flex max-w-full min-w-0 items-center justify-start gap-1 text-left text-sm leading-[1.8] transition-colors data-[status=error]:text-destructive data-[status=pending]:opacity-60"

function LineContent({
  children,
  leftIcon,
  description,
  status,
  swapIconOnHover = false,
}: React.PropsWithChildren<ChainOfThoughtLineProps & { swapIconOnHover?: boolean }>) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      {leftIcon ? (
        <span className="relative mt-[calc((1.8em_-_1rem)/2)] inline-flex size-4 shrink-0 items-center justify-center">
          <span
            className={cn(
              "transition-opacity",
              swapIconOnHover && "group-hover/chain-trigger:opacity-0"
            )}
          >
            {leftIcon}
          </span>
          {swapIconOnHover && (
            <ChevronDown aria-hidden="true" className="absolute size-4 opacity-0 transition-opacity group-hover/chain-trigger:opacity-100 group-data-[state=open]/chain-trigger:rotate-180" />
          )}
        </span>
      ) : (
        <span aria-hidden="true" className="relative mt-[calc((1.8em_-_1rem)/2)] inline-flex size-4 shrink-0 items-center justify-center">
          <Circle className="size-2 fill-current" />
        </span>
      )}
      <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
        <span data-slot="chain-of-thought-title" className={cn("min-w-0 wrap-anywhere", status === "running" && "shimmer motion-reduce:shimmer-none")}>{children}</span>
        {description ? <span data-slot="chain-of-thought-description" className="text-muted-foreground/70 min-w-0 tabular-nums wrap-anywhere">{description}</span> : null}
      </span>
    </div>
  )
}

export const ChainOfThoughtTrigger = ({
  children,
  className,
  leftIcon,
  description,
  status,
  swapIconOnHover = true,
  ...props
}: ChainOfThoughtTriggerProps) => (
  <CollapsibleTrigger
    data-slot="chain-of-thought-trigger"
    data-status={status}
    className={cn(
      lineClassName,
      "group/chain-trigger min-h-8 cursor-pointer rounded-md outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[status=error]:hover:text-destructive [@media(pointer:coarse)]:min-h-[44px]",
      className
    )}
    {...props}
  >
    <LineContent leftIcon={leftIcon} description={description} status={status} swapIconOnHover={swapIconOnHover}>{children}</LineContent>
    {(!leftIcon || !swapIconOnHover) && (
      <ChevronDown aria-hidden="true" className="size-4 shrink-0 transition-transform group-data-[state=open]/chain-trigger:rotate-180" />
    )}
  </CollapsibleTrigger>
)

/** A step with no detail has the same timeline row, without a dead disclosure. */
export const ChainOfThoughtStatic = ({
  children,
  className,
  leftIcon,
  description,
  status,
  ...props
}: React.ComponentProps<"div"> & ChainOfThoughtLineProps) => (
  <div data-slot="chain-of-thought-static" data-status={status} className={cn(lineClassName, "min-h-8", className)} {...props}>
    <LineContent leftIcon={leftIcon} description={description} status={status}>{children}</LineContent>
  </div>
)

export type ChainOfThoughtContentProps = React.ComponentProps<
  typeof CollapsibleContent
> & {
  /** A whole-run disclosure contains its own timeline, without an extra connector. */
  timeline?: boolean
}

export const ChainOfThoughtContent = ({
  children,
  className,
  timeline = true,
  ...props
}: ChainOfThoughtContentProps) => (
  <CollapsibleContent
    data-slot="chain-of-thought-content"
    className={cn(
      "text-popover-foreground min-w-0 overflow-hidden duration-200 [--radix-accordion-content-height:var(--radix-collapsible-content-height)] data-open:animate-accordion-down data-closed:animate-accordion-up motion-reduce:animate-none",
      className
    )}
    {...props}
  >
    {timeline ? (
      <div className="grid min-w-0 grid-cols-[min-content_minmax(0,1fr)] gap-x-4">
        <div aria-hidden="true" className="bg-primary/20 ml-1.75 h-full w-px group-data-[last=true]/chain-step:bg-transparent" />
        <div className="mt-2 min-w-0 space-y-2">{children}</div>
      </div>
    ) : <div className="mt-2 min-w-0">{children}</div>}
  </CollapsibleContent>
)

export type ChainOfThoughtProps = React.ComponentProps<"div">

export function ChainOfThought({ children, className, ...props }: ChainOfThoughtProps) {
  const childrenArray = React.Children.toArray(children)

  return (
    <div data-slot="chain-of-thought" className={cn("min-w-0 space-y-0", className)} {...props}>
      {childrenArray.map((child, index) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<ChainOfThoughtStepProps>,
              { isLast: index === childrenArray.length - 1 }
            )
          : null
      )}
    </div>
  )
}

export type ChainOfThoughtStepProps = {
  children: React.ReactNode
  className?: string
  isLast?: boolean
}

export const ChainOfThoughtStep = ({
  children,
  className,
  isLast = false,
  ...props
}: ChainOfThoughtStepProps & React.ComponentProps<typeof Collapsible>) => (
  <Collapsible
    data-slot="chain-of-thought-step"
    className={cn("group/chain-step min-w-0", className)}
    data-last={isLast}
    {...props}
  >
    {children}
    {!isLast && <div aria-hidden="true" className="flex justify-start"><div className="bg-primary/20 ml-1.75 h-4 w-px" /></div>}
  </Collapsible>
)
