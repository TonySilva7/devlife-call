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
import { useQuery } from '@tanstack/react-query'

type CalendarStepProps = ComponentProps<typeof Container>

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

function CalendarStep({ ...props }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  // const [availability, setAvailability] = useState<Availability | null>(null)
  const isDateSelected = !!selectedDate

  const router = useRouter()
  const username = router.query.username as string

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  async function getAvailability() {
    const response = await http.get(`users/${username}/availability`, {
      params: {
        date: dayjs(selectedDate).format('YYYY-MM-DD'),
      },
    })
    return response.data
  }

  const { data: availability } = useQuery<Availability>({
    queryKey: ['availability', selectedDateWithoutTime],
    queryFn: getAvailability,
    enabled: !!selectedDate,
  })

  // useEffect(() => {
  //   if (!selectedDate) return

  //   http
  //     .get(`users/${username}/availability`, {
  //       params: {
  //         date: dayjs(selectedDate).format('YYYY-MM-DD'),
  //       },
  //     })
  //     .then(({ data }) => setAvailability(data))
  //     .catch(() => setAvailability(null))
  // }, [selectedDate, username])

  return (
    <Container isTimePickerOpen={isDateSelected} {...props}>
      <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability?.possibleTimes.map((hour) => (
              <TimePickerItem
                key={hour}
                disabled={!availability.availableTimes.includes(hour)}
              >
                {String(hour).padStart(2, '0')}:00h
              </TimePickerItem>
            ))}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}

export { CalendarStep, type CalendarStepProps }
