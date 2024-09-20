"use client"

import React, { useState } from 'react'
import { parseString } from 'xml2js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import VenueInfo from './venue-info'
import TeamStats from './team-stats'
import PlayerStats from './player-stats'
import Scores from './scores'
import Drives from './drives'

interface GameData {
  venue: Array<{ $: any }>
  team: any[]
  scores: Array<{ score: any[] }>
  drives: Array<{ drive: any[] }>
}

export default function CollegeFootballGame() {
  const [gameData, setGameData] = useState<GameData | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const xml = e.target?.result as string
        parseString(xml, (err: Error | null, result: any) => {
          if (err) {
            console.error('Error parsing XML:', err)
            return
          }
          setGameData(result.fbgame)
        })
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className='w-full max-w-4xl'>
      <input
        type="file"
        accept=".xml"
        onChange={handleFileUpload}
        className='mb-4'
      />
      {gameData && (
        <Card>
          <CardHeader>
            <CardTitle>Game Data</CardTitle>
          </CardHeader>
          <CardContent>
            <VenueInfo venue={gameData.venue[0].$} />
            <TeamStats teams={gameData.team} />
            <PlayerStats teams={gameData.team} />
            <Scores scores={gameData.scores[0].score} />
            <Drives drives={gameData.drives[0].drive} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}