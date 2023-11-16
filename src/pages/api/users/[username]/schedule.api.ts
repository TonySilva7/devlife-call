import { getGoogleOAuthToken } from '@app/lib/google'
import { prisma } from '@app/lib/prisma'
import dayjs from 'dayjs'
import { google } from 'googleapis'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end()

  const username = String(req.query.username)

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) return res.status(404).json({ message: 'User not found' })

  const createSchedulingBody = z.object({
    name: z.string(),
    email: z.string().email(),
    observations: z.string(),
    date: z.string().datetime(),
  })

  const { name, email, observations, date } = createSchedulingBody.parse(
    req.body,
  )

  const schedulingDate = dayjs(date).startOf('hour')

  if (schedulingDate.isBefore(new Date())) {
    return res.status(400).json({ message: 'Date is in the past' })
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  })

  if (conflictingScheduling) {
    return res.status(400).json({ message: 'Date is already booked' })
  }

  const scheduling = await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
      user_id: user.id,
    },
  })

  // cria uma instância do google calendar
  const calendar = google.calendar({
    version: 'v3',
    auth: await getGoogleOAuthToken(user.id), // nossa função de autenticação para comunicar com o google
  })

  await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1, // necessário para criar a reunião no meet
    requestBody: {
      summary: `DevlifeCall - Agendamento ${name}`, // título do evento no calendário
      description: observations,
      start: {
        // data de início do evento
        dateTime: schedulingDate.format(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        // data de término do evento
        dateTime: schedulingDate.add(1, 'hour').format(),
        timeZone: 'America/Sao_Paulo',
      },
      attendees: [
        // participantes do evento
        {
          email,
          displayName: name,
        },
      ],
      conferenceData: {
        // dados da reunião no meet
        createRequest: {
          requestId: scheduling.id, // deve ser um id único
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    },
  })

  return res.status(201).end()
}
