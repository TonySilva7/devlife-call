import { CaretLeft, CaretRight } from 'phosphor-react'
import { ComponentProps, useMemo, useState } from 'react'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles'
import { getWeekDays } from '@app/utils/get-week-day'
import dayjs from 'dayjs'
import { http } from '@app/lib/axios'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

type CalendarProps = ComponentProps<typeof CalendarContainer> & {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
}

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = Array<CalendarWeek>

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

function Calendar({ onDateSelect, ...props }: CalendarProps) {
  const shortWeekDays = getWeekDays({ short: true })
  const [currentDate, setCurrentDate] = useState(() => dayjs().set('date', 1))
  const router = useRouter()

  const handlePrevMonth = () => {
    const prevMonth = currentDate.subtract(1, 'month')
    setCurrentDate(prevMonth)
  }

  const handleNextMonth = () => {
    const nextMonth = currentDate.add(1, 'month')
    setCurrentDate(nextMonth)
  }

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const username = router.query.username as string

  const yearParam = currentDate.get('year')
  const monthParam = currentDate.get('month')

  async function getAvailability() {
    const response = await http.get(`users/${username}/blocked-dates`, {
      params: {
        year: yearParam,
        month: monthParam + 1,
      },
    })
    return response.data
  }

  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: ['blocked-dates', yearParam, monthParam],
    queryFn: getAvailability,
  })

  const createCalendarWeeks = useMemo(() => {
    if (!blockedDates) return []

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, index) => currentDate.set('date', index + 1))

    const firstWeekDay = currentDate.get('day') // pega o dia textual (não em número)

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, index) => {
        const day = currentDate.subtract(index + 1, 'day')
        return day
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )
    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, index) => {
      const day = lastDayInCurrentMonth.add(index + 1, 'day')
      return day
    })

    const calendarDays = [
      ...previousMonthFillArray.map((date) => ({ date, disabled: true })),
      ...daysInMonthArray.map((date) => ({
        date,
        disabled:
          date.endOf('day').isBefore(new Date()) ||
          blockedDates?.blockedWeekDays.includes(date.get('day')) ||
          blockedDates.blockedDates.includes(date.get('date')),
      })),
      ...nextMonthFillArray.map((date) => ({ date, disabled: true })),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (calWeeks, calendarDay, index, original) => {
        const isNewWeek = index % 7 === 0

        if (isNewWeek) {
          calWeeks.push({
            week: index / 7 + 1,
            days: original.slice(index, index + 7),
          })
        }

        return calWeeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  return (
    <CalendarContainer {...props}>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button
            type="button"
            onClick={handlePrevMonth}
            title="Previous month"
          >
            <CaretLeft />
          </button>
          <button type="button" onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {createCalendarWeeks.map(({ week, days }) => (
            <tr key={week}>
              {days.map(({ date, disabled }) => (
                <td key={date.format('DD')}>
                  <CalendarDay
                    onClick={() => onDateSelect(date.toDate())}
                    disabled={disabled}
                  >
                    {date.format('DD')}
                  </CalendarDay>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}

export { Calendar, type CalendarProps }
