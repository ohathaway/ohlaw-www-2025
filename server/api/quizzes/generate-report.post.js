// server/api/generate-report.js
import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'

const { quizzes: config } = useAppConfig()

export default defineEventHandler(async (event) => {
  try {
    // Get quiz data from the request
    const body = await readBody(event)
    const { user, quizResults, answers } = body

    // Fetch detailed explanations for each answer from Strapi
    // This is pseudocode - you'll need to implement your specific Strapi query
    //  const explanations = await fetchExplanationsFromStrapi(answers)
    // sample explanations
    const explanations = [
      {
        "answerId": "q1a4",
        "questionId": "q1",
        "whyItMatters": "Your family structure is the foundation of your estate planning needs. With a married/partnered status and children from your current relationship, you have what's called a 'nuclear family' structure. This is one of the most common family arrangements, but still requires thoughtful planning to ensure your spouse/partner and children are protected.",
        "impact": "In your situation, you'll want to consider how assets pass between spouses (which can often happen tax-free), as well as how to provide for your children. If your children are minors, you'll need to name guardians in your will and possibly establish trusts to manage assets for them until they reach adulthood. Even with a straightforward family structure, failing to plan can lead to unintended consequences, particularly regarding inheritance timing for children."
      },
      {
        "answerId": "q2a1",
        "questionId": "q2",
        "whyItMatters": "Your primary residence is likely one of your most valuable assets, both financially and emotionally. How this property transfers after your death can significantly impact your loved ones. In many states, probate (the court process for settling estates) can be time-consuming and expensive, potentially tying up your home for months.",
        "impact": "For homeowners, several options exist for transferring property: 1) Through a will (which means going through probate), 2) Using transfer-on-death deeds (available in some states), 3) Holding property in joint tenancy with right of survivorship, or 4) Placing the home in a revocable living trust. Each method has different implications for taxes, creditor protection, and ease of transfer. Your chosen estate planning approach should address this important asset specifically."
      },
      {
        "answerId": "q2a3",
        "questionId": "q2",
        "whyItMatters": "Your primary residence is likely one of your most valuable assets, both financially and emotionally. How this property transfers after your death can significantly impact your loved ones. In many states, probate (the court process for settling estates) can be time-consuming and expensive, potentially tying up your home for months.",
        "impact": "For homeowners, several options exist for transferring property: 1) Through a will (which means going through probate), 2) Using transfer-on-death deeds (available in some states), 3) Holding property in joint tenancy with right of survivorship, or 4) Placing the home in a revocable living trust. Each method has different implications for taxes, creditor protection, and ease of transfer. Your chosen estate planning approach should address this important asset specifically."
      },
      {
        "answerId": "q2a5",
        "questionId": "q2",
        "whyItMatters": "Your primary residence is likely one of your most valuable assets, both financially and emotionally. How this property transfers after your death can significantly impact your loved ones. In many states, probate (the court process for settling estates) can be time-consuming and expensive, potentially tying up your home for months.",
        "impact": "For homeowners, several options exist for transferring property: 1) Through a will (which means going through probate), 2) Using transfer-on-death deeds (available in some states), 3) Holding property in joint tenancy with right of survivorship, or 4) Placing the home in a revocable living trust. Each method has different implications for taxes, creditor protection, and ease of transfer. Your chosen estate planning approach should address this important asset specifically."
      },
      {
        "answerId": "q3a3",
        "questionId": "q3",
        "whyItMatters": "Your estate value ($500,000 - $1 million) puts you in a range where thoughtful planning becomes increasingly important. While your estate likely falls below federal estate tax thresholds, state-level estate or inheritance taxes may apply depending on where you live. Additionally, with assets of this value, the probate process becomes more complex and potentially more expensive.",
        "impact": "At this estate value, strategic planning can help minimize administrative costs, reduce tax burdens, and ensure efficient transfer of assets. You should consider whether a will-based plan with targeted non-probate transfers (like beneficiary designations) is sufficient, or if you would benefit from a trust-based plan that provides more control and privacy. Careful consideration should also be given to asset protection strategies and optimizing your estate for tax purposes, particularly if your estate is likely to grow over time."
      },
      {
        "answerId": "q5a4",
        "questionId": "q5",
        "whyItMatters": "Medical decision-making documents are among the most important parts of any estate plan, regardless of your age or wealth. Your discomfort with making these decisions without guidance is understandable - these are complex matters with significant implications. Healthcare directives include several distinct documents: a living will (stating your wishes for end-of-life care), a medical power of attorney (naming someone to make decisions for you), and sometimes a HIPAA authorization (allowing access to your medical records).",
        "impact": "Being 'somewhat uncomfortable' with these decisions suggests you would benefit from professional guidance in this area. A qualified estate planning attorney can explain the nuances between different medical directives, help you understand scenarios you might not have considered, and ensure your documents are properly drafted and executed. This is one area where DIY approaches often fall short, as online forms may not address state-specific requirements or provide the counseling needed to make informed decisions about complex medical scenarios."
      },
      {
        "answerId": "q6a2",
        "questionId": "q6",
        "whyItMatters": "Your desire to avoid probate is a common and reasonable goal in estate planning. Probate is the court-supervised process of validating a will, paying debts, and distributing assets. While necessary in some cases, probate can be time-consuming (often 6-12 months), expensive (with court costs and attorney fees), and public (creating a record of your assets and beneficiaries that anyone can access).",
        "impact": "To effectively avoid probate, you'll need more than just a will, as wills must go through probate to be effective. Common probate-avoidance tools include: revocable living trusts, beneficiary designations on financial accounts and insurance policies, transfer-on-death or payable-on-death designations for certain assets, and joint ownership with rights of survivorship. A comprehensive probate-avoidance strategy typically involves several of these tools working together. This goal often necessitates more planning than a simple DIY approach can provide, as the strategy needs to be coordinated across multiple assets and kept up to date as your situation changes."
      },
      {
        "answerId": "q8a3",
        "questionId": "q8",
        "whyItMatters": "Your self-assessment of needing accountability for follow-through is an honest and important insight. Estate planning involves not just creating documents but also funding trusts (if applicable), updating beneficiary designations, retitling assets, and keeping your plan updated as laws and your life circumstances change. Many well-intentioned estate plans fail not because they were poorly designed, but because they were never fully implemented.",
        "impact": "Given your need for accountability, consider whether a completely DIY approach will provide the structure you need to complete all necessary steps. Working with a professional can provide deadlines, follow-up communications, and scheduled reviews that keep your plan on track. Even if you choose a primarily self-help approach, building in some professional oversight or check-ins might be valuable. Remember that an incomplete estate plan can sometimes be worse than no plan at all, as it may create confusion about your intentions or fail to achieve your goals."
      },
      {
        "answerId": "q10a2",
        "questionId": "q10",
        "whyItMatters": "Privacy concerns are an important consideration in estate planning. When you indicate that privacy is 'somewhat important,' you're balancing the desire for confidentiality with practical considerations about cost and complexity. Standard probate proceedings create public records of your assets, debts, and beneficiaries that anyone can access. This level of transparency can be concerning for many families.",
        "impact": "With privacy being somewhat important to you, you may want to consider certain privacy-enhancing strategies without necessarily implementing a completely private plan. For example, you might use beneficiary designations for financial accounts while accepting that some assets may go through probate. Or you might establish a revocable living trust for your most sensitive assets while using simpler methods for others. This balanced approach can provide reasonable privacy protection while keeping your plan manageable and cost-effective."
      }
    ]

    // Create a PDF document
    const pdfBuffer = await generatePDF(user, quizResults, answers, explanations)

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


const generatePDF = (user, quizResults, answers, explanations) => {
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
      addExecutiveSummary(doc, quizResults)
      return doc
    }

    const useAddQuestionAnalysis = doc => {
      addQuestionAnalysis(doc, answers, explanations)
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
      useAddNextSteps,
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

async function fetchExplanationsFromStrapi(answers) {
  // get explanation query
  const getExplanationQuery = getQuizExplanationsBySlugREST()

  // Example response structure:
  return answers.map(answer => {
    return {
      answerId: answer.answerId,
      questionId: answer.questionId,
      whyItMatters: "This is important because...", // From Strapi
      impact: "This impacts your estate plan by..." // From Strapi
    }
  })
}

// CRM integration (pseudocode)
// ------------------------------

async function submitToCRM(user, quizResults, pdfBuffer) {
  // Placeholder for your CRM integration
  // This would submit user data and trigger your drip campaign

  // Example implementation depends on your specific CRM
}
