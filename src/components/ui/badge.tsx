import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-border bg-secondary text-secondary-foreground",
        outline: "border-border bg-background text-foreground",
        success: "",
        danger: "",
        info: "",
        warning: "",
        violet: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const badgeStyles: Partial<Record<NonNullable<VariantProps<typeof badgeVariants>["variant"]>, React.CSSProperties>> = {
  success: {
    borderColor: "color-mix(in oklab, var(--chart-2) 30%, var(--border))",
    backgroundColor: "color-mix(in oklab, var(--chart-2) 14%, var(--card))",
    color: "var(--chart-2)",
  },
  danger: {
    borderColor: "color-mix(in oklab, var(--chart-4) 30%, var(--border))",
    backgroundColor: "color-mix(in oklab, var(--chart-4) 14%, var(--card))",
    color: "var(--chart-4)",
  },
  info: {
    borderColor: "color-mix(in oklab, var(--chart-1) 30%, var(--border))",
    backgroundColor: "color-mix(in oklab, var(--chart-1) 14%, var(--card))",
    color: "var(--chart-1)",
  },
  warning: {
    borderColor: "color-mix(in oklab, var(--chart-3) 30%, var(--border))",
    backgroundColor: "color-mix(in oklab, var(--chart-3) 14%, var(--card))",
    color: "var(--chart-3)",
  },
  violet: {
    borderColor: "color-mix(in oklab, var(--chart-5) 30%, var(--border))",
    backgroundColor: "color-mix(in oklab, var(--chart-5) 14%, var(--card))",
    color: "var(--chart-5)",
  },
};

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof badgeVariants>) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} style={badgeStyles[variant ?? "default"]} {...props} />
  );
}

export { Badge, badgeVariants };
