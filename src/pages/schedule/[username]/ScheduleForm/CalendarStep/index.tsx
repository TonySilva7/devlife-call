import { ComponentProps, useState } from 'react'
import { Calendar } from '@app/components/Calendar'
import {
  TimePicker,
  Container,
  TimePickerHeader,
  TimePickerList,
  TimePickerItem,
} from './styles'

type CalendarStepProps = ComponentProps<typeof Container>

function CalendarStep({ ...props }: CalendarStepProps) {
  const [isDateSelected, setIsDateSelected] = useState(true)

  return (
    <Container isTimePickerOpen={true} {...props}>
      <Calendar />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            terça-feira <span>20 de setembro</span>
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
