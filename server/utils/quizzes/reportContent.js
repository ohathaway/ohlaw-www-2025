// server/utils/quizzes/reportContent.js

export const addCoverPage = (doc, user, quizResults) => {
  // Page dimensions
  const pageWidth = doc.page.width
  const pageHeight = doc.page.height
  
  // Add vertical lines at the top
  doc.strokeColor('#1a1a1a') // Gray color for lines
     .lineWidth(2)
     .moveTo(150, 0)
     .lineTo(150, 130)
     .stroke()
     .moveTo(170, 0)
     .lineTo(170, 60)
     .stroke()
  
  // Add logo on the right side
  // Note: You'll need to adjust the path to your circular logo
  doc.image('public/img/ohlaw_icon_circle_gray_drop2.png', pageWidth - 200, 100, { width: 100 })
  
  // Add title in ITC Benguiat font (assuming you have this font in your project)
  // You may need to specify the path to your Benguiat font file
  doc.font('app/assets/fonts/BenguiatRegular.ttf')
     .fontSize(50)
     .fillColor('#000000')
     .text('Estate', 150, 170, { lineGap: -10 })
     .fontSize(50)
     .text('Planning', 150, doc.y, { lineGap: -10 })
     .fontSize(50)
     .text('Assessment', 150, doc.y, { lineGap: -10 })
  
  // Prepared for section - center of page
  const middleY = pageHeight / 2 - 55
  doc.font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
     .fontSize(16)
     .fillColor('#244091') // Blue for heading
     .text('Prepared For:', 100, middleY + 250, { continued: false })
  
  // User name
  doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
     .fontSize(24)
     .fillColor('#000000')
     .text(`${user.firstName} ${user.lastName}`, 100, doc.y + 10)
  
  // Add date
  doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
     .fontSize(12)
     .fillColor('#333333')
     .text(new Date().toLocaleDateString('en-US', { dateStyle: 'long' }), 100, doc.y + 10)
  
  // Result section
  const resultY = middleY
  doc.font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
     .fontSize(16)
     .fillColor('#244091') // Blue for heading
     .text('Your Result:', 150, resultY + 20)
  
  // Pathway name
  doc.font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
     .fontSize(22)
     .fillColor('#000000')
     .text(quizResults.pathwayName, 150, doc.y + 10)
  
  // Pathway summary
  doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
     .fontSize(14)
     .fillColor('#000000')
     .text(quizResults.pathwaySummary, 150, doc.y + 15, { 
       width: pageWidth - 250,
       align: 'left'
     })
  
  // Add blue circle in bottom right
  doc.circle(pageWidth - 50, pageHeight - 50, pageWidth / 4)
     .fillColor('#244091')
     .fill()
  
  // Add footer
  const currentY = doc.y
  const footerY = doc.page.height - 85
  doc.moveDown(0)
    .y = footerY

  doc.font('app/assets/fonts/TrajanPro-Regular.ttf')
     .fontSize(10)
     .fillColor('#333333')
     .text('The Law Offices of Owen Hathaway', 50, footerY)
     .text('ohlawcolorado.com • office: 970-818-3052 • sms: 970-818-5559')

  doc.y = currentY

  doc.addPage()
  return doc
}

export const addTableOfContents = (doc) => {

  doc.fontSize(18)
    .text('Table of Contents', { align: 'center' })
    .moveDown(1)

  // Define the left and right margins
  const margin = 150
  const leftMargin = margin
  const rightMargin = doc.page.width - margin

  // Define the dot fill area
  const pageNumWidth = 20

  doc.fontSize(12)

  // Create each TOC entry with a single text call
  addTocLine(doc, '1. Executive Summary', '3', pageNumWidth, leftMargin, rightMargin)
  doc.moveDown(0.5)

  addTocLine(doc, '2. Your Assessment Details', '4', pageNumWidth, leftMargin, rightMargin)
  doc.moveDown(0.5)

  addTocLine(doc, '3. Next Steps & Recommendations', '12', pageNumWidth, leftMargin, rightMargin)
  doc.moveDown(0.5)

  addTocLine(doc, '4. Resources & Tools', '14', pageNumWidth, leftMargin, rightMargin)
  doc.moveDown(2)

  // Add new page
  doc.addPage()
  return doc
}

