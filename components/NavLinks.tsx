'use client'

import Link from 'next/link'
import classnames from 'classnames'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

const NavLinks = () => {
  const currentPath = usePathname()
  const { status } = useSession()

  if (status === 'loading' || status === 'unauthenticated') return null

  const links = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Trends', href: '/sentiment-trends' },
    { label: 'Admin Settings', href: '/admin/settings' },
  ]

  return (
    <ul className='flex space-x-6'>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={classnames('nav-link', {
              '!text-zinc-900': link.href === currentPath,
            })}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default NavLinks
