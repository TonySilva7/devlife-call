import { ComponentProps, useEffect, useState } from 'react'
import { Calendar } from '@app/components/Calendar'
import {
  TimePicker,
  Container,
  TimePickerHeader,
  TimePickerList,
  TimePickerItem,
} from './styles'
import dayjs from 'dayjs'
import { http } from '@app/lib/axios'
import { useRouter } from 'next/router'

type CalendarStepProps = ComponentProps<typeof Container>

function CalendarStep({ ...props }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availability, setAvailability] = useState<Date[]>([])
  const isDateSelected = !!selectedDate

  const router = useRouter()
  const username = router.query.username as string

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  useEffect(() => {
    if (!selectedDate) return

    http
      .get(`users/${username}/availability`, {
        params: {
          date: selectedDate.getUTCDate(),
        },
      })
      .then((response) => {
        setAvailability(response.data)
      })
  }, [selectedDate])

  return (
    <Container isTimePickerOpen={isDateSelected} {...props}>
      <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability.map((date) => (
              <TimePickerItem key={date.toISOString()}>
                {dayjs(date).format('HH:mm')}
              </TimePickerItem>
            ))}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )

  return (
    <Container isTimePickerOpen={isDateSelected} {...props}>
      <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
            <TimePickerItem>08:00</TimePickerItem>
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}

export { CalendarStep, type CalendarStepProps }
