// server/utils/aiAnalysis.js
import Anthropic from '@anthropic-ai/sdk'
import { isEmpty } from '~~/app/utils/lang'

/*
### Your Estate Planning Analysis
      [A warm, personal summary that speaks directly to the user about their specific situation. Start with validation of their quiz-taking effort, then explain what their answers reveal about their needs. Use concrete examples and avoid abstract concepts.]

*/

export const analyzeQuizResults = async (quizData, userAnswers, scoreResult) => {
  try {
    // const ai = hubAI()

    console.info('quizData:', quizData)
    const models = {
      gemma7b: '@cf/google/gemma-7b-it-lora',
      llama31InstructFast: '@cf/meta/llama-3.1-8b-instruct-fast',
      llama4Instruct: '@cf/meta/llama-4-scout-17b-16e-instruct',
      claude4Opus: 'claude-opus-4-20250514',
    }

    // Stream response
    let rawResponse
    const codeBlock = '```'
    const systemPrompt = `
      You are an estate planning advisor analyzing quiz results from an online quiz that assesses the advisability of a user to DIY their estate plan.

      The answer options on each quiz question have received a value rating from a very experienced estate planning attorney. Higher values indicate more complexity. Lower values indicate less complexity Higher values indicate more complexity. Lower values indicate less complexity.

      The quiz result is calculated by adding all the selected answer values, then categorizing the result using the resultCategories entries in the quiz data.

      Each answer has a property explaining whyItMatters and the impact this answer has on the complexity of the user's estate planning.

      Some answers contain an override value identified as minimumResultScore. If a user choses one of these answers, the final result of summing the value of all selected answers can be no lower than the minimumResultScore. This will result in the user either certainly or almost certainly receiving a recommendation of professional support.

      ## Input format
      You will receive input in the following format:

      ${codeBlock}json
      ## Quiz Context
      [JSON-formatted string containing all relevant quiz information]
      
      ## User Responses
      [JSON-formatted string containing the quiz answers selected by the user]
      ${codeBlock}

      ## Analysis Instructions
      Follow these steps.

      1. Review the Quiz Context data supplied and try to understand how the attorney who wrote it was thinking about DIY estate planning.
      2. Based on the value assigned to each answer selected by the user, identify key drivers that influence the resulting resultCategory. 
      3. Identify any override answers present in the user's answers.
      4. Using the "whyItMatters" and "impact" statements from the quiz context draft a response in the Output Format.
      5. Review and edit your response against the user's actual answers, paying attention to answers selected and answers not selected, to make sure your response makes sense. For instance, don't make comments about minor children if the user did not indicate that their children are minors.
      
      Write in a warm, conversational tone as if speaking directly to the quiz taker. Use "you" and "your" throughout. Avoid legal jargon and explain concepts in plain English. Focus on practical implications rather than technical details. The fact that the user is taking this quiz indicates an inclination for DIY, so validate that inclination even if the recommendation is to use professional help.

      ## Output Format
      Provide your analysis in this format:
      ${codeBlock}json
      Return a JSON array of objects with these properties:
      - "finding": A clear, jargon-free statement about their situation (1 sentence, written directly to them)
      - "explanation": Why this matters for their family in practical terms (2-3 sentences, using "you" and "your")
      - "actionable": A specific next step they can take (1 sentence)
      - "quizFactors": Array of question IDs that contributed to this finding
      - "isOverride": Boolean indicating if this requires professional help regardless of other factors
      - "priority": "High", "Medium", or "Low" based on urgency and impact
      - "recommendationId": Reference ID to any matching recommendations (can be null)
      ${codeBlock}

      Your analysis is going to be parsed for insertion into a formatted PDF, so do not output anything other than the JSON array. Anything else will be ignored.
    `
    const prompt = `
      ## Quiz Context
      ${codeBlock}json
      ${JSON.stringify(quizData, null, 2)}
      ${codeBlock}

      ## User Responses
      ${codeBlock}json
      ${JSON.stringify(userAnswers, null, 2)}
      ${codeBlock}
    `

    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'array',
      items: {
        type: 'object',
        required: [
          'finding',
          'explanation',
          'actionable',
          'quizFactors',
          'isOverride',
          'priority',
          'recommendationId',
        ],
        properties: {
          finding: {
            type: 'string',
            description: 'A concise summary of the user\'s estate planning situation or key issue identified.',
            minLength: 20,
            maxLength: 150,
            pattern: '^[A-Za-z0-9,.\\s-]+$',
          },
          explanation: {
            type: 'string',
            description: 'A clear explanation of why the finding matters, including potential risks or consequences if not addressed.',
            minLength: 50,
            maxLength: 300,
            pattern: '^[A-Za-z0-9,.\\s-]+$',
          },
          actionable: {
            type: 'string',
            description: 'A specific, practical step or recommendation the user can take to address the finding.',
            minLength: 30,
            maxLength: 200,
            pattern: '^[A-Za-z0-9,.\\s-]+$',
          },
          quizFactors: {
            type: 'array',
            description: 'A list of quiz question IDs or factors that contributed to this recommendation.',
            minItems: 1,
            items: {
              type: 'string',
              pattern: '^q[0-9]+[a-z0-9]*$',
            },
          },
          isOverride: {
            type: 'boolean',
            description: 'Indicates if this recommendation takes precedence over others due to critical factors (e.g., high estate value, complex family dynamics).',
          },
          priority: {
            type: 'string',
            description: 'The urgency or importance of the recommendation.',
            enum: ['High', 'Medium', 'Low'],
          },
          recommendationId: {
            type: 'string',
            description: 'A unique identifier for the recommendation pathway.',
            minLength: 5,
            maxLength: 50,
            pattern: '^[A-Za-z0-9\\s-]+$',
          },
        },
        additionalProperties: false,
      },
      minItems: 1,
      maxItems: 5,
    }

    const { claude: { apiKey } } = useRuntimeConfig()

    const anthropic = new Anthropic({
      apiKey,
    })

    const response = await anthropic.messages.create({
      model: models.claude4Opus,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        { role: 'user', content: prompt },
      ],
    })

    console.info('response from claude:', response)
    return response
    /*
    const stream = await ai.run(models.gemma7b, {
      prompt,
      guided_json: schema,
      max_tokens: 2048,
      // temperature: 0.2,
      stream: true  // Enable streaming!
    })

    const decoder = new TextDecoder()
    // Use the correct event listeners for NuxtHub
    for await (const chunk of stream) {
      const textChunk = decoder.decode(chunk)
      // console.info('recieved chunk:', `'${textChunk}'`)
      rawResponse += textChunk
    }

    decoder.decode()
    */

    /*
    aiResponse.on('done', () => {
      try {
        // Try to extract and parse JSON from the response
        const jsonMatch = fullResponse.match(/\[\s*\{.*\}\s*\]/s)
        if (jsonMatch) {
          const keyFindings = JSON.parse(jsonMatch[0])
          resolve({ success: true, keyFindings })
        } else {
          // Fallback: Try to extract individual findings
          const findings = extractFindings(fullResponse)
          resolve({ success: true, keyFindings: findings })
        }
      } catch (error) {
        console.error('Failed to process response:', error)
        resolve({
          success: false,
          error: 'Failed to parse findings',
          rawResponse: fullResponse
        })
      }
    })

    aiResponse.on('error', (error) => {
      console.error('AI stream error:', error)
      reject(error)
    })
    */
    // const trimmedResponse = trimResponse(rawResponse)
    // console.info('full chunks:', trimmedResponse)
  }
  catch (error) {
    console.error('AI analysis error:', error)
    return []
  }
}

