'use client'

import NextLink from 'next/link'
import { Link as RadixLink } from '@radix-ui/themes'
import { ComponentPropsWithoutRef } from 'react'

interface Props extends ComponentPropsWithoutRef<'a'> {
  href: string
}

const Link = ({ href, children, ...rest }: Props) => {
  return (
    <RadixLink asChild>
      <NextLink href={href} {...rest}>
        {children}
      </NextLink>
    </RadixLink>
  )
}

export default Link
