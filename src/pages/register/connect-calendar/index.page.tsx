import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ArrowRight, Check } from 'phosphor-react'
import { Container, ContainerProps, Header } from '../styles'
import { AuthError, ConnectBox, ConnectItem } from './styles'
import { NextSeo } from 'next-seo'

type RegisterProps = ContainerProps

export default function ConnectCalendar({ ...props }: RegisterProps) {
  // const handleRegister = async () => {}
  const { data, status } = useSession()
  const { query, push } = useRouter()

  const hasAuthError = !!query.error
  const isSignedIn = status === 'authenticated'

  const handleConnectCalendar = async () => {
    await signIn('google')
  }

  const handleNavigateToNextStep = async () => {
    await push('/register/time-intervals')
  }

  console.log(data)

  return (
    <>
      <NextSeo title="Conecte sua agenda do Google" noindex />

      <Container {...props}>
        <Header>
          <Heading as="strong">Conecte-se sua agenda!</Heading>
          <Text>
            Conecte o seu calendário para verificar automaticamente as horas
            ocupadas e os novos eventos à medida em que são agendados.
          </Text>

          <MultiStep size={4} currentStep={2} />
        </Header>

        <ConnectBox>
          <ConnectItem>
            <Text>Google Calendar</Text>
            {isSignedIn ? (
              <Button size="sm" disabled>
                Conectado
                <Check />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleConnectCalendar}
              >
                Conectar
                <ArrowRight />
              </Button>
            )}
          </ConnectItem>

          {hasAuthError && (
            <AuthError size="sm">
              Falha ao se conectar ao Google, verifique se você habilitou as
              permissões de acesso ao Google Calendar
            </AuthError>
          )}

          <Button
            type="submit"
            disabled={!isSignedIn}
            onClick={handleNavigateToNextStep}
          >
            Próximo passo
            <ArrowRight />
          </Button>
        </ConnectBox>
      </Container>
    </>
  )
}

export { type RegisterProps }
