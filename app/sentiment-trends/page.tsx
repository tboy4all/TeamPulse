'use client'

import React, { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import dayjs from 'dayjs'

type TeamName = 'Engineering' | 'Marketing' | 'Sales'

type SentimentDataPoint = {
  date: string
  score: number
}

type TeamSentimentData = Record<TeamName, SentimentDataPoint[]>

const generateLast7Days = () => {
  return Array.from({ length: 7 }).map((_, i) => {
    return dayjs()
      .subtract(6 - i, 'day')
      .format('YYYY-MM-DD')
  })
}

const last7Days = generateLast7Days()

const mockData: TeamSentimentData = {
  Engineering: last7Days.map((date, idx) => ({
    date,
    score: 0.2 + 0.1 * (idx % 3), // mock fluctuation
  })),
  Marketing: last7Days.map((date, idx) => ({
    date,
    score: -0.3 + 0.1 * (idx % 4),
  })),
  Sales: last7Days.map((date, idx) => ({
    date,
    score: 0.0 + 0.05 * ((idx % 5) - 2),
  })),
}

const SentimentTrendsPage = () => {
  const [selectedTeam, setSelectedTeam] = useState<'All' | TeamName>('All')

  const allTeams: TeamName[] = ['Engineering', 'Marketing', 'Sales']

  const combinedData = last7Days.map((date, i) => {
    const entry: { date: string } & Partial<Record<TeamName, number>> = { date }

    allTeams.forEach((team) => {
      entry[team] = mockData[team][i].score
    })

    return entry
  })

  const filteredData =
    selectedTeam === 'All'
      ? combinedData
      : mockData[selectedTeam].map((d) => ({
          date: d.date,
          [selectedTeam]: d.score,
        }))

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>
        Sentiment Trends (Last 7 Days)
      </h1>

      <select
        className='border px-3 py-2 rounded mb-6'
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value as 'All' | TeamName)}
      >
        <option value='All'>All Teams</option>
        {allTeams.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>

      <ResponsiveContainer width='100%' height={400}>
        <LineChart
          data={filteredData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis domain={[-1, 1]} />
          <Tooltip />
          <Legend />
          {selectedTeam === 'All' ? (
            allTeams.map((team, idx) => (
              <Line
                key={team}
                type='monotone'
                dataKey={team}
                stroke={['#8884d8', '#82ca9d', '#ffc658'][idx % 3]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={500}
              />
            ))
          ) : (
            <Line
              type='monotone'
              dataKey={selectedTeam}
              stroke='#8884d8'
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={500}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SentimentTrendsPage
