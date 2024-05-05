import { Heading, Text } from '@ignite-ui/react'
import { Container, Hero, Preview } from './styles'
import previewImage from '@app/assets/app-preview.png'
import Image from 'next/image'
import ClaimUsernameForm from './components/ClaimUsernameForm'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplicando agendamentos"
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
        canonical="https://www.devlif-call.com"
      />

      <Container>
        <Hero>
          <Heading size={'4xl'}>Agendamento descomplicado</Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </Text>

          <ClaimUsernameForm />
        </Hero>

        <Preview>
          <Image
            src={previewImage}
            height={400}
            quality={100}
            priority
            alt="Calendário em modo preview"
          />
        </Preview>
      </Container>
    </>
  )
}
