"use client";
/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars */

import Link from "next/link";

import { LogOut, PanelLeft, Settings } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import links from "@/components/sidebar/sidedata";
import { usePathname } from "next/navigation";
import Logo from "../../../public/leaf.png";
import DynamicBreadcrumb from "@/components/dashboard/dynamicbread";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

export default function Control({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null; // or a loading spinner
  }
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F9FAEF]">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-36 flex-col border-r bg-background sm:flex">
        <TooltipProvider>
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5 w-full">
            <Link
              href="/control"
              className="group flex flex-col h-fit w-full shrink-0 items-center justify-center gap-2 ">
              <Image
                src={Logo}
                width={60}
                height={60}
                alt="logo"
              />
              <span className="text-lg font-bold text-[#91918B] ">
                EchoForest
              </span>
            </Link>
            {links.map(({ title, icon: Icon, link }) => {
              const isActive = pathname === link;

              return (
                <Tooltip key={link}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link}
                      className={`flex h-9 w-full items-center rounded-lg transition-colors px-4 text-sm ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-[#85976e] "
                      } md:h-8 md:w-full`}>
                      <Icon className="h-5 w-5" />
                      <span className="ml-2">{title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{title}</TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-full items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                  <Settings
                    className="h-5 w-5"
                    color="#91918B"
                  />
                  <span className="">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </nav>
        </TooltipProvider>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-36">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex flex-col h-fit w-full shrink-0 items-center justify-center gap-2 ">
                  <Image
                    src={Logo}
                    width={70}
                    height={70}
                    alt="logo"
                  />
                  <span className="text-lg font-bold text-[#91918B] ">
                    EchoForest
                  </span>
                </Link>
                {links.map(({ title, icon: Icon, link }) => {
                  const isActive = pathname === link;

                  return (
                    <Tooltip key={link}>
                      <TooltipTrigger asChild>
                        <Link
                          href={link}
                          className={`flex h-9 w-full items-center rounded-lg transition-colors px-4 text-sm ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-[#85976e] "
                          } md:h-8 md:w-full`}>
                          <Icon className="h-5 w-5" />
                          <span className="ml-2">{title}</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">{title}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
          <DynamicBreadcrumb />
          <div className="flex w-full justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-black px-3 py-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button variant={"destructive"}>
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 text-gray-800">
          {children}
        </main>
      </div>
    </div>
  );
}
