'use client'

import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button' // If you're using shadcn; otherwise use a regular <button>

export default function Home() {
  const { status } = useSession()

  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p>Loading...</p>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className='min-h-screen flex flex-col justify-center items-center bg-white dark:bg-black px-4 text-center'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
          You have to sign in to access this page
        </h1>
        <p className='text-gray-600 dark:text-gray-300 max-w-md mb-6'>
          Please log in to continue to the TeamPulse dashboard and start
          tracking your team's sentiment.
        </p>
        <Button
          onClick={() => signIn()}
          className='bg-violet-600 text-white px-6 py-3 rounded hover:bg-violet-700 transition-colors font-semibold cursor-pointer'
        >
          Sign in now
        </Button>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-white dark:bg-black px-4 text-center'>
      <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
        Welcome to TeamPulse
      </h1>
      <p className='text-gray-600 dark:text-gray-300 max-w-xl mb-8'>
        Track how your team feels, monitor sentiment trends, and make informed
        decisions.
      </p>
      <Link
        href='/dashboard'
        className='bg-violet-600 text-white px-6 py-3 rounded hover:bg-violet-700 transition-colors font-semibold'
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
