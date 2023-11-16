import { PrismaAdapter } from '@app/lib/auth/prisma-adapter'
import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

export function buildNextAuthOptions(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res'],
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
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',

            scope:
              'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          },
        },
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            name: profile.name,
            username: '', // como o username será associado ao username do banco de dados, não é necessário passar ele aqui
            email: profile.email,
            avatar_url: profile.picture,
          }
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
      async session({ session, user }) {
        return {
          ...session,
          user,
        }
      },
    },
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, buildNextAuthOptions(req, res))
}
