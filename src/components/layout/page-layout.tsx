import { AppSidebar } from "@/components/app-sidebar"
import { AppBreadcrumb } from "@/components/app-breadcrumbs";
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Footer } from "./footer"
import { useBreadcrumb } from "@/providers/breadcrumb-provider";
import { NavBottom } from "@/components/nav-bottom"

interface PageLayoutProps {
  children: React.ReactNode
}
export function PageLayout({ children }: PageLayoutProps) {
  const [breadcrumbs] = useBreadcrumb();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex lg:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 h-4">
          <div className="lg:flex items-center gap-2 px-4 hidden">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className=" h-4" />
            { breadcrumbs && <AppBreadcrumb items={ breadcrumbs } /> }
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        { children }
        </div>
        <div className="lg:block hidden">
          <Footer />
        </div>
        <div className="lg:hidden sticky bottom-0 h-16 z-50">
          <NavBottom />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
