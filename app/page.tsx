import Link from 'next/link'

// import { Link } from './components'

export default function Home() {
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