export const addExecutiveSummary = (doc, quizResults) => {
  // Add section header
  addSectionHeader(doc, 'Executive Summary')

  doc.fontSize(12)
    .text('Based on your responses to our Estate Planning Pathway Finder assessment, we\'ve ' +
      'identified key areas to focus on for your estate planning needs. This report provides ' +
      'a detailed analysis of your situation and recommendations tailored to your specific circumstances.')
    .moveDown(1)

  // Add key findings
  doc.font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
    .fontSize(14)
    .text('Key Findings')
    .moveDown(0.5)

  doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
    .fontSize(12)
    .text('• ' + quizResults.keyFindings[0])
    .moveDown(0.5)
    .text('• ' + quizResults.keyFindings[1])
    .moveDown(0.5)
    .text('• ' + quizResults.keyFindings[2])
    .moveDown(1)

  // Add recommendation
  doc.font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
    .fontSize(14)
    .text('Our Recommendation')
    .moveDown(0.5)

  doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
    .fontSize(12)
    .text(quizResults.recommendation)
    .moveDown(2)

  // Add new page
  doc.addPage()
  return doc
}

export const addQuestionAnalysis = (doc, answers, explanations) => {
  // Add section header
  addSectionHeader(doc, 'Your Assessment Details')
  doc.fontSize(12)
    .text('This section provides a detailed analysis of your responses to each question in our ' +
      'assessment, including why each factor is important and how it impacts your estate planning needs.')
    .moveDown(1)

  // For each question and answer
  answers.forEach((item, index) => {
    checkPageBreak(doc)

    // Determine if this is a multiple choice question
    const isMultipleChoice = Array.isArray(item.answerId);
    
    // Find explanation for a specific answerId
    const getExplanation = (answerId) => {
      const foundExplanation = explanations.find(exp => exp.answerId === answerId);
      return foundExplanation || {
        whyItMatters: "This aspect of planning requires consideration based on your individual circumstances.",
        impact: "Your selection may influence the optimal structure of your estate plan."
      };
    };
    
    checkPageBreak(doc)
    // Question number and text
    doc.font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
      .fontSize(14)
      .text(`Question ${index + 1}: ${item.questionText}`)
      .moveDown(0.5)
      
    // Handling single choice questions
    if (!isMultipleChoice) {
      // Your answer
      doc.fontSize(12)
        .text('Your Answer:')
        .moveDown(0.25)
        
      doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
        .text(item.answerText)
        .moveDown(0.5)
      
      // Get explanation for single answer
      const explanation = getExplanation(item.answerId);
      
      checkPageBreak(doc)
      // Why this matters
      doc.font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
        .fontSize(12)
        .text('Why This Matters:')
        .moveDown(0.25)
      doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
        .text(explanation.whyItMatters)
        .moveDown(0.5)
        
      checkPageBreak(doc)
      // Impact on plan
      doc.font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
        .fontSize(12)
        .text('Impact on Your Estate Plan:')
        .moveDown(0.25)
      doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
        .text(explanation.impact)
        .moveDown(1)
    } 
    // Handling multiple choice questions
    else if (isMultipleChoice && Array.isArray(item.answerText) && Array.isArray(item.answerId)) {
      
      checkPageBreak(doc)
      doc.fontSize(12)
        .text('Your Answers:')
        .moveDown(0.25)
         // Handle different answer formats functionally
      item.answerText.forEach(answer => {
        doc.text(`• ${answer}`).moveDown(0.25)
      })
      
      checkPageBreak(doc)
      // Loop through each selected answer
      item.answerId.forEach((answerId, answerIndex) => {
        const answerText = item.answerText[answerIndex];
        const explanation = getExplanation(answerId);
        
        // Create a box for each answer and its explanation
        doc.rect(50, doc.y, doc.page.width - 100, 2)
           .lineWidth(0.5)
           .fillAndStroke('#f0f0f0', '#cccccc')
           .moveDown(0.5);
        
        // Answer text with bullet
        doc.font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
           .fillColor('#000000')
           .text(`Answer: ${answerText}`, { underline: true })
           .moveDown(0.5)
        
        // Explanation specific to this answer choice
        doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
           .fontSize(11)
           .moveDown(0.25)
           
        checkPageBreak(doc)
        doc.font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
           .text('Why This Matters:', { continued: true })
           .font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
           .text(` ${explanation.whyItMatters}`)
           .moveDown(0.5)
           
        doc.font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
           .text('Impact:', { continued: true })
           .font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
           .text(` ${explanation.impact}`)
           .moveDown(1)
      });
      
      checkPageBreak(doc)
      // Add an overall impact summary for multiple choice
      doc.font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
         .fontSize(12)
         .text('Overall Impact on Your Estate Plan:')
         .moveDown(0.25)
      doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
         .text('The combination of these selections indicates specific needs that should be addressed in your estate planning approach.')
         .moveDown(1)
    }

    checkPageBreak(doc)
    // Add a divider line except for the last question
    if (index < answers.length - 1) {
      doc.moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke()
        .moveDown(1)
    }
    
    // Check if we need a new page (if near bottom)
    if (doc.y > doc.page.height - 150 && index < answers.length - 1) {
      doc.addPage()
    }
  })
  
  // Add new page
  doc.addPage()
  return doc
}

