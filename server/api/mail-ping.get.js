export default defineEventHandler(async () => {
  const config = {
    sender: {
      address: 'quizzes@ohlawcolorado.com',
      name: 'Quiz Report'
    },
    recipients: [
      { 
        address: 'owen@ohlawcolorado.com',
        name: 'Owen OHLaw'
      }
    ],
    subject: 'Testing email with config object as input',
    html: `<strong>Test body</strong>, that should be strong`,
    text: `Test body, that can't be strong`
  }
  const response = await sendMsg(config)
  return response
})