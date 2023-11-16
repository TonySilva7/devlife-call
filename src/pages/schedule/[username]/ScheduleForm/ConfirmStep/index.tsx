import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import { CalendarBlank, Clock } from 'phosphor-react'
import { ConfirmForm, FormActions, FormError, FormHeader } from './styles'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nome muito curto' })
    .max(255, { message: 'Nome muito longo' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  observations: z.string().nullable(),
})

type IConfirmForm = z.infer<typeof confirmFormSchema>

interface ConfirmStepProps {
  schedulingDate: Date
  onCancelConfirmation: () => void
}

function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<IConfirmForm>({
    resolver: zodResolver(confirmFormSchema),
  })

  const describeDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const describeTime = dayjs(schedulingDate).format('HH:mm[hs]')

  function handleConfirmScheduling(data: IConfirmForm) {
    console.log(data)
  }
  return (
    <ConfirmForm onSubmit={handleSubmit(handleConfirmScheduling)} as="form">
      <FormHeader>
        <Text>
          <CalendarBlank />
          {describeDate}
        </Text>
        <Text>
          <Clock />
          {describeTime}
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput
          placeholder="Seu nome"
          crossOrigin="anonymous"
          {...register('name')}
        />
        {errors.name && <FormError>{errors.name.message}</FormError>}
      </label>
      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput
          type="email"
          placeholder="johndoe@mail.com"
          crossOrigin="anonymous"
          {...register('email')}
        />
        {errors.email && <FormError>{errors.email.message}</FormError>}
      </label>
      <label>
        <Text size="sm">Observações</Text>
        <TextArea />
      </label>

      <FormActions>
        <Button variant="tertiary" type="button" onClick={onCancelConfirmation}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  )
}

export { ConfirmStep }
