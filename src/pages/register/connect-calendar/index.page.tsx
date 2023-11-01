import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight, Check } from 'phosphor-react'
import { Container, ContainerProps, Form, FormError, Header } from '../styles'
import { register } from 'module'
import { AuthError, ConnectBox, ConnectItem } from './styles'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

type RegisterProps = ContainerProps

export default function Register({ ...props }: RegisterProps) {
  // const handleRegister = async () => {}
  const { data: session, status } = useSession()
  const { query } = useRouter()

  const hasAuthError = !!query.error
  const isSignedIn = status === 'authenticated'

  const handleConnectCalendar = async () => {
    await signIn('google')
  }

  return (
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

        <Button type="submit" disabled={!isSignedIn}>
          Próximo passo
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}

export { type RegisterProps }