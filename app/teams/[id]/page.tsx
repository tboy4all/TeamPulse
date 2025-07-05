'use client'

import ErrorMessage from '@/components/ErrorMessage'
import Spinner from '@/components/Spinner'
import Pagination from '@/components/Pagination'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Sentiment = 'HAPPY' | 'NEUTRAL' | 'SAD'

interface Member {
  id: string
  name: string
  email: string
  sentiment: Sentiment
}

const PAGE_SIZE = 10

export default function TeamDetailsPage() {
  const { id: teamId } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    sentiment: 'NEUTRAL',
  })
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // ✅ Calculate average sentiment
  const getAverageSentiment = (members: Member[]) => {
    if (!members.length) return 'N/A'

    const scores: Record<Sentiment, number> = {
      HAPPY: 2,
      NEUTRAL: 1,
      SAD: 0,
    }

    const avg =
      members.reduce((sum, m) => sum + scores[m.sentiment], 0) / members.length

    if (avg >= 1.5) return '😊 Happy'
    if (avg >= 0.5) return '😐 Neutral'
    return '😞 Sad'
  }

  // Sync page with URL
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1')
    setCurrentPage(isNaN(page) ? 1 : page)
  }, [searchParams])

  const fetchMembers = async () => {
    setLoading(true)
    const res = await fetch(`/api/teams/${teamId}/members`)
    const data = await res.json()
    setMembers(data)
    setLoading(false)
  }

  useEffect(() => {
    if (teamId) fetchMembers()
  }, [teamId])

  useEffect(() => {
    const filtered = members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredMembers(filtered)
  }, [searchTerm, members])

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')

    const res = await fetch(`/api/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify(newMember),
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Error adding member.')
    } else {
      setNewMember({ name: '', email: '', sentiment: 'NEUTRAL' })
      fetchMembers()
    }

    setFormLoading(false)
  }

  const updateSentiment = async (userId: string, sentiment: Sentiment) => {
    await fetch(`/api/teams/${teamId}/members`, {
      method: 'PATCH',
      body: JSON.stringify({ userId, sentiment, teamId }),
      headers: { 'Content-Type': 'application/json' },
    })
    fetchMembers()
  }

  const removeMember = async (userId: string) => {
    await fetch(`/api/teams/${teamId}/members`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
      headers: { 'Content-Type': 'application/json' },
    })
    fetchMembers()
  }

  // Pagination logic
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedMembers = filteredMembers.slice(
    startIndex,
    startIndex + PAGE_SIZE
  )

  return (
    <div className='space-y-6'>
      <button
        onClick={() => router.push('/dashboard')}
        className='flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition cursor-pointer'
      >
        <ArrowLeftIcon />
        Back to Dashboard
      </button>

      <h1 className='text-2xl font-bold flex items-center gap-4'>
        Team Members
        <span className='text-sm font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded'>
          Average Sentiment: {getAverageSentiment(members)}
        </span>
      </h1>

      <form
        onSubmit={handleAddMember}
        className='flex flex-col md:flex-row items-center gap-2'
      >
        <input
          type='text'
          placeholder='Name'
          className='border px-3 py-2 rounded w-full md:w-1/4'
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          required
        />
        <input
          type='email'
          placeholder='Email'
          className='border px-3 py-2 rounded w-full md:w-1/4'
          value={newMember.email}
          onChange={(e) =>
            setNewMember({ ...newMember, email: e.target.value })
          }
          required
        />
        <select
          value={newMember.sentiment}
          onChange={(e) =>
            setNewMember({
              ...newMember,
              sentiment: e.target.value as Sentiment,
            })
          }
          className='border px-3 py-2 rounded w-full md:w-1/4'
        >
          <option value='HAPPY'>😊 Happy</option>
          <option value='NEUTRAL'>😐 Neutral</option>
          <option value='SAD'>😞 Sad</option>
        </select>
        <button
          type='submit'
          className='bg-violet-600 text-white px-4 py-2 rounded cursor-pointer'
          disabled={formLoading}
        >
          {formLoading ? <Spinner /> : 'Add Member'}
        </button>
      </form>

      <ErrorMessage>{error}</ErrorMessage>

      <input
        type='text'
        placeholder='Search members'
        className='border px-3 py-2 rounded w-full md:w-1/2'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <div className='flex justify-center mt-10'>
          <Spinner />
        </div>
      ) : paginatedMembers.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <>
          <ul className='space-y-4'>
            {paginatedMembers.map((member) => (
              <li
                key={member.id}
                className='border p-4 rounded shadow-sm flex justify-between items-center'
              >
                <div>
                  <p className='font-semibold'>{member.name}</p>
                  <p className='text-sm text-gray-500'>{member.email}</p>
                  <p className='text-sm mt-1'>
                    Sentiment:{' '}
                    <select
                      value={member.sentiment}
                      onChange={(e) =>
                        updateSentiment(member.id, e.target.value as Sentiment)
                      }
                      className='ml-2 border px-2 py-1 rounded'
                    >
                      <option value='HAPPY'>😊 Happy</option>
                      <option value='NEUTRAL'>😐 Neutral</option>
                      <option value='SAD'>😞 Sad</option>
                    </select>
                  </p>
                </div>
                <button
                  onClick={() => removeMember(member.id)}
                  className='text-sm text-red-500 hover:underline cursor-pointer flex items-center gap-1'
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <Pagination
            itemCount={filteredMembers.length}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
          />
        </>
      )}
    </div>
  )
}
