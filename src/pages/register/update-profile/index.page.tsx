import { NextSeo } from 'next-seo'
import { buildNextAuthOptions } from '@app/pages/api/auth/[...nextauth].api'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from '@ignite-ui/react'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Container, ContainerProps, Header } from '../styles'
import { FormAnnotation, ProfileBox } from './styles'
import { http } from '@app/lib/axios'
import { useRouter } from 'next/router'

type RegisterProps = ContainerProps

const UpdateProfileSchema = z.object({
  bio: z.string().min(3, { message: 'Deve ter no mínimo 3 caracteres' }),
})
type IFormData = z.infer<typeof UpdateProfileSchema>

export default function UpdateProfile({ ...props }: RegisterProps) {
  const router = useRouter()
  const session = useSession()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IFormData>({
    resolver: zodResolver(UpdateProfileSchema),
  })

  const handleUpdateProfile = async (data: IFormData) => {
    await http.put('/users/profile', {
      bio: data.bio,
    })

    await router.push(`/schedule/${session.data?.user.username}`)
  }
  return (
    <>
      <NextSeo title="Atualize seu perfil | DevLife Call" noindex />

      <Container {...props}>
        <Header>
          <Heading as="strong">Bem-vindo ao Devlife Call</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} currentStep={4} />
        </Header>

        <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <label>
            <Text size="sm">Foto de perfil</Text>
            <Avatar
              src={session.data?.user.avatar_url}
              alt={session.data?.user.name}
            />
          </label>
          <label>
            <Text size="sm">Sobre você</Text>
            <TextArea {...register('bio')} />
            <FormAnnotation size="sm">
              Fale um pouco sobre você. Isto será exibido em sua página pessoal.
            </FormAnnotation>
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Finalizar
            <ArrowRight />
          </Button>
        </ProfileBox>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return {
      redirect: {
        destination: '/register',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}

export { type RegisterProps }
