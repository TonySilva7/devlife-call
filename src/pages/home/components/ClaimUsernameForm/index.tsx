import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { ElementType } from 'react'
import { Form, FormAnnotation, FormProps } from './styles'
import { z } from 'zod'

export type IProps = FormProps & {
  as?: ElementType
}

const claimUsernameSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Deve ter no mínimo 3 caracteres' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário só pode ter letras e hífen',
    })
    .transform((username) => username.toLowerCase()),
})

type IUsernameForm = z.infer<typeof claimUsernameSchema>

export default function ClaimUsernameForm({ ...props }: IProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUsernameForm>({
    resolver: zodResolver(claimUsernameSchema),
  })

  const handleClaimUsername = (data: IUsernameForm) => {
    alert(data.username)
  }

  return (
    <>
      <Form as="form" {...props} onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="devlife.com/"
          placeholder="seu-usuário"
          crossOrigin="anonymous"
          {...register('username')}
        />
        <Button size="sm" type="submit">
          Reservar
          <ArrowRight />
        </Button>
      </Form>

      <FormAnnotation>
        <Text>
          {errors.username
            ? errors.username.message
            : 'Digite o nome do usuário desejado'}
        </Text>
      </FormAnnotation>
    </>
  )
}
