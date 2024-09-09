import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardCardProps {
  ci: string;
  title: string;
  icon: ReactNode;
  value: string | number;
  description: string;
  isLoading?: boolean;
}

export function DashboardCard({
  ci,
  title,
  icon,
  value,
  description,
  isLoading = false,
}: DashboardCardProps) {
  return (
    <Card x-chunk={`dashboard-01-chunk-${ci}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {isLoading ? <Skeleton className="h-4 w-24" /> : title}
        </CardTitle>
        {isLoading ? <Skeleton className="h-4 w-4" /> : icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? <Skeleton className="h-8 w-20" /> : value}
        </div>
        <p className="text-xs text-muted-foreground">
          {isLoading ? <Skeleton className="h-3 w-32" /> : description}
        </p>
      </CardContent>
    </Card>
  );
}
