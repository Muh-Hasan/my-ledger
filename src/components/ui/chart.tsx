"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    color?: string;
  };
};

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/60 [&_.recharts-polar-grid_line]:stroke-border/60 [&_.recharts-reference-line_line]:stroke-border/60 [&_.recharts-sector:focus-visible]:outline-none [&_.recharts-tooltip-cursor]:stroke-border",
          className
        )}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: Object.entries(config)
              .filter(([, itemConfig]) => itemConfig.color)
              .map(
                ([key, itemConfig]) =>
                  `[data-chart=${chartId}] { --color-${key}: ${itemConfig.color}; }`
              )
              .join("\n"),
          }}
        />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartTooltip({
  active,
  payload,
  className,
  indicator = "dot",
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> & {
  indicator?: "dot" | "line";
}) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "grid min-w-40 gap-2 rounded-2xl border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-xl backdrop-blur",
        className
      )}
    >
      {payload.map((item) => {
        const key = `${item.dataKey || item.name || "value"}`;
        const itemConfig = config[key];

        return (
          <div key={key} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={cn("shrink-0 rounded-full", indicator === "dot" ? "size-2.5" : "h-2 w-5")}
                style={{ background: item.color || item.payload.fill }}
              />
              <span>{itemConfig?.label || item.name}</span>
            </div>
            <span className="font-medium text-foreground">
              {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ChartTooltipContent(props: React.ComponentProps<typeof ChartTooltip>) {
  return <ChartTooltip {...props} />;
}

function ChartLegend({
  className,
  payload,
}: React.ComponentProps<typeof RechartsPrimitive.Legend>) {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-4 pt-3", className)}>
      {payload.map((item) => {
        const key = `${item.dataKey || "value"}`;
        const itemConfig = config[key];

        return (
          <div key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{itemConfig?.label || item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

function ChartLegendContent(props: React.ComponentProps<typeof ChartLegend>) {
  return <ChartLegend {...props} />;
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
};
