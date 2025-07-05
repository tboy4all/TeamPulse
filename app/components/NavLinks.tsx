'use client'

import Link from 'next/link'
import classnames from 'classnames'
import { usePathname } from 'next/navigation'

const NavLinks = () => {
  const currentPath = usePathname()

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
            className={classnames({
              'nav-link': true,
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
