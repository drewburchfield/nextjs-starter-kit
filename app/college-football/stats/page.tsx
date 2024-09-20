import type { Metadata } from 'next'
import StatsTable from '@/components/college-football/stats-table'

export const metadata: Metadata = {
  title: 'College Football Stats',
  description: 'View detailed college football game statistics',
}

export default function CollegeFootballStatsPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2 px-4'>
      <h1 className='text-4xl font-bold mb-8'>College Football Stats</h1>
      <StatsTable />
    </div>
  )
}