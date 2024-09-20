import { UserProfile } from '@/components/user-profile'
import ModeToggle from '@/components/mode-toggle'

export default function DashboardTopNav() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <div className="flex items-center">
            <ModeToggle />
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  )
}
