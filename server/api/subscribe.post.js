// server/api/subscribe.js
import MailerLite from '@mailerlite/mailerlite-nodejs'

export default defineEventHandler(async (event) => {
  try{
    // const { public: { mailerLite: { apiKey } } } = useRuntimeConfig()
    const { mailerLite: { apiKey } } = useRuntimeConfig()
    if (!apiKey) throw "Missing API key for Mailer Lite"

    const mailerLite = new MailerLite({ api_key: apiKey })

    const body = await readBody(event)

    const params = {
      email: body.email,
      groups: ['152317406232970580'],
      fields: {
        name: body.firstName,
        last_name: body.lastName || '',
        phone: body.phone || ''
      },
      status: "active"
    }

    const mlResponse = await mailerLite.subscribers.createOrUpdate(params)
    return { status: mlResponse.status, id: mlResponse.data.data.id }
  } catch (error) {
    console.error('failed to subscribe: ', error)
    throw error
  }
})