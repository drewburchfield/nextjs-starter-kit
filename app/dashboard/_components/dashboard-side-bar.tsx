import Link from 'next/link'
import { HomeIcon, Folder, Banknote, Settings } from 'lucide-react'

export default function DashboardSideBar() {
  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <nav className="flex-1 space-y-1 bg-white dark:bg-gray-800">
          <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <HomeIcon className="mr-3 h-6 w-6" />
            Dashboard
          </Link>
          <Link href="/dashboard/projects" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <Folder className="mr-3 h-6 w-6" />
            Projects
          </Link>
          <Link href="/dashboard/finance" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <Banknote className="mr-3 h-6 w-6" />
            Finance
          </Link>
          <Link href="/dashboard/settings" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <Settings className="mr-3 h-6 w-6" />
            Settings
          </Link>
        </nav>
      </div>
    </aside>
  )
}
