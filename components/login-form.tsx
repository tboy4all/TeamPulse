'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Spinner from '@/components/Spinner'
import ErrorMessage from '@/components/ErrorMessage'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('Invalid credentials.')
      setIsLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div className={cn('flex flex-col gap-6 max-w-md mx-auto mt-16')}>
      <Card className='overflow-hidden p-0 shadow-md'>
        <CardContent className='grid p-0 '>
          <form onSubmit={handleCredentialsLogin} className='p-6 md:p-8 w-full'>
            <div className='flex flex-col gap-6'>
              <div className='text-center'>
                <h1 className='text-2xl font-bold'>TeamPulse Login</h1>
                <p className='text-sm text-muted-foreground mt-1'>
                  Sign in to manage your teams
                </p>
              </div>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <div className='grid gap-3 w-full'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='you@example.com'
                  required
                />
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type='submit'
                className='w-full cursor-pointer'
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
              </Button>

              <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                <span className='bg-card text-muted-foreground relative z-10 px-2'>
                  Or continue with
                </span>
              </div>

              <Button
                type='button'
                variant='outline'
                className='w-full flex items-center justify-center gap-2 cursor-pointer'
                onClick={() => signIn('google', { callbackUrl: '/' })}
              >
                <FcGoogle className='text-xl' />
                Sign in with Google
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className='text-muted-foreground text-center text-xs'>
        By signing in, you agree to our{' '}
        <a href='#' className='underline underline-offset-4'>
          Terms of Service
        </a>{' '}
        and{' '}
        <a href='#' className='underline underline-offset-4'>
          Privacy Policy
        </a>
        .
      </div>
    </div>
  )
}