export const addNextSteps = (doc, quizResults) => {
  // Add section header
  addSectionHeader(doc, 'Next Steps & Recommendations')

  doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
    .fontSize(12)
    .text('Based on your assessment results, here are the recommended next steps for your estate planning journey:')
    .moveDown(1)

  // Add steps based on pathway
  quizResults.nextSteps.forEach((step, index) => {
    doc.font('app/assets/fonts/BenguiatRegular.ttf')
      .fontSize(14)
      .fill('#244091')
      .text(`Step ${index + 1}: ${step.title}`, 75)
      .moveDown(0.5)

    doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
      .fontSize(12)
      .fill('#000000')
      .text(step.description, 50)
      .moveDown(1)
  })

  // Add call to action
  doc.rect(50, doc.y, doc.page.width - 100, 140)
    .fill('#f0f0f0')

  const boxY = doc.y

  doc.fillColor('#000')
    .font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
    .fontSize(14)
    .text('Ready to Take the Next Step?', 75, boxY + 20)
    .moveDown(0.5)

  doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
    .fontSize(12)
    .text('Schedule a consultation with the Law Offices of Owen Hathaway to discuss your ' +
      'estate planning needs and how we can help you put a plan in place that' +
      ' actually works when you need it to.',
      75, doc.y, { width: doc.page.width - 150 })
    .moveDown(0.5)

  doc.font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
    .text('Call: (970) 818-3052 or Visit: ohlawcolorado.com/contact')
    .moveDown(2)

  // Add new page
  doc.addPage()
  return doc
}

export const addResources = (doc) => {
  // Add section header
  addSectionHeader(doc, 'Resources & Tools')

  doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
    .fontSize(12)
    .text('These resources will help you learn more about estate planning and prepare for your next steps:')
    .moveDown(1)

  // Blog articles
  doc.font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
    .fontSize(14)
    .text('Recommended Reading:')
    .moveDown(0.5)

  doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
    .fontSize(12)
    .text('• The Difference Between Wills and Trusts')
    .moveDown(0.25)
    .text('• Understanding Powers of Attorney')
    .moveDown(0.25)
    .text('• How to Protect Your Digital Assets')
    .moveDown(1)

  // Tools
  doc.font('app/assets/fonts/PlusJakartaSans-Bold.ttf')
    .fontSize(14)
    .text('Helpful Tools:')
    .moveDown(0.5)

  doc.font('app/assets/fonts/PlusJakartaSans-Regular.ttf')
    .fontSize(12)
    .text('• Estate Planning Checklist')
    .moveDown(0.25)
    .text('• Asset Inventory Worksheet')
    .moveDown(0.25)
    .text('• Guardian Nomination Form')
    .moveDown(1)

  // Add disclaimer
  doc.font('app/assets/fonts/PlusJakartaSans-LightItalic.ttf')
    .fontSize(10)
    .text('Disclaimer: This report provides general information about estate planning and is not ' +
      'legal advice. For advice specific to your situation, please consult with an attorney. ' +
      'The Law Offices of Owen Hathaway provides this information as an educational resource.')
    .moveDown(2)
  return doc
}
