/* eslint-disable camelcase */
import dayjs from 'dayjs'
import { prisma } from './prisma'
import { google } from 'googleapis'

/**
 * @description Função que vai se comunicar com a api do Google para obter os dados de sessão do usuário, verificando sempre se o token ainda está válido e pedindo um novo caso não esteja. Ela pega os dados de autenticação do banco, e verifica se precisam ser atualizados, se sim atualiza e retorna os dados de autenticação atualizados, e grava novamente no banco.
 * @param userId Id do usuário que está fazendo a requisição
 * @returns Retorna os dados de autenticação do usuário
 */
export async function getGoogleOAuthToken(userId: string) {
  const account = await prisma.account.findFirstOrThrow({
    where: {
      provider: 'google',
      user_id: userId,
    },
  })

  // instancia o objeto de autenticação do google
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )

  // seta as credenciais atuais do usuário
  auth.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at ? account.expires_at * 1000 : null,
  })

  if (!account.expires_at) {
    return auth
  }

  // verifica se o token nas credenciais passadas acima, já expirou
  const isTokenExpired = dayjs(account.expires_at * 1000).isBefore(new Date())

  if (isTokenExpired) {
    // se o token expirou, pede um novo token
    const { credentials } = await auth.refreshAccessToken()
    const {
      access_token,
      expiry_date,
      id_token,
      refresh_token,
      scope,
      token_type,
    } = credentials

    // atualiza os dados de autenticação do usuário no banco
    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        access_token,
        expires_at: expiry_date ? Math.floor(expiry_date / 1000) : null,
        id_token,
        refresh_token,
        scope,
        token_type,
      },
    })

    // atualiza os dados de autenticação do objeto de autenticação do google
    auth.setCredentials({
      access_token,
      refresh_token,
      expiry_date,
    })
  }

  // retorna os dados de autenticação atualizados
  return auth
}
