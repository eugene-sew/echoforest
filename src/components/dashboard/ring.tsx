"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BellRing } from "lucide-react";

export default function Ring() {
  return (
    <Card className="max-w-xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Alerts</CardTitle>
        <BellRing className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex gap-4 p-4">
        <div className="grid items-center gap-2">
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
              8
              <span className="text-sm font-normal text-muted-foreground">
                Resolved
              </span>
            </div>
          </div>
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
              5
              <span className="text-sm font-normal text-muted-foreground">
                Pending
              </span>
            </div>
          </div>
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
              2
              <span className="text-sm font-normal text-muted-foreground">
                Active
              </span>
            </div>
          </div>
        </div>
        <ChartContainer
          config={{
            move: {
              label: "Inactive",
              color: "hsl(174, 56%, 83%)",
            },
            exercise: {
              label: "Pending",
              color: "hsl(176, 29%, 31%)",
            },
            stand: {
              label: "Active",
              color: "hsl(83, 98%, 32%)",
            },
          }}
          className="mx-auto aspect-square w-full max-w-[80%]">
          <RadialBarChart
            margin={{
              left: -10,
              right: -10,
              top: -10,
              bottom: -10,
            }}
            data={[
              {
                activity: "stand",
                value: (8 / 12) * 100,
                fill: "var(--color-stand)",
              },
              {
                activity: "exercise",
                value: (46 / 60) * 100,
                fill: "var(--color-exercise)",
              },
              {
                activity: "move",
                value: (245 / 360) * 100,
                fill: "var(--color-move)",
              },
            ]}
            innerRadius="20%"
            barSize={24}
            startAngle={90}
            endAngle={450}>
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              dataKey="value"
              tick={false}
            />
            <RadialBar
              dataKey="value"
              background
              cornerRadius={5}
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
