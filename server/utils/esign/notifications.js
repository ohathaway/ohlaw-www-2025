// E-sign email notifications via Resend API.
// Uses fetch directly — no SDK needed.

const RESEND_API = 'https://api.resend.com/emails'

const sender = 'OHLaw E-Sign <esign@ohlawcolorado.com>'
const firmEmail = 'owen@ohlawcolorado.com'

const sendEmail = async ({ to, subject, html }) => {
  const config = useRuntimeConfig()
  const key = config.resend.key

  if (!key) {
    console.error('RESEND_KEY not configured')
    return
  }

  const response = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: sender,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
      .catch(() => '')
    console.error(
      `Resend error (${response.status}):`, err,
    )
    throw new Error(
      `Email send failed: ${response.status}`,
    )
  }

  return response.json()
}

const signingPageUrl = (token, baseUrl) =>
  `${baseUrl}/sign/${token}`

export const sendSigningRequest = async (
  session,
  document,
  baseUrl = 'https://ohlawcolorado.com',
) => {
  const url = signingPageUrl(
    session.signingToken,
    baseUrl,
  )

  await sendEmail({
    to: session.signerEmail,
    subject: `Please sign: ${document.title}`,
    html: `
<div style="font-family: sans-serif;
  max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1E3A5F;">
    Document Ready for Your Signature
  </h2>
  <p>Hello ${session.signerName},</p>
  <p>The Law Offices of Owen Hathaway has
  sent you a document to sign:</p>
  <p><strong>${document.title}</strong></p>
  <p style="margin: 24px 0;">
    <a href="${url}"
       style="background: #1E3A5F;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              display: inline-block;">
      Review &amp; Sign Document
    </a>
  </p>
  <p style="color: #666; font-size: 14px;">
    This link expires in 48 hours. If you
    have questions, please contact our office
    at (970) 818-3052.
  </p>
  <hr style="border: none;
    border-top: 1px solid #eee;
    margin: 24px 0;" />
  <p style="color: #999; font-size: 12px;">
    The Law Offices of Owen Hathaway<br />
    Fort Collins, Colorado
  </p>
</div>`.trim(),
  })
}

export const sendSigningConfirmation = async (
  session,
  document,
) => {
  await sendEmail({
    to: session.signerEmail,
    subject: `Signed: ${document.title}`,
    html: `
<div style="font-family: sans-serif;
  max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1E3A5F;">
    Document Signed Successfully
  </h2>
  <p>Hello ${session.signerName},</p>
  <p>You have successfully signed
  <strong>${document.title}</strong>.</p>
  <p>A copy of the signed document will be
  provided to you by the Law Offices of
  Owen Hathaway once all parties have
  signed.</p>
  <hr style="border: none;
    border-top: 1px solid #eee;
    margin: 24px 0;" />
  <p style="color: #999; font-size: 12px;">
    The Law Offices of Owen Hathaway<br />
    Fort Collins, Colorado
  </p>
</div>`.trim(),
  })
}

export const sendCompletionNotice = async (
  document,
  sessions,
  downloadUrl,
) => {
  const signerList = sessions
    .map(s => `${s.signerName} (${s.signerEmail})`)
    .join(', ')

  await sendEmail({
    to: firmEmail,
    subject: `All signed: ${document.title}`,
    html: `
<div style="font-family: sans-serif;
  max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1E3A5F;">
    Document Fully Signed
  </h2>
  <p><strong>${document.title}</strong> has
  been signed by all parties:</p>
  <p>${signerList}</p>
  ${downloadUrl
    ? `<p><a href="${downloadUrl}">
        Download Signed PDF
      </a></p>`
    : ''}
</div>`.trim(),
  })
}
