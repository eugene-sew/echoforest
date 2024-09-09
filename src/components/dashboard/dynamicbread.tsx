import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb"; // Adjust import path

const DynamicBreadcrumb = () => {
  const pathname = usePathname();

  // Split the path into an array of segments
  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment.length > 0); // Filter out empty segments
  // Print the segments
  console.log("Path segments:", pathSegments);

  return (
    <Breadcrumb className="hidden md:flex w-full">
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          // Create the path for each segment (e.g., /control/alerts)
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1; // Check if it's the last item

          return (
            <BreadcrumbItem key={index}>
              {!isLast ? (
                <BreadcrumbLink asChild>
                  <Link href={href}>
                    {segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <span>
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </span> // Don't render link for the last item
              )}
              {!isLast && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
