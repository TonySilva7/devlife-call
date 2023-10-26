import { Button, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { ElementType } from 'react'
import { Form, FormProps } from './styles'

export type IProps = FormProps & {
  as?: ElementType
}

export default function ClaimUsernameForm({ ...props }: IProps) {
  return (
    <Form as="form" {...props}>
      <TextInput
        size="sm"
        prefix="devlife.com/"
        placeholder="seu-usuário"
        crossOrigin="anonymous"
      />
      <Button size="sm" type="submit">
        Reservar
        <ArrowRight />
      </Button>
    </Form>
  )
}
