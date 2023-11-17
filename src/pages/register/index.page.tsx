import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Container, ContainerProps, Form, FormError, Header } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { http } from '@app/lib/axios'
import { AxiosError } from 'axios'
import { NextSeo } from 'next-seo'

type RegisterProps = ContainerProps

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Deve ter no mínimo 3 caracteres' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário só pode ter letras e hífen',
    })
    .transform((username) => username.toLowerCase()),
  name: z.string().min(3, { message: 'Deve ter no mínimo 3 caracteres' }),
})
type IFormData = z.infer<typeof registerFormSchema>

export default function Register({ ...props }: RegisterProps) {
  const { query, push } = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  useEffect(() => {
    if (query.username) {
      setValue('username', query.username as string)
    }
  }, [query.username, setValue])

  const handleRegister = async (data: IFormData) => {
    try {
      await http.post('/users', {
        name: data.name,
        username: data.username,
      })

      await push('/register/connect-calendar')
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        alert(error.response.data.message)
        return
      }

      console.error(error)
    }
  }
  return (
    <>
      <NextSeo
        title="Crie uma conta | DevLife Call"
        description="Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois."
        canonical="https://www.devlif-call.com"
      />

      <Container {...props}>
        <Header>
          <Heading as="strong">Bem-vindo ao Devlife Call</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} currentStep={1} />
        </Header>

        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size="sm">Nome de usuário</Text>
            <TextInput
              prefix="devlife.com/"
              placeholder="seu-usuário"
              crossOrigin="anonymous"
              {...register('username')}
            />
            {errors.username && (
              <FormError size="sm">{errors.username.message}</FormError>
            )}
          </label>
          <label>
            <Text size="sm">Nome completo</Text>
            <TextInput
              placeholder="Seu nome"
              crossOrigin="anonymous"
              {...register('name')}
            />
            {errors.name && (
              <FormError size="sm">{errors.name.message}</FormError>
            )}
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  )
}

export { type RegisterProps }
