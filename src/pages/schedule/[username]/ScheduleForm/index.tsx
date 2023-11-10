import { CalendarStep } from './CalendarStep'
import { ConfirmStep } from './ConfirmStep'

export default function ScheduleForm() {
  const isConfirmStep = false

  return isConfirmStep ? <ConfirmStep /> : <CalendarStep />
}
