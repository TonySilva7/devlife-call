import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { Container, ContainerProps, Form, FormError, Header } from '../styles'
import { register } from 'module'
import { ConnectBox, ConnectItem } from './styles'

type RegisterProps = ContainerProps

export default function Register({ ...props }: RegisterProps) {
  // const handleRegister = async () => {}
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
          <Button variant="secondary" size="sm">
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
