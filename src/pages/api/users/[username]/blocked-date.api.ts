import { prisma } from '@app/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).end()

  const username = String(req.query.username)
  const { year, month } = req.query

  if (!year || !month)
    return res.status(400).json({ message: 'Year or Month not specified' })

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) return res.status(404).json({ message: 'User not found' })

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  })

  const listDays = [0, 1, 2, 3, 4, 5, 6]

  const blockedWeekDays = listDays.filter(
    (weekDay) =>
      !availableWeekDays.some(
        (availableWeekDay) => availableWeekDay.week_day === weekDay,
      ),
  )

  return res.status(200).json({ blockedWeekDays })
}
