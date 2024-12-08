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

interface PageLayoutProps {
  children: React.ReactNode
}
export function PageLayout({ children }: PageLayoutProps) {
  const [breadcrumbs] = useBreadcrumb();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className=" h-4" />
            { breadcrumbs && <AppBreadcrumb items={ breadcrumbs } /> }
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        { children }
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  )
}
