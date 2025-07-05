'use client'

import { useEffect, useState } from 'react'
import { Spinner, SentimentBadge, ErrorMessage, Link } from '@/app/components'

interface Team {
  id: string
  name: string
  sentimentScore: string
}

export default function DashboardPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [newTeam, setNewTeam] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchTeams = async () => {
    const res = await fetch('/api/teams')
    const data = await res.json()
    setTeams(data)
  }

  useEffect(() => {
    fetchTeams().then(() => setLoading(false))
  }, [])

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFormLoading(true)

    const res = await fetch('/api/teams', {
      method: 'POST',
      body: JSON.stringify({ name: newTeam }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Something went wrong.')
    } else {
      setNewTeam('')
      await fetchTeams()
    }

    setFormLoading(false)
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center mt-10'>
        <Spinner />
        <span className='ml-2'>Loading teams...</span>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Team Overview</h1>

      <form onSubmit={handleAddTeam} className='flex gap-2 items-center'>
        <input
          type='text'
          placeholder='New team name'
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
          className='border px-3 py-2 rounded w-full max-w-xs'
          required
        />
        <button
          type='submit'
          disabled={formLoading}
          className='bg-violet-600 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2'
        >
          {formLoading ? <Spinner /> : 'Add Team'}
        </button>
      </form>

      <ErrorMessage>{error}</ErrorMessage>

      {teams.length === 0 ? (
        <p>No teams found.</p>
      ) : (
        <ul className='grid gap-4 md:grid-cols-2'>
          {teams.map((team) => (
            <li
              key={team.id}
              className='border p-4 rounded shadow-sm hover:shadow-md transition'
            >
              <h2 className='font-semibold text-lg'>{team.name}</h2>
              <p className='text-sm text-gray-600 mt-1'>
                Sentiment:{' '}
                <SentimentBadge score={parseFloat(team.sentimentScore)} />
                <span className='ml-1 text-xs text-gray-400'>
                  ({team.sentimentScore})
                </span>
              </p>

              <Link
                href={`/teams/${team.id}`}
                className='mt-4 inline-block text-sm text-violet-600 hover:underline'
              >
                Manage Members →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
