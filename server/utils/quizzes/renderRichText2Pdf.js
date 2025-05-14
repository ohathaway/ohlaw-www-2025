// server/utils/quizzes/renderRichTextToPdf.js

/**
 * Renders rich text content to a PDFKit document
 * @param {PDFDocument} doc - The PDFKit document
 * @param {Array} blocks - The rich text content blocks from richTextToPdf
 * @param {Object} options - Configuration options
 */
export const renderRichTextToPdf = (doc, blocks = [], options = {}) => {
  const config = {
    baseFont: 'app/assets/fonts/PlusJakartaSans-Regular.ttf',
    boldFont: 'app/assets/fonts/PlusJakartaSans-Bold.ttf',
    italicFont: 'app/assets/fonts/PlusJakartaSans-Italic.ttf',
    boldItalicFont: 'app/assets/fonts/PlusJakartaSans-BoldItalic.ttf',
    codeFont: 'app/assets/fonts/NotoSansMono-Regular.ttf',
    baseFontSize: 12,
    baseLineHeight: 1.5,
    margins: { left: 50, right: 50 },
    contentWidth: doc.page.width - 100, // Default, can be overridden
    checkPageBreak: needsPageBreak,
    ...options
  }
  
  // Pipe each block through the rendering pipeline
  blocks.forEach(block => {
    if (config.checkPageBreak(doc, block, config)) {
      doc.addPage()
    }
    
    renderBlock(doc, block, config)
  })
  
  return doc // Return doc for potential chaining
}

// Main block renderer - dispatches to type-specific renderers
const renderBlock = (doc, block, config) => {
  const renderers = {
    heading: renderHeading,
    paragraph: renderParagraph,
    list: renderList,
    spacer: renderSpacer,
    // Add more as needed
  }
  
  const renderer = renderers[block.type]
  return renderer ? renderer(doc, block, config) : doc
}

// Type-specific renderers

const renderHeading = (doc, heading, config) => {
  doc.font(config.boldFont)
     .fontSize(heading.fontSize)
     .text(heading.text, {
       width: config.contentWidth,
       align: 'left'
     })
     .moveDown(1)
  
  return doc
}

const renderParagraph = (doc, paragraph, config) => {
  // For empty paragraphs
  if (!paragraph.spans?.length) {
    return doc.moveDown(1)
  }
  
  // Capture starting position
  const startX = doc.x
  let currentX = startX
  let lineWidth = 0
  
  // Reset to base font and size
  doc.font(config.baseFont)
     .fontSize(config.baseFontSize)
  
  // Render all spans in the paragraph
  paragraph.spans.forEach((span, index) => {
    const isLast = index === paragraph.spans.length - 1
    
    // Apply font styling
    applyTextStyle(doc, span, config)
    
    // Calculate text dimensions
    const textWidth = doc.widthOfString(span.text)
    
    // Check for line wrapping
    if (lineWidth + textWidth > config.contentWidth) {
      doc.text('', { continued: false }) // End current line
      currentX = startX
      lineWidth = 0
    }
    
    // Render text
    if (span.style === 'link') {
      doc.fillColor('#0000FF')
         .text(span.text, currentX, doc.y, {
           continued: !isLast,
           underline: true
         })
         .fillColor('#000000') // Reset color
    } else {
      doc.text(span.text, currentX, doc.y, {
        continued: !isLast
      })
    }
    
    // Update position tracking
    currentX += textWidth
    lineWidth += textWidth
  })
  
  // Ensure paragraph is terminated
  doc.text('', { continued: false })
     .moveDown(1)
  
  return doc
}

const renderList = (doc, list, config) => {
  // Reset to base font
  doc.font(config.baseFont)
     .fontSize(config.baseFontSize)
  
  // Track original X position
  const startX = doc.x
  
  // Render each list item
  list.items.forEach((item, index) => {
    // Determine bullet or number
    const marker = list.format === 'ordered' 
      ? `${index + 1}. ` 
      : config.listBullet
    
    // Add marker
    doc.text(marker, startX, doc.y, { continued: true })
    
    // Position for the content
    const markerWidth = doc.widthOfString(marker)
    const textX = startX + markerWidth + 5
    
    // Reset position
    doc.x = textX
    
    // Render spans within the item
    item.spans.forEach((span, i) => {
      const isLast = i === item.spans.length - 1
      
      // Apply styling
      applyTextStyle(doc, span, config)
      
      // Render text
      if (span.style === 'link') {
        doc.fillColor('#0000FF')
           .text(span.text, { continued: !isLast, underline: true })
           .fillColor('#000000')
      } else {
        doc.text(span.text, { continued: !isLast })
      }
    })
    
    // End item and move down
    doc.text('', { continued: false })
       .moveDown(0.5)
    
    // Reset X position
    doc.x = startX
  })
  
  // Space after list
  doc.moveDown(0.5)
  
  return doc
}

const renderSpacer = (doc, spacer, config) => {
  return doc.moveDown(spacer.height / doc.currentLineHeight())
}

// Helper functions

const applyTextStyle = (doc, span, config) => {
  // Font selection based on style combinations
  const fontMap = {
    code: config.codeFont,
    bold: config.boldFont,
    italic: config.italicFont,
    'bold-italic': config.boldItalicFont,
  }
  
  // Determine correct font
  let font = config.baseFont
  
  if (span.code) {
    font = fontMap.code
  } else if (span.bold && span.italic) {
    font = fontMap['bold-italic']
  } else if (span.bold) {
    font = fontMap.bold
  } else if (span.italic) {
    font = fontMap.italic
  }
  
  // Apply font
  doc.font(font)
  
  return doc
}

// Checks if a block needs a page break before rendering
const needsPageBreak = (doc, block, config) => {
  // Space estimation based on content type
  const estimateSpaceNeeded = {
    heading: (block) => block.fontSize * 2,
    paragraph: (block) => {
      if (!block.spans) return doc.currentLineHeight()
      
      const totalChars = block.spans.reduce((sum, span) => sum + span.text.length, 0)
      const avgCharsPerLine = config.contentWidth / (config.baseFontSize * 0.6)
      const estimatedLines = Math.ceil(totalChars / avgCharsPerLine)
      
      return estimatedLines * doc.currentLineHeight()
    },
    list: (block) => (block.items?.length || 1) * doc.currentLineHeight() * 1.5,
    spacer: (block) => block.height,
    default: () => doc.currentLineHeight() * 2
  }
  
  // Get the appropriate estimator
  const estimator = estimateSpaceNeeded[block.type] || estimateSpaceNeeded.default
  
  // Calculate space and check
  const spaceNeeded = estimator(block)
  const spaceAvailable = doc.page.height - doc.y - 100 // 100 for footer
  
  return spaceNeeded > spaceAvailable
}