// server/utils/aiAnalysis.js
import { isEmpty } from 'lodash-es'

export const analyzeQuizResults = async (quizData, userAnswers, scoreResult) => {
  try {
    const ai = hubAI()
    
    const models = {
      gemma7b: '@cf/google/gemma-7b-it-lora',
      llama31InstructFast: '@cf/meta/llama-3.1-8b-instruct-fast',
      llama4Instruct: '@cf/meta/llama-4-scout-17b-16e-instruct'
    }
    
    // Stream response
    let rawResponse
    const stream = await ai.run(models.llama31InstructFast, {
      messages: [
        {
          role: 'system',
          content: `You are an estate planning advisor analyzing quiz results. 
                   Return a valid JSON array of key findings.`
        },
        {
          role: 'user',
          content: `Based on these quiz responses, identify the key drivers of complexity in this person's estate planning needs.
                   
                   Quiz answers: ${JSON.stringify(userAnswers, null, 2)}
                   Final score: ${scoreResult}
                   
                   Return a JSON array of objects with these properties:
                   - "finding": A concise statement of the key finding (1 sentence)
                   - "explanation": A brief explanation of why this matters (2-3 sentences)
                   - "recommendationId": Reference ID to any matching recommendations (can be null)
                   - "impactRating": a number from 1 to 10 indicating how impactful the finding is`
        }
      ],
      max_tokens: 2048,
      // temperature: 0.2,
      // response_format: { type: "json_object" },
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
    const trimmedResponse = trimResponse(rawResponse)
    console.info('full chunks:', trimmedResponse)
  } catch (error) {
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
    } else if (parsed.findings && Array.isArray(parsed.findings)) {
      return parsed.findings
    } else {
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
  } catch (error) {
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
        impactRating: parseInt(match[4])
      })
    }
    
    if (findings.length > 0) {
      return findings
    }
  } catch (extractError) {
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
      impactRating: parseInt(match[4])
    })
  }
  
  return findings
}

const trimResponse = raw => {
  // return raw.replace(/data:\s/, '')
  const trimmed = raw.split('\n')
    .filter(line => {
      return !isEmpty(line) && !line.match(/DONE/)
    }).reduce((acc, curr) => {
      const rawJson = curr.replace(/undefined/, '').replace(/^data:\s/, '')
      return acc + JSON.parse(rawJson).response
    }, '')
  return trimmed
}