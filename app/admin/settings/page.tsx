'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import Spinner from '@/app/components/Spinner'
import ErrorMessage from '@/app/components/ErrorMessage'

const SettingsSchema = z.object({
  checkInsEnabled: z.boolean(),
  checkInFrequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
})

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [checkInsEnabled, setCheckInsEnabled] = useState(false)
  const [checkInFrequency, setCheckInFrequency] = useState('WEEKLY')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        if (!res.ok) throw new Error('Failed to fetch settings')
        const data = await res.json()
        setCheckInsEnabled(data.checkInsEnabled)
        setCheckInFrequency(data.checkInFrequency)
      } catch (err: any) {
        setError(err.message || 'Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async () => {
    setError('')
    setSuccess('')
    setSaving(true)

    const formData = {
      checkInsEnabled,
      checkInFrequency,
    }

    const validation = SettingsSchema.safeParse(formData)

    if (!validation.success) {
      setError('❌ Invalid settings. Please check your inputs.')
      setSaving(false)
      return
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validation.data),
      })

      if (!res.ok) throw new Error('Failed to update settings')

      setSuccess('✅ Settings updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className='mt-10 text-center'>Loading settings...</p>

  return (
    <div className='max-w-xl mx-auto mt-10 space-y-6'>
      <h1 className='text-2xl font-bold'>Admin Settings</h1>

      <div className='space-y-4'>
        <label className='flex items-center gap-3'>
          <input
            type='checkbox'
            checked={checkInsEnabled}
            onChange={(e) => setCheckInsEnabled(e.target.checked)}
            className='w-4 h-4'
          />
          <span>Enable Check-ins</span>
        </label>

        <label>
          <span className='block mb-1 font-medium'>Check-in Frequency</span>
          <select
            value={checkInFrequency}
            onChange={(e) => setCheckInFrequency(e.target.value)}
            className='border px-3 py-2 rounded w-full'
          >
            <option value='DAILY'>Daily</option>
            <option value='WEEKLY'>Weekly</option>
            <option value='MONTHLY'>Monthly</option>
          </select>
        </label>
      </div>

      <button
        onClick={handleSave}
        className={`bg-violet-600 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-violet-700 disabled:opacity-60 cursor-pointer`}
        disabled={saving}
      >
        {saving && <Spinner />}
        {saving ? 'Saving...' : 'Save Settings'}
      </button>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <p className='text-green-600 text-sm'>{success}</p>}
    </div>
  )
}
