'use client'

import { Skeleton } from '@/app/components'
import Link from 'next/link'
import React from 'react'
import { AiFillBug } from 'react-icons/ai'
import { signOut, useSession } from 'next-auth/react'
import { Avatar, Container, Flex } from '@radix-ui/themes'
import NavLinks from './components/NavLinks'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

const NavBar = () => {
  return (
    <nav className='border-b mb-5 py-3 px-5'>
      <Container>
        <Flex justify='between'>
          <Flex align='center' gap='3'>
            <Link href='/'>
              <AiFillBug />
            </Link>
            <NavLinks />
          </Flex>
          <AuthStatus />
        </Flex>
      </Container>
    </nav>
  )
}

const AuthStatus = () => {
  const { status, data: session } = useSession()

  if (status === 'loading') return <Skeleton width='3rem' />

  if (status === 'unauthenticated') {
    return (
      <Link className='nav-link' href='/login'>
        Login
      </Link>
    )
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button>
          <Avatar
            src={session!.user!.image || undefined}
            fallback={session!.user.name?.[0] || '?'}
            size='2'
            radius='full'
            className='cursor-pointer'
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className='z-[9999] bg-white border border-gray-200 rounded-md shadow-md px-4 py-2'
          sideOffset={5}
        >
          <DropdownMenu.Label className='text-sm text-gray-700 mb-2'>
            {session!.user.email}
          </DropdownMenu.Label>
          <DropdownMenu.Item
            className='text-sm text-red-600 cursor-pointer hover:bg-gray-50 rounded px-2 py-1'
            onSelect={() => signOut({ callbackUrl: '/login' })}
          >
            Logout
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default NavBar
