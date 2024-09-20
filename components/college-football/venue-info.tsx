import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface VenueInfoProps {
  venue: {
    gameid: string
    visid: string
    homeid: string
    visname: string
    homename: string
    date: string
    location: string
    stadium: string
    start: string
    end: string
    duration: string
    attend: string
    temp: string
    wind: string
    weather: string
  }
}

export default function VenueInfo({ venue }: VenueInfoProps) {
  return (
    <Card className='mb-8'>
      <CardHeader className="bg-gray-100">
        <CardTitle className="text-2xl">Game Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div>
          <p className="mb-2"><span className="font-semibold">Teams:</span> {venue.visname} @ {venue.homename}</p>
          <p className="mb-2"><span className="font-semibold">Date:</span> {venue.date}</p>
          <p className="mb-2"><span className="font-semibold">Location:</span> {venue.stadium}, {venue.location}</p>
          <p className="mb-2"><span className="font-semibold">Start Time:</span> {venue.start}</p>
        </div>
        <div>
          <p className="mb-2"><span className="font-semibold">Duration:</span> {venue.duration}</p>
          <p className="mb-2"><span className="font-semibold">Attendance:</span> {venue.attend}</p>
          <p className="mb-2"><span className="font-semibold">Weather:</span> {venue.temp}°F, {venue.wind}, {venue.weather}</p>
        </div>
      </CardContent>
    </Card>
  )
}