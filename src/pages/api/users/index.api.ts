import { prisma } from '@app/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'

type Data = {
  name: string
  username: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, username } = req.body as Data

  const userExists = await prisma.user.findUnique({
    where: { username },
  })

  if (userExists)
    return res.status(409).json({ message: 'User already exists' })

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  setCookie({ res }, '@devlife:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
  })

  return res.status(201).json(user)
}
