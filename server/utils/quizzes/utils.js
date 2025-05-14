// server/utils/quizzes/utils.js

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
    characterSpacing: 1.5
  })

  // Add the page number
  doc.text(pageNum, rightMargin - pageNumWidth, y, {
    width: pageNumWidth,
    align: 'right'
  })

}

export const checkPageBreak = (doc) => {
  const needPageBreak = doc.y > doc.page.height - config.reports.footer_reserve_space
  console.info('need page break?', needPageBreak)
  if (needPageBreak) {
    doc.addPage()
    return true
  }
  return false
}

export const getQuizExplanationsBySlugREST = slug => {
  return {
    filters: {
      slug: {
        $eq: slug
      }
    },
    populate: {
      questions: {
        populate: {
          media: {
            fields: [
              'name', 'alternativeText', 'caption', 'width', 'height', 'formats',
              'hash', 'ext', 'mime', 'size', 'url', 'previewUrl', 'provider',
              'provider_metadata', 'createdAt', 'updatedAt', 'publishedAt'
            ]
          },
          answers: {
            populate: {
              media: {
                fields: [
                  'name', 'alternativeText', 'caption', 'width', 'height', 'formats',
                  'hash', 'ext', 'mime', 'size', 'url', 'previewUrl', 'provider',
                  'provider_metadata', 'createdAt', 'updatedAt', 'publishedAt'
                ]
              }
            }
          }
        }
      },
      resultCategories: {
        populate: {
          media: {
            fields: [
              'name', 'alternativeText', 'caption', 'width', 'height', 'formats',
              'hash', 'ext', 'mime', 'size', 'url', 'previewUrl', 'provider',
              'provider_metadata', 'createdAt', 'updatedAt', 'publishedAt'
            ]
          }
        }
      }
    },
    fields: [
      'documentId',
      'createdAt', 'updatedAt', 'publishedAt', 'isActive', 'version',
      'description', 'slug', 'title'
    ]
  }
}