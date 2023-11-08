import { ComponentProps } from 'react'
import { Container } from '../../styles'
import { Calendar } from '@app/components/Calendar'

type CalendarStepProps = ComponentProps<typeof Container>

function CalendarStep({ ...props }: CalendarStepProps) {
  return (
    <Container {...props}>
      <Calendar />
    </Container>
  )
}

export { CalendarStep, type CalendarStepProps }