// Helper function to process JSON response
function processJsonResponse(responseText) {
  if (!responseText) return []

  // Try standard JSON parsing first
  try {
    const parsed = JSON.parse(responseText)
    // It could be an array directly or nested in a property
    if (Array.isArray(parsed)) {
      return parsed
    }
    else if (parsed.findings && Array.isArray(parsed.findings)) {
      return parsed.findings
    }
    else {
      // Loop through to find any array property that might contain findings
      for (const key in parsed) {
        if (Array.isArray(parsed[key])) {
          return parsed[key]
        }
      }
      // If it has finding/explanation properties, wrap it in an array
      if (parsed.finding && parsed.explanation) {
        return [parsed]
      }
    }
  }
  catch (error) {
    console.warn('JSON parsing failed, trying to extract JSON:', error)
  }

  // If JSON parsing fails, try to extract JSON from the text
  // This is especially useful for streaming where we might get partial JSON
  try {
    // Look for JSON array pattern
    const jsonMatch = responseText.match(/\[\s*\{.*\}\s*\]/s)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    // If we can't find a complete array, try to extract individual findings
    const findings = []
    const findingRegex = /\{\s*"finding"\s*:\s*"([^"]*)"\s*,\s*"explanation"\s*:\s*"([^"]*)"\s*,\s*"recommendationId"\s*:\s*([^,]*)\s*,\s*"impactRating"\s*:\s*(\d+)\s*\}/g

    let match
    while ((match = findingRegex.exec(responseText)) !== null) {
      findings.push({
        finding: match[1],
        explanation: match[2],
        recommendationId: match[3] === 'null' ? null : match[3],
        impactRating: parseInt(match[4]),
      })
    }

    if (findings.length > 0) {
      return findings
    }
  }
  catch (extractError) {
    console.error('Failed to extract findings from response:', extractError)
  }

  // Fallback to empty array if all parsing attempts fail
  return []
}

// Helper function to extract findings
function extractFindings(text) {
  const findings = []
  const findingRegex = /\{\s*"finding"\s*:\s*"([^"]*)"\s*,\s*"explanation"\s*:\s*"([^"]*)"\s*,\s*"recommendationId"\s*:\s*([^,]*)\s*,\s*"impactRating"\s*:\s*(\d+)\s*\}/g

  let match
  while ((match = findingRegex.exec(text)) !== null) {
    findings.push({
      finding: match[1],
      explanation: match[2],
      recommendationId: match[3] === 'null' ? null : match[3],
      impactRating: parseInt(match[4]),
    })
  }

  return findings
}

const trimResponse = (raw) => {
  // return raw.replace(/data:\s/, '')
  const trimmed = raw.split('\n')
    .filter((line) => {
      return !isEmpty(line) && !line.match(/DONE/)
    }).reduce((acc, curr) => {
      const rawJson = curr.replace(/undefined/, '').replace(/^data:\s/, '')
      return acc + JSON.parse(rawJson).response
    }, '')
  return trimmed
}
