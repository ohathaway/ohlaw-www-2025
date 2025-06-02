// server/api/generate-report.js
import PDFDocument from 'pdfkit'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import markdownIt from 'markdown-it'
import { getQuizForAIbySlug } from '~~/server/utils/quizzes/utils'

export default defineEventHandler(async (event) => {
  try {
    // Get quiz data from the request
    const body = await readBody(event)
    const { user, quizResults, answers } = body
    console.info('received an event:', body)

    const quizResultString = JSON.stringify(quizResults)
    const quizResultHash = crypto.createHash('sha256')
      .update(quizResultString)
      .digest('hex')
    const kvKey = `quizResults:${quizResultHash}`

    const resultExists = await hubKV().has(kvKey)
    console.info('resultExists:', resultExists)

    const quizData = await fetchQuizFromStrapi(quizResults.slug)

    let explanations
    if (!resultExists) {
      console.info('new quiz result received', quizResultHash)
      // Fetch detailed explanations for each answer from Strapi
      explanations = await analyzeQuizResults(
        quizData,
        quizResults.userAnswers,
        quizResults.totalScore
      )
      await hubKV().set(kvKey, explanations)
    } else {
      console.info('known quiz result received:', quizResultHash)
      explanations = await hubKV().get(kvKey)
    }
    // console.info('explanations:', explanations)
    const md = markdownIt()
    const block = JSON.parse(md.parse(explanations.content[0].text)
      .filter(b=>b.type === 'fence')[0].content)

    // Create a PDF document
    const pdfBuffer = await generatePDF(user, quizResults, quizData, block)

    // write out pdf to local directory for testing only
    if (process.env.NODE_ENV === 'development') {
      // For testing: Write the PDF to a file
      const testOutputDir = path.resolve('./test-output')

      // Create directory if it doesn't exist
      if (!fs.existsSync(testOutputDir)) {
        fs.mkdirSync(testOutputDir, { recursive: true })
      }

      const filename = `${user.lastName}-${user.firstName}-report-${Date.now()}.pdf`
      const outputPath = path.join(testOutputDir, filename)

      fs.writeFileSync(outputPath, pdfBuffer)
      console.log(`Test PDF written to: ${outputPath}`)
    }
    // Send email with PDF attachment
    //  await sendReportEmail(user.email, result)

    // Store in CRM (pseudocode)
    //  await submitToCRM(user, quizResults, result)

    return { success: true, message: 'Report generated and sent' }
  } catch (error) {
    console.error('Report generation error:', error)
    return { success: false, error: error.message }
  }
})


const generatePDF = (user, quizResults, quizData, explanations) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 50,
      size: 'letter',
      font: 'app/assets/fonts/PlusJakartaSans-Regular.ttf',
      bufferPages: true
    })
    
    // setup buffer collection
    const chunks = []
    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // Add content to PDF
    // ------------------------------

    const useAddCoverPage = doc => {
      addCoverPage(doc, user, quizResults)
      return doc
    }

    const useAddExecutiveSummary = doc => {
      addExecutiveSummary(doc, explanations, quizResults)
      return doc
    }

    const useAddQuestionAnalysis = doc => {
      addQuestionAnalysis(doc, quizResults.userAnswers, quizData)
      return doc
    }

    const useAddNextSteps = doc => {
      addNextSteps(doc, quizResults)
      return doc
    }

    const useAddResources = doc => {
      addResources(doc)
      return doc
    }

    // process the document in a pipeline
    pipe(
      useAddCoverPage,
      useAddExecutiveSummary,
      useAddQuestionAnalysis,
      // useAddNextSteps,
      useAddResources,
      () => doc.end()
    )(doc)
  })
}






// Email sending function
// ------------------------------

async function sendReportEmail(email, pdfBuffer) {
  // Configure transport - replace with your actual email settings
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  // Send email with attachment
  await transporter.sendMail({
    from: '"The Law Offices of Owen Hathaway" <info@ohlawcolorado.com>',
    to: email,
    subject: 'Your Estate Planning Assessment Results',
    html: `
    <div style="font-family: Arial, sans-serif max-width: 600px margin: 0 auto">
      <h2 style="color: #003399">Your Estate Planning Assessment</h2>
      
      <p>Thank you for completing our Estate Planning Pathway Finder assessment. Your personalized report is attached to this email.</p>
      
      <p>This report includes:</p>
      <ul>
       <li>A detailed analysis of your responses</li>
       <li>Explanations of key estate planning considerations</li>
       <li>Recommended next steps based on your situation</li>
       <li>Resources to help you move forward</li>
      </ul>
      
      <p>If you have any questions or would like to discuss your results, please don't hesitate to contact us at (970) 555-1234 or <a href="mailto:info@ohlawcolorado.com">info@ohlawcolorado.com</a>.</p>
      
      <p>Sincerely,<br>
      Owen Hathaway<br>
      The Law Offices of Owen Hathaway</p>
    </div>
   `,
    attachments: [
      {
        filename: 'Estate_Planning_Assessment.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  })
}

// Strapi integration (pseudocode)
// ------------------------------

const fetchQuizFromStrapi = async (slug) => {
  try {
    const { strapiUrl } = useAppConfig()
    /* REST version
    const query = qs.stringify(getQuizByIdREST, { encode: false })
    const quizResult = await $fetch(`${strapiUrl}/api/quizzes/${id}?${query}`)
    */
    /* GraphQL version */
    const quizResult = await $fetch(`${strapiUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        query: getQuizForAIbySlug,
        variables: {
          slug
        }
      }
    })


    return quizResult.data
  } catch (error) {
    console.error('failed to fetch quiz from strapi')
    throw error
  }
}

// CRM integration (pseudocode)
// ------------------------------

async function submitToCRM(user, quizResults, pdfBuffer) {
  // Placeholder for your CRM integration
  // This would submit user data and trigger your drip campaign

  // Example implementation depends on your specific CRM
}
