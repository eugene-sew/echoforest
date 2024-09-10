/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, BellRing, Workflow, Router } from "lucide-react";

interface SideLink {
  title: string;
  icon: any;
  link: string;
}

const links: SideLink[] = [
  {
    title: "Overview",
    icon: Component,
    link: "/control",
  },
  {
    title: "Alerts",
    icon: BellRing,
    link: "/control/alerts",
  },
  {
    title: "Deploy",
    icon: Workflow,
    link: "/control/deploy",
  },
  {
    title: "Devices",
    icon: Router,
    link: "/control/devices",
  },
  // {
  //   title: "Geo-Fence",
  //   icon: GlobeLock,
  //   link: "control/geofence",
  // },
  //   {
  //     title: "Account",
  //     icon: MdManageAccounts,
  //     link: "/account",
  //   },
];

export default links;
