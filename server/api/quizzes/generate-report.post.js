// server/api/quiz-generate-report.js
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit'
import markdownIt from 'markdown-it'
import { getQuizForAIbySlugREST } from '~~/server/utils/quizzes/utils'
import { analyzeQuizResults } from '~~/server/utils/quizzes/aiAnalysis'
import { toTitleCase } from '~~/app/utils/strings'
import { recommendBlogPosts } from '~~/server/utils/quizzes/contentRecommendations'
import { pipe } from '~~/server/utils/functional.ts'

export default defineEventHandler(async (event) => {
  try {
    // Get quiz data from the request
    let body
    try {
      body = await readBody(event)
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      return { success: false, error: 'Invalid JSON body' }
    }
    
    const { user, quizResults, answers } = body

    // Validate required fields
    if (!user || !quizResults || !quizResults.slug) {
      return { success: false, error: 'Missing required fields: user, quizResults, or quizResults.slug' }
    }

    const quizResultString = JSON.stringify(quizResults)
    const quizResultHash = crypto.createHash('sha256')
      .update(quizResultString)
      .digest('hex')
    const kvKey = `quizAnalysis:${quizResultHash}`

    const resultExists = await hubKV().has(kvKey)

    const quizData = await fetchQuizFromStrapi(quizResults.slug)
    
    // Check if quiz was found
    if (!quizData.quizzes || quizData.quizzes.length === 0) {
      return { success: false, error: `Quiz not found: ${quizResults.slug}` }
    }

    let explanations
    if (!resultExists) {
      // Fetch detailed explanations for each answer from Strapi
      explanations = await analyzeQuizResults(
        quizData,
        quizResults.userAnswers,
        quizResults.totalScore,
      )
      await hubKV().set(kvKey, explanations)
    }
    else {
      explanations = await hubKV().get(kvKey)
    }
    // console.info('explanations:', explanations)
    const md = markdownIt()
    const block = JSON.parse(md.parse(explanations.content[0].text)
      .filter(b => b.type === 'fence')[0].content)

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

    const { cloudflare: { bucketName } } = useRuntimeConfig()
    const downloadName = body.quizResults.slug + '-'
      + body.user.lastName + '-'
      + body.user.firstName + '.pdf'

    await uploadPdfToR2(pdfBuffer, downloadName, bucketName)

    const reportUrlSigned = await getPresignedUrl(downloadName)
    
    // Send email template with download URL
    try {
      await sendTemplatedMsg({
        sender: {
          name: 'OHLaw Quizzes',
          address: 'quizzes@ohlawcolorado.com',
        },
        recipients: [
          {
            name: `${body.user.firstName} ${body.user.lastName}`,
            address: body.user.email,
          },
        ],
        subject: `${toTitleCase(body.quizResults.slug, '-')} Assessment Results`,
        template: 'ynrw7gyq9mo42k8e',
        personalization: [
          {
            // email: body.user.email,
            email: 'owen@ohlawcolorado.com',
            data: {
              download_url: reportUrlSigned,
            },
          },
        ],
      })
    } catch (emailError) {
      console.warn('Email sending failed, but report generation succeeded:', emailError.message || emailError)
    }

    // Store in CRM (pseudocode)
    //  await submitToCRM(user, quizResults, result)

    return { success: true, message: 'Report generated and sent' }
  }
  catch (error) {
    console.error('Report generation error:', error)
    return { success: false, error: error.message }
  }
})


const generatePDF = async (user, quizResults, quizData, explanations) => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({
      margin: 50,
      size: 'letter',
      font: 'app/assets/fonts/PlusJakartaSans-Regular.ttf',
      bufferPages: true,
    })

    // setup buffer collection
    const chunks = []
    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // Add content to PDF
    // ------------------------------

    const useAddCoverPage = (doc) => {
      addCoverPage(doc, user, quizResults)
      return doc
    }

    const useAddExecutiveSummary = (doc) => {
      addExecutiveSummary(doc, explanations, quizResults)
      return doc
    }

    const useAddQuestionAnalysis = (doc) => {
      addQuestionAnalysis(doc, quizResults.userAnswers, quizData)
      return doc
    }

    const useAddNextSteps = (doc) => {
      addNextSteps(doc, quizResults)
      return doc
    }

    const useAddResources = async doc => {
      // Get Phase 1 blog recommendations
      const recommendedPosts = await recommendBlogPosts(
        quizResults.userAnswers,
        quizResults,
        5 // Max 5 recommendations
      )
      
      // Get static tools from app config
      const runtimeConfig = useRuntimeConfig()
      const appConfig = runtimeConfig.appConfig || {}
      const staticTools = appConfig.quizzes?.reports?.staticTools || []
      
      // Add resources with QR codes
      const updatedDoc = await addResources(doc, recommendedPosts, staticTools)
      return updatedDoc
    }

    // Process the document in a pipeline (handling async resources step separately)
    const processedDoc = pipe(
      useAddCoverPage,
      useAddExecutiveSummary,
      useAddQuestionAnalysis,
      // useAddNextSteps,
    )(doc)
    
    // Handle async resources step
    await useAddResources(processedDoc)
    
    // End the document
    doc.end()
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
        contentType: 'application/pdf',
      },
    ],
  })
}

// Strapi integration (pseudocode)
// ------------------------------

const fetchQuizFromStrapi = async (slug) => {
  try {
    const { strapiUrl } = useAppConfig()
    // REST version
    const query = getQuizForAIbySlugREST(slug)
    const fullUrl = `${strapiUrl}/api/quizzes?${query}`
    
    const quizResult = await $fetch(fullUrl)

    return quizResult.data?.[0] ? { quizzes: [quizResult.data[0]] } : { quizzes: [] }
  }
  catch (error) {
    console.error('failed to fetch quiz from strapi', error.message)
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
