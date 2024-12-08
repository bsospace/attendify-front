import { Link } from "react-router-dom"
import {
    House,
    CircleUser,
    CalendarDays,
    SquareChartGantt,
    ScanLine
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

export function NavBottom() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-14 w-full items-center justify-around bg-background shadow-[0_-2px_4px_rgba(0,0,0,0.1)] md:h-16 pt-2">
        <Link
            to={ROUTES.HOME}
            className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary focus:text-primary"
        >
            <House className="h-6 w-6 hover:scale-110 ease-in-out duration-75" />
            Home
        </Link>
        <Link
            to={ROUTES.CALENDAR}
            className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary focus:text-primary"
        >
            <CalendarDays className="h-6 w-6 hover:scale-110 ease-in-out duration-75" />
            Calendar
        </Link>
        <Link
            to={ROUTES.SCAN}
            className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary focus:text-primary -translate-y-4"
        >
            <div className=" flex rounded-full h-14 w-14 bg-slate-200 justify-center items-center">
                <ScanLine className="h-8 w-8 hover:scale-110 ease-in-out duration-75" />
            </div>
            Scan
        </Link>
        <Link
            to={ROUTES.ACTIVITY.ME}
            className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary focus:text-primary"
        >
            
            <SquareChartGantt className="h-6 w-6 hover:scale-110 ease-in-out duration-75" />
            Activities
        </Link>
        <Link
            to={ROUTES.PROFILE}
            className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary focus:text-primary"
        >
            <CircleUser className="h-6 w-6 hover:scale-110 ease-in-out duration-75" />
            Profile
        </Link>
        </nav>
    )
}