import type { Metadata } from 'next'
import CollegeFootballGame from '@/components/college-football/game'

export const metadata: Metadata = {
  title: 'College Football Game Data',
  description: 'View and analyze college football game data',
}

export default function CollegeFootballPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-4xl font-bold mb-8'>College Football Game Data</h1>
      <CollegeFootballGame />
    </div>
  )
}