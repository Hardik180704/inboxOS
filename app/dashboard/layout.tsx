import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex items-center p-4 border-b">
          <SidebarTrigger />
          <h1 className="ml-4 text-xl font-bold">Dashboard</h1>
        </div>
        <div className="p-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
