import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <SidebarTrigger />
            <h1 className="ml-4 text-xl font-bold">Dashboard</h1>
          </div>
          <ModeToggle />
        </div>
        <div className="p-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
