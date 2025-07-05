'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { ErrorMessage, Spinner } from '@/app/components'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('Invalid credentials.')
      setIsLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className='max-w-md mx-auto mt-20 border p-6 rounded-md shadow-md '>
      <h2 className='text-2xl font-bold mb-6 text-center'>TeamPulse Login</h2>

      <ErrorMessage>{error}</ErrorMessage>

      <form onSubmit={handleCredentialsLogin} className='space-y-4'>
        <input
          type='email'
          placeholder='Email'
          className='w-full border p-2 rounded'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Password'
          className='w-full border p-2 rounded'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type='submit'
          className='w-full bg-violet-600 text-white py-2 rounded flex justify-center items-center gap-2 cursor-pointer'
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner />
              Signing in...
            </>
          ) : (
            'Sign in with Email'
          )}
        </button>
      </form>

      <hr className='my-6' />

      <button
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        className='w-full border py-2 flex items-center justify-center rounded hover:bg-gray-50 cursor-pointer gap-2'
      >
        <FcGoogle className='text-xl' />
        Sign in with Google
      </button>
    </div>
  )
}
