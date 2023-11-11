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

type CalendarProps = ComponentProps<typeof CalendarContainer>

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = Array<CalendarWeek>

function Calendar({ ...props }: CalendarProps) {
  const shortWeekDays = getWeekDays({ short: true })
  const [currentDate, setCurrentDate] = useState(() => dayjs().set('date', 1))

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

  const createCalendarWeeks = useMemo(() => {
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
        disabled: date.endOf('day').isBefore(new Date()),
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
  }, [currentDate])

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
                  <CalendarDay disabled={disabled}>
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
