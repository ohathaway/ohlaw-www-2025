// server/utils/quizzes/utils.js
import qs from 'qs'

const { quizzes: config } = useAppConfig()

export const addSectionHeader = (doc, title) => {
  doc.font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
    .fontSize(18)
    .text(title)
    .moveDown(1)
}

export const addPageNumber = (doc, pageNumber) => {
  const currentY = doc.y
  const currentX = doc.x
  const footerY = doc.page.height - 65
  /*
  doc.moveDown(0)
    .y = footerY
  */

  doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
    .fontSize(10)
    .text('The Law Offices of Owen Hathaway', 50, footerY)
    .text(`Page ${pageNumber}`, doc.page.width - 100, footerY, { align: 'right' })

  doc.y = currentY
  doc.x = currentX
}

// Create a TOC line with dots between text and page number
export const addTocLine = (doc, text, pageNum, pageNumWidth, leftMargin, rightMargin) => {
  const y = doc.y
  const textWidth = doc.widthOfString(text)
  const dotAreaStart = leftMargin + textWidth
  const dotAreaWidth = rightMargin - dotAreaStart - pageNumWidth

  // Add the title text
  doc.text(text, leftMargin, y, { align: 'left' })

  // Calculate dot spacing
  const dotChar = '.'
  const dotWidth = doc.widthOfString(dotChar)
  const approxDots = Math.floor(dotAreaWidth / (dotWidth * 1.5))
  const dots = dotChar.repeat(approxDots)

  // Add the dots
  doc.text(dots, leftMargin + textWidth, y, {
    width: dotAreaWidth,
    align: 'right',
    characterSpacing: 1.5,
  })

  // Add the page number
  doc.text(pageNum, rightMargin - pageNumWidth, y, {
    width: pageNumWidth,
    align: 'right',
  })
}

export const checkPageBreak = (doc) => {
  const needPageBreak = doc.y > doc.page.height - config.reports.footer_reserve_space
  // console.info('need page break?', needPageBreak)
  if (needPageBreak) {
    doc.addPage()
    return true
  }
  return false
}

export const getQuizByIdREST = {
  populate: {
    questions: {
      populate: {
        media: {
          fields: [
            'name', 'alternativeText', 'caption', 'width', 'height', 'formats',
            'hash', 'ext', 'mime', 'size', 'url', 'previewUrl', 'provider',
            'provider_metadata', 'createdAt', 'updatedAt', 'publishedAt',
          ],
        },
        answers: {
          populate: {
            media: {
              fields: [
                'name', 'alternativeText', 'caption', 'width', 'height', 'formats',
                'hash', 'ext', 'mime', 'size', 'url', 'previewUrl', 'provider',
                'provider_metadata', 'createdAt', 'updatedAt', 'publishedAt',
              ],
            },
          },
        },
      },
    },
    resultCategories: {
      populate: {
        media: {
          fields: [
            'name', 'alternativeText', 'caption', 'width', 'height', 'formats',
            'hash', 'ext', 'mime', 'size', 'url', 'previewUrl', 'provider',
            'provider_metadata', 'createdAt', 'updatedAt', 'publishedAt',
          ],
        },
      },
    },
  },
  fields: [
    'documentId',
    'createdAt', 'updatedAt', 'publishedAt', 'isActive', 'version',
    'description', 'slug', 'title',
  ],
}

export const getQuizForAIbySlugREST = (slug) => {
  return qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      questions: {
        populate: {
          answers: {
            fields: [
              'answerText',
              'answerId',
              'minimumResultScore',
              'impact',
              'whyItMatters',
              'value',
            ],
          },
        },
        fields: [
          'questionText',
          'description',
          'questionId',
        ],
        pagination: {
          pageSize: 20,
          page: 1,
        },
      },
      resultCategories: {
        fields: [
          'title',
          'description',
          'minScore',
          'maxScore',
        ],
      },
    },
    fields: [
      'description',
      'title',
      'version',
    ],
  }, { encode: false })
}

/**
 * Flattens Strapi Rich-Text blocks to plain text
 * @param {Array} richTextArray - Array of Strapi rich-text blocks
 * @returns {string} - Plain text content
 */
function flattenStrapiRichText(richTextArray) {
  if (!Array.isArray(richTextArray)) {
    return ''
  }

  return richTextArray
    .map(block => extractTextFromBlock(block))
    .filter(text => text.trim().length > 0)
    .join(' ')
    .trim()
}

/**
 * Recursively extracts text from a single rich-text block
 * @param {Object} block - Single rich-text block
 * @returns {string} - Extracted text
 */
function extractTextFromBlock(block) {
  if (!block || typeof block !== 'object') {
    return ''
  }

  // If it's a text node, return the text
  if (block.type === 'text' && block.text) {
    return block.text
  }

  // If it has children, recursively extract text from them
  if (Array.isArray(block.children)) {
    return block.children
      .map(child => extractTextFromBlock(child))
      .filter(text => text.trim().length > 0)
      .join(' ')
      .trim()
  }

  // For blocks that might have text content directly
  if (block.text) {
    return block.text
  }

  // For other block types, return empty string
  return ''
}

/**
 * Helper function to process quiz data and flatten all rich-text fields
 * @param {Object} quizData - Full quiz object from Strapi
 * @returns {Object} - Simplified quiz object with flattened text
 */
export const simplifyQuizForLLM = (quiz) => {
  return {
    title: quiz.title,
    description: flattenStrapiRichText(quiz.description),
    questions: quiz.questions.map(question => ({
      id: question.questionId,
      text: question.questionText,
      description: flattenStrapiRichText(question.description),
      type: question.type,
      answers: question.answers.map(answer => ({
        id: answer.answerId,
        text: answer.answerText,
        value: answer.value,
        minimumScore: answer.minimumResultScore,
        maximumScore: answer.maximumResultScore,
        whyItMatters: answer.whyItMatters,
        impact: answer.impact,
      })),
    })),
    resultBands: quiz.resultCategories.map(category => ({
      title: category.title,
      description: flattenStrapiRichText(category.description),
      minScore: category.minScore,
      maxScore: category.maxScore,
    })),
  }
}

export const extractSelectedAnswerImpact = (userAnswers, quizData) => {
  const insights = []
  const questions = quizData.quizzes[0].questions

  Object.entries(userAnswers).forEach(([questionId, selectedAnswers]) => {
    const question = questions.find(q => q.questionId === questionId)
    if (!question) return

    // Handle both single and multiple choice answers
    const answersToProcess = Array.isArray(selectedAnswers) ? selectedAnswers : [selectedAnswers]

    answersToProcess.forEach((answerId) => {
      const answer = question.answers.find(a => a.answerId === answerId)
      if (answer && (answer.whyItMatters || answer.impact)) {
        insights.push({
          questionId,
          answerId,
          whyItMatters: answer.whyItMatters,
          impact: answer.impact,
          // Optional: include additional context
          questionText: question.questionText,
          answerText: answer.answerText,
        })
      }
    })
  })

  return insights
}
