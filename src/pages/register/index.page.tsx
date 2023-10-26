import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Container, ContainerProps, Form, Header } from './styles'
import { ArrowRight } from 'phosphor-react'

type RegisterProps = ContainerProps

export default function Register({ ...props }: RegisterProps) {
  return (
    <Container {...props}>
      <Header>
        <Heading as="strong">Bem-vindo ao Devlife Call</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form">
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            prefix="devlife.com/"
            placeholder="seu-usuário"
            crossOrigin="anonymous"
          />
        </label>
        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput placeholder="Seu nome" crossOrigin="anonymous" />
        </label>

        <Button type="submit">
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}

export { type RegisterProps }
