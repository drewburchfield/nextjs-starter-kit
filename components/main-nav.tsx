import Link from 'next/link'

export function MainNav() {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Home
      </Link>
      <Link
        href="/college-football"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        College Football
      </Link>
      <Link
        href="/college-football/stats"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Football Stats
      </Link>
    </nav>
  )
}