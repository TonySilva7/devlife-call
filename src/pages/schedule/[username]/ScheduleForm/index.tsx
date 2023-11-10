import { CalendarStep } from './CalendarStep'
import { ConfirmStep } from './ConfirmStep'

export default function ScheduleForm() {
  const isConfirmStep = true

  return isConfirmStep ? <ConfirmStep /> : <CalendarStep />
}
