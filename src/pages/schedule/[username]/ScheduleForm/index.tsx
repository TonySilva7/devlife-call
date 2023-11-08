import { ComponentProps } from 'react'
import { CalendarStep } from './CalendarStep'

type ScheduleFormProps = ComponentProps<typeof CalendarStep>

export default function ScheduleForm({ ...props }: ScheduleFormProps) {
  return <CalendarStep {...props} />
}

export { type ScheduleFormProps }
