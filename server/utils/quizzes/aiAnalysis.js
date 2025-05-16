// server/utils/aiAnalysis.js
import { createHash } from 'crypto'

/**
 * Analyze quiz results using AI to identify key findings
 */
export const analyzeQuizResults = async (quizData, userAnswers, scoreResult) => {
  try {
    const ai = hubAI()
    
    // Create a cache key based on inputs
    const cacheKey = `quiz_analysis_${createHash('md5')
      .update(JSON.stringify(userAnswers))
      .digest('hex')}_${scoreResult}`
    
    // Check if we have a cached result
    const cached = await hubKV().get(cacheKey)
    if (cached) return cached
    
    // Prepare the AI prompt
    const models = {
      gemma7b: '@cf/google/gemma-7b-it-lora',
      llama31InstructFast: '@cf/meta/llama-3.1-8b-instruct-fast',
      llama4Instruct: '@cf/meta/llama-4-scout-17b-16e-instruct'
    }

    const findingsSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          finding: {
            type: "string",
            description: "A concise statement of the key finding (1 sentence)"
          },
          explanation: {
            type: "string",
            description: "A brief explanation of why this matters (2-3 sentences)"
          },
          recommendationId: {
            type: ["null", "string"],
            description: "Reference ID to any matching recommendations (can be null)"
          },
          impactRating: {
            type: "integer",
            minimum: 1,
            maximum: 10,
            description: "A number from 1 to 10 indicating how impactful the finding is to the overall score where 1 is not very impactful and 10 is determinative"
          }
        },
        required: ["finding", "explanation", "recommendationId", "impactRating"]
      }
    }

    const aiStream = await ai.chat(models.llama31InstructFast, {
      messages: [
        {
          role: 'system',
          content: `You are an estate planning advisor analyzing quiz results for potential estate-planning DIY'ers. Extract key findings from the user's responses that are driving their estate planning complexity score.`
        },
        {
          role: 'user',
          content: `Based on these quiz responses, identify the key drivers of complexity in this person's estate planning needs.
          Phase your responses in language appropriate to include in a formatted report which will be delivered to the user.
          Assume the user reads at a 3rd grade level.
          
          Quiz configuration: ${JSON.stringify(quizData, null, 2)}
          User answers: ${JSON.stringify(userAnswers, null, 2)}
          Final score: ${scoreResult}
          `
        }
      ],
      max_tokens: 2048,     // Increase max tokens to ensure complete response
      temperature: 0.2,     // Lower temperature for more deterministic/predictable output
      response_format: {
        type: "json_schema",
        json_schema: findingsSchema
      },
      stream: true
    })
    

    console.info('ai response:', JSON.stringify(aiResponse, null, 2))

    // Parse and validate the response

    // Cache the result (expires in 7 days)
    await hubKV().set(cacheKey, JSON.stringify(aiResponse), { 
      expiresIn: 7 * 24 * 60 * 60 
    })

    return aiResponse.response
  } catch (error) {
    console.error('AI analysis error:', error)
    // Return empty array or default findings as fallback
    return []
  }
}