import { Outlet } from 'react-router-dom'

import { AppSidebar } from '@/widgets/app-sidebar'

export function DashboardLayout() {
  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <AppSidebar />
      <Outlet />
    </div>
  )
}
