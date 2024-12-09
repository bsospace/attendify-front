"use client"

import * as React from "react"
import {
    House,
    Monitor,
    CalendarDays,
    SquareChartGantt,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/constants";
import { config } from "@/server/config";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarMenuButton
} from "@/components/ui/sidebar";

import { useAuth } from "@/hooks/useAuth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const { user } = useAuth();

    const menu = [
        {
            title: "Home",
            url: ROUTES.HOME,
            icon: House,
        },
        {
            title: "Calendar",
            url: ROUTES.CALENDAR,
            icon: CalendarDays,
        },
        {
            title: "My Activities",
            url: ROUTES.ACTIVITY.ME,
            icon: SquareChartGantt,
        },
        {
            title: "Managements",
            icon: Monitor,
            isActive: true,
            url: "#",
            items: [
                {
                    title: "Projects",
                    url: ROUTES.PROJECT.BASE,
                },
                {
                    title: "Users",
                    url: ROUTES.USER.BASE,
                },
                {
                    title: "Groups",
                    url: ROUTES.GROUP.BASE,
                },
                {
                    title: "Locations",
                    url: ROUTES.LOCATION.BASE,
                },
            ],
        },
    ]

    return (
        <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
            <Link to={ROUTES.HOME} className="text-xl font-bold flex mt-2 items-center">
            <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                <div className="flex aspect-square size-8 items-center justify-center">
                    <img src={config.appLogo} alt={config.appName} className="rounded-lg"/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                        {config.appName}
                    </span>
                </div>
            </SidebarMenuButton>
            </Link>
        </SidebarHeader>
        <SidebarContent>
            <NavMain items={menu} />
        </SidebarContent>
        <SidebarFooter>
            <NavUser user={user} />
        </SidebarFooter>
        <SidebarRail />
        </Sidebar>
    )
}