"use client"

import React, { useState, useEffect } from 'react'
import { parseString } from 'xml2js'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Share2, Printer } from "lucide-react"
import VenueInfo from './venue-info'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TeamStats {
  totoff: [{ $: { plays: string, yards: string, avg: string } }]
  firstdowns: [{ $: { no: string, rush: string, pass: string, penalty: string } }]
  penalties: [{ $: { no: string, yds: string } }]
  conversions: [{ $: { thirdconv: string, thirdatt: string, fourthconv: string, fourthatt: string } }]
  fumbles: [{ $: { no: string, lost: string } }]
  misc: [{ $: { yds: string } }]
  redzone: [{ $: { att: string, scores: string, points: string, tdrush: string, tdpass: string, fgmade: string } }]
  rush: [{ $: { att: string, yds: string, gain: string, loss: string, td: string, long: string } }]
  pass: [{ $: { comp: string, att: string, int: string, yds: string, td: string, long: string, sacks: string, sackyds: string } }]
  rcv: [{ $: { no: string, yds: string, td: string, long: string } }]
  punt: [{ $: { no: string, yds: string, long: string, avg: string } }]
  ko: [{ $: { no: string, yds: string, ob: string, tb: string } }]
  fg: [{ $: { made: string, att: string, long: string, blkd: string } }]
  pat: [{ $: { kickatt: string, kickmade: string } }]
  defense: [{ $: { tackua: string, tacka: string, tot_tack: string, tflua: string, tfla: string, tflyds: string, sacks: string, sackyds: string } }]
  kr: [{ $: { no: string, yds: string, td: string, long: string } }]
  pr: [{ $: { no: string, yds: string, td: string, long: string } }]
  ir: [{ $: { no: string, yds: string, td: string, long: string } }]
  scoring: [{ $: { td: string, fg: string, patkick: string } }]
}

interface GameData {
  $: { source: string, version: string, generated: string }
  venue: [{ $: { gameid: string, visid: string, homeid: string, visname: string, homename: string, date: string, location: string, stadium: string, start: string, end: string, duration: string, attend: string, temp: string, wind: string, weather: string } }]
  team: Array<{
    $: { vh: string, name: string, id: string }
    linescore: [{ lineprd: Array<{ $: { score: string, prds: string } }> }]
    totals: [TeamStats]
    player: Array<{
      $: { name: string, shortname: string, uni: string, class: string, gp: string }
      passing?: [{ $: { [key: string]: string } }]
      rushing?: [{ $: { [key: string]: string } }]
      receiving?: [{ $: { [key: string]: string } }]
      defense?: [{ $: { [key: string]: string } }]
      pr?: [{ $: { [key: string]: string } }]
      kr?: [{ $: { [key: string]: string } }]
      fumbles?: [{ $: { [key: string]: string } }]
    }>
  }>
}

export default function StatsTable() {
  const [gameData, setGameData] = useState<GameData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/football-data')
        const xmlData = await response.text()
        parseString(xmlData, (err: Error | null, result: any) => {
          if (err) {
            console.error('Error parsing XML:', err)
            return
          }
          setGameData(result.fbgame)
        })
      } catch (error) {
        console.error('Error fetching XML data:', error)
      }
    }

    fetchData()
  }, [])

  const renderStatTable = (stats: TeamStats, team1: string, team2: string) => {
    const statCategories = [
      { name: 'First Downs', keys: ['firstdowns', '0', '$', 'no'] },
      { name: 'Rushing', keys: ['firstdowns', '0', '$', 'rush'] },
      { name: 'Passing', keys: ['firstdowns', '0', '$', 'pass'] },
      { name: 'Penalty', keys: ['firstdowns', '0', '$', 'penalty'] },
      { name: 'Rushing Attempts', keys: ['rush', '0', '$', 'att'] },
      { name: 'Rushing Yards', keys: ['rush', '0', '$', 'yds'] },
      { name: 'Passing Completions-Attempts', keys: ['pass', '0', '$', 'comp'], keys2: ['pass', '0', '$', 'att'] },
      { name: 'Passing Yards', keys: ['pass', '0', '$', 'yds'] },
      { name: 'Interceptions Thrown', keys: ['pass', '0', '$', 'int'] },
      { name: 'Total Offensive Plays', keys: ['totoff', '0', '$', 'plays'] },
      { name: 'Total Yards', keys: ['totoff', '0', '$', 'yards'] },
      { name: 'Fumbles-Lost', keys: ['fumbles', '0', '$', 'no'], keys2: ['fumbles', '0', '$', 'lost'] },
      { name: 'Penalties-Yards', keys: ['penalties', '0', '$', 'no'], keys2: ['penalties', '0', '$', 'yds'] },
      { name: 'Punts-Average', keys: ['punt', '0', '$', 'no'], keys2: ['punt', '0', '$', 'avg'] },
      { name: 'Third Down Conversions', keys: ['conversions', '0', '$', 'thirdconv'], keys2: ['conversions', '0', '$', 'thirdatt'] },
      { name: 'Fourth Down Conversions', keys: ['conversions', '0', '$', 'fourthconv'], keys2: ['conversions', '0', '$', 'fourthatt'] },
      { name: 'Time of Possession', keys: ['misc', '0', '$', 'top'] },
    ]

    const getValue = (team: TeamStats, keys: string[]): React.ReactNode => {
      const value = keys.reduce((obj: any, key) => obj && obj[key], team) as string;
      if (value === undefined || value === null || value === '' || value === 'N/A') {
        return <span className="text-red-500">0</span>;
      }
      return value;
    }

    return (
      <>
        <p className="text-sm text-gray-500 mb-2">Note: Data in <span className="text-red-500">red</span> indicates a value that was missing in the original data source.</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Statistic</TableHead>
              <TableHead>{team1}</TableHead>
              <TableHead>{team2}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statCategories.map((category) => (
              <TableRow key={category.name}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  {category.keys2 
                    ? <>{getValue(gameData!.team[0].totals[0], category.keys)}-{getValue(gameData!.team[0].totals[0], category.keys2)}</>
                    : getValue(gameData!.team[0].totals[0], category.keys)}
                </TableCell>
                <TableCell>
                  {category.keys2 
                    ? <>{getValue(gameData!.team[1].totals[0], category.keys)}-{getValue(gameData!.team[1].totals[0], category.keys2)}</>
                    : getValue(gameData!.team[1].totals[0], category.keys)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    )
  }

  const renderPlayerStats = (teamIndex: number) => {
    if (!gameData) return null

    const players = gameData.team[teamIndex].player.filter(player => player.$.name !== "TEAM")

    const offenseStatTypes = [
      { key: 'pass', headers: ['C/ATT', 'Pass YDS', 'Pass TD', 'PCT', 'LNG', 'SACKS'], longNames: ['Completions/Attempts', 'Passing Yards', 'Passing Touchdowns', 'Passing Percentage', 'Longest Pass', 'Sacks'] },
      { key: 'rush', headers: ['ATT', 'Rush YDS', 'AVG', 'Rush TD', 'LNG'], longNames: ['Attempts', 'Rushing Yards', 'Average', 'Rushing Touchdowns', 'Longest Rush'] },
      { key: 'rcv', headers: ['REC', 'Rec YDS', 'AVG', 'Rec TD', 'LNG'], longNames: ['Receptions', 'Receiving Yards', 'Average', 'Receiving Touchdowns', 'Longest Reception'] },
    ]

    const defenseStatTypes = [
      { key: 'defense', headers: ['TACKUA', 'TACKA', 'TOT_TACK', 'TFLUA', 'TFLA', 'SACKS', 'SACKYDS', 'FF', 'FR'], longNames: ['Tackles Unassisted', 'Tackles Assisted', 'Total Tackles', 'Tackles for Loss Unassisted', 'Tackles for Loss Assisted', 'Sacks', 'Sack Yards', 'Forced Fumbles', 'Fumble Recoveries'] },
      { key: 'int', headers: ['INT', 'YDS', 'TD', 'LNG'], longNames: ['Interceptions', 'Interception Yards', 'Interception Touchdowns', 'Longest Interception Return'] },
      { key: 'fumbles', headers: ['NO', 'LOST'], longNames: ['Number of Fumbles', 'Lost Fumbles'] },
    ]

    const fillEmptyValue = (value: string | undefined): React.ReactNode => {
      return value === undefined || value === null || value === '' || value === 'N/A' 
        ? <span className="text-red-500">0</span> 
        : value;
    }

    const formatPlayerName = (player: any) => {
      const nameParts = player.$.name.split(',');
      const lastName = nameParts[0].trim();
      const firstName = nameParts[1]?.trim() || '';
      const position = player.$.opos || player.$.dpos || '';
      return `${firstName} ${lastName} (${position})`;
    }

    const renderStatsTable = (players: any[], statTypes: typeof offenseStatTypes, title: string) => (
      <>
        <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
        <div className="relative">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                {statTypes.flatMap(type => type.headers.map(header => (
                  <Tooltip key={`${type.key}-${header}`}>
                    <TooltipTrigger asChild>
                      <TableHead>{header}</TableHead>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getFullStatName(header)}</p>
                    </TooltipContent>
                  </Tooltip>
                )))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map(player => (
                <TableRow key={player.$.name}>
                  <TableCell>{formatPlayerName(player)}</TableCell>
                  {statTypes.flatMap(type => {
                    const stats = player[type.key]?.[0].$
                    return type.headers.map(header => {
                      if (header === 'C/ATT' && type.key === 'pass') {
                        return <TableCell key={`${player.$.name}-${type.key}-${header}`}>
                          {stats ? `${stats.comp}/${stats.att}` : '-'}
                        </TableCell>
                      }
                      const statKey = header.toLowerCase().replace(/\s/g, '')
                      return <TableCell key={`${player.$.name}-${type.key}-${header}`}>
                        {stats ? fillEmptyValue(stats[statKey]) : '-'}
                      </TableCell>
                    })
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    )

    const getFullStatName = (shortName: string) => {
      const statNames: {[key: string]: string} = {
        'C/ATT': 'Completions/Attempts',
        'Pass YDS': 'Passing Yards',
        'Pass TD': 'Passing Touchdowns',
        'PCT': 'Passing Percentage',
        'LNG': 'Longest Pass',
        'SACKS': 'Sacks',
        'ATT': 'Rushing Attempts',
        'Rush YDS': 'Rushing Yards',
        'AVG': 'Average Yards per Attempt',
        'Rush TD': 'Rushing Touchdowns',
        'REC': 'Receptions',
        'Rec YDS': 'Receiving Yards',
        'Rec TD': 'Receiving Touchdowns',
        'TACKUA': 'Tackles (Unassisted)',
        'TACKA': 'Tackles (Assisted)',
        'TOT_TACK': 'Total Tackles',
        'TFLUA': 'Tackles for Loss (Unassisted)',
        'TFLA': 'Tackles for Loss (Assisted)',
        'SACKS': 'Sacks',
        'SACKYDS': 'Sack Yards',
        'FF': 'Forced Fumbles',
        'FR': 'Fumble Recoveries',
        'NO': 'Number of Fumbles',
        'LOST': 'Fumbles Lost'
      }
      return statNames[shortName] || shortName
    }

    const offensePlayers = players.filter(player => player.pass || player.rush || player.rcv)
    const defensePlayers = players.filter(player => player.defense || player.int || player.fumbles)

    return (
      <>
        <p className="text-sm text-gray-500 mb-2">Note: Data in <span className="text-red-500">red</span> indicates a value that was missing in the original data source.</p>
        {renderStatsTable(offensePlayers, offenseStatTypes, "Offense")}
        {renderStatsTable(defensePlayers, defenseStatTypes, "Defense")}
      </>
    )
  }

  const getTeamColor = (teamName: string) => {
    // This is a placeholder function. In a real scenario, you'd have a mapping of team names to colors.
    const colors = {
      "Southern Miss.": "#FFAB00",
      "Miami (FL)": "#F47321"
    }
    return colors[teamName as keyof typeof colors] || "#000000"
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${gameData?.team[0].$.name} vs ${gameData?.team[1].$.name} Game Recap`,
        url: window.location.href
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      alert("Share functionality not supported by your browser")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (!gameData) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
    <TooltipProvider>
      <div className='w-full max-w-7xl mx-auto px-4 py-8'>
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Game Recap</h1>
            <h2 className="text-2xl font-semibold text-gray-600">
              {gameData.team[0].$.name} vs {gameData.team[1].$.name}
            </h2>
          </div>
          <div className="flex space-x-4">
            <button onClick={handleShare} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
              <Share2 size={24} />
            </button>
            <button onClick={handlePrint} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
              <Printer size={24} />
            </button>
          </div>
        </header>

        <VenueInfo venue={gameData.venue[0].$} />

        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-gray-100">
            <CardTitle className="text-2xl">Final Score</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Team</TableHead>
                  {gameData.team[0].linescore[0].lineprd.map((_, index) => (
                    <TableHead key={index} className="text-center font-semibold">{index + 1}</TableHead>
                  ))}
                  <TableHead className="text-center font-semibold">Final</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gameData.team.map((team) => (
                  <TableRow key={team.$.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: getTeamColor(team.$.name)}}></div>
                        {team.$.name}
                      </div>
                    </TableCell>
                    {team.linescore[0].lineprd.map((prd, index) => (
                      <TableCell key={index} className="text-center">{prd.$.score}</TableCell>
                    ))}
                    <TableCell className="text-center font-bold">
                      {team.linescore[0].lineprd.reduce((acc, prd) => acc + parseInt(prd.$.score), 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Tabs defaultValue="team-stats" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="team-stats" className="text-lg">Team Stats</TabsTrigger>
            <TabsTrigger value="player-stats" className="text-lg">Player Stats</TabsTrigger>
          </TabsList>
          <TabsContent value="team-stats">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader className="bg-gray-100">
                  <CardTitle className="text-2xl">Team Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderStatTable(gameData.team[0].totals[0], gameData.team[0].$.name, gameData.team[1].$.name)}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="player-stats">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader className="bg-gray-100">
                  <CardTitle className="text-2xl">Player Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={gameData.team[0].$.name}>
                    <TabsList className="mb-4">
                      <TabsTrigger value={gameData.team[0].$.name}>{gameData.team[0].$.name}</TabsTrigger>
                      <TabsTrigger value={gameData.team[1].$.name}>{gameData.team[1].$.name}</TabsTrigger>
                    </TabsList>
                    <TabsContent value={gameData.team[0].$.name}>
                      {renderPlayerStats(0)}
                    </TabsContent>
                    <TabsContent value={gameData.team[1].$.name}>
                      {renderPlayerStats(1)}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}