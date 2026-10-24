"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const definitionListVariants = cva("", {
  variants: {
    variant: {
      divided: "divide-y",
      plain: "space-y-1",
    },
  },
  defaultVariants: {
    variant: "divided",
  },
});

export interface DefinitionListProps
  extends HTMLAttributes<HTMLDListElement>,
    VariantProps<typeof definitionListVariants> {
  inset?: "none" | "lg";
}

export const DefinitionList = forwardRef<HTMLDListElement, DefinitionListProps>(
  function DefinitionList({ variant, inset = "none", className, ...rest }, ref) {
    return (
      <dl
        ref={ref}
        className={cn(definitionListVariants({ variant }), inset === "lg" && "px-5", className)}
        {...rest}
      />
    );
  }
);

export interface DefinitionItemProps {
  label: ReactNode;
  children: ReactNode;
  /** Width-bound the value so long strings wrap rather than push the label. */
  valueClassName?: string;
  className?: string;
}

export function DefinitionItem({
  label,
  children,
  valueClassName,
  className,
}: DefinitionItemProps) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-2 py-2.5 text-sm",
        className
      )}
    >
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "text-right font-medium text-foreground/90 max-w-[60%] break-words",
          valueClassName
        )}
      >
        {children}
      </dd>
    </div>
  );
}
