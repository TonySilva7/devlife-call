import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { Container, ContainerProps, Form, FormError, Header } from '../styles'
import { register } from 'module'
import { ConnectBox, ConnectItem } from './styles'
import { useSession, signIn, signOut } from 'next-auth/react'

type RegisterProps = ContainerProps

export default function Register({ ...props }: RegisterProps) {
  // const handleRegister = async () => {}
  const { data: session } = useSession()

  const handleSignIn = async () => {
    await signIn('google')
  }

  return (
    <Container {...props}>
      <Text>{JSON.stringify(session)}</Text>
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
          <Button variant="secondary" size="sm" onClick={handleSignIn}>
            Conectar
            <ArrowRight />
          </Button>
        </ConnectItem>
        <Button type="submit">
          Próximo passo
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}

export { type RegisterProps }
