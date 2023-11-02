import { PrismaAdapter } from '@app/lib/auth/prisma-adapter'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export function buildNextAuthOptions(
  req: NextApiRequest,
  res: NextApiResponse,
): NextAuthOptions {
  return {
    // set your adapter here
    adapter: PrismaAdapter(req, res),
    // Configure one or more authentication providers
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        // Definindo escopos de acesso
        authorization: {
          params: {
            scope:
              'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          },
        },
      }),
      // ...add more providers here
    ],
    callbacks: {
      async signIn({ account /*, user, profile, email, credentials */ }) {
        const hasCalendarScope = account?.scope?.includes(
          'https://www.googleapis.com/auth/calendar',
        )
        if (!hasCalendarScope) {
          return '/register/connect-calendar/?error=permissions'
        }

        return true
      },
    },
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, buildNextAuthOptions(req, res))
}
