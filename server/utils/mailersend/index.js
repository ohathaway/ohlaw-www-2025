import {
  MailerSend,
  EmailParams,
  Sender,
  Recipient,
} from 'mailersend'
import isEmail from 'validator/es/lib/isEmail'

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_KEY,
})

export const sendTestMsg = async (recipient, sender) => {
  try {
    const sentFrom = new Sender(sender.address, sender.name)

    const recipients = [
      new Recipient(recipient.address, recipient.name),
    ]

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject('This is a test from MailerSend')
      .setHtml('<strong>This is the HTML</strong> content')
      .setText('This is the text content')

    const result = await mailerSend.email.send(emailParams)
    console.info('email send result:', result)
  }
  catch (error) {
    console.error('error sending test message:', error)
    throw error.body
  }
}

/*
  Send an email via MailerSend.com
  config Object: {
    sender: Object {
      address: EmailAddressString,
      name: String
    },
    recipients: Array [
      {
        address: EmailAddressString,
        name: String
      }
    ],
    subject: String,
    html: HtmlString,
    text: String
  }
 */

export const sendMsg = async (config) => {
  try {
    const validSubject = validateEmailSubject(config.subject)
    if (!validSubject.isValid) throw validSubject.error

    const validSender = isEmail(config.sender.address + '')
    if (!validSender) throw 'Invalid sender address'
    const sentFrom = new Sender(config.sender.address, config.sender.name)

    const recipients = config.recipients.filter((r) => {
      return isEmail(r.address)
    }).map((r) => {
      return new Recipient(r.address, r.name)
    })

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(config.subject)
      .setHtml(config.html)
      .setText(config.text)

    const result = await mailerSend.email.send(emailParams)
    console.info('email send result:', result)
  }
  catch (error) {
    console.error('error sending test message:', error)
    throw error.body
  }
}

/*
  Send an email via MailerSend.com with a template
  config Object: {
    sender: Object {
      address: EmailAddressString,
      name: String
    },
    recipients: Array [
      {
        address: EmailAddressString,
        name: String
      }
    ],
    subject: String,
    template: String,
    personalization
  }
 */
export const sendTemplatedMsg = async (config) => {
  try {
    const validSubject = validateEmailSubject(config.subject)
    if (!validSubject.isValid) throw validSubject.error

    const validSender = isEmail(config.sender.address + '')
    if (!validSender) throw 'Invalid sender address'
    const sentFrom = new Sender(config.sender.address, config.sender.name)

    /*
    const recipients = config.recipients.filter(r => {
      return isEmail(r.address)
    }).map(r => {
      return new Recipient(r.address, r.name)
    })
    */
    const recipients = [
      new Recipient(
        config.recipients[0].address,
        config.recipients[0].name,
      ),
    ]

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(config.subject)
      .setTemplateId(config.template)
      .setPersonalization(config.personalization)

    console.info('emailParams:', emailParams)
    const result = await mailerSend.email.send(emailParams)
    console.info('email send result:', result)
  }
  catch (error) {
    console.error('error sending test message:', error)
    throw error.body
  }
}
