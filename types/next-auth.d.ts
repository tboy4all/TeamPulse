// types/next-auth.d.ts

import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
    }
  }

  interface User extends DefaultUser {
    id: string
    password?: string | null
  }
}
