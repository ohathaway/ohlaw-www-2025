import qs from 'qs'

/**
 * Content Recommendations Engine for Quiz Reports
 * 
 * Generates blog post recommendations using a hybrid approach:
 * 1. Extract direct mappings from quiz answer forFurtherReference data
 * 2. Fill gaps using Meilisearch for topics without direct mappings
 * 3. Prioritize and limit to maximum recommendations
 * 4. Store results in KV with dedicated namespace
 */

/**
 * Convert answers object format to array format expected by other functions
 * @param {Object} answersObj - Answers in object format {"q1": ["q1a1"], "q2": "q2a3", ...}
 * @param {Object} quizData - Full quiz data from Strapi with answer details
 * @returns {Array} Answers in array format expected by the system
 */
const convertAnswersToArray = (answersObj, quizData) => {
  const answersArray = []
  
  // Get questions from quiz data if available
  const questions = quizData?.quizzes?.[0]?.questions || []
  
  // Create one entry per selected answer (not per question)
  Object.entries(answersObj).forEach(([questionId, answerValue]) => {
    const answerValues = Array.isArray(answerValue) ? answerValue : [answerValue]
    const question = questions.find(q => q.questionId === questionId)
    
    answerValues.forEach(answerId => {
      const answerDetails = question?.answers?.find(a => a.answerId === answerId)
      
      answersArray.push({
        id: answerId,
        questionId: questionId,
        answerId: answerId,
        // Include the forFurtherReference data if available
        forFurtherReference: answerDetails?.forFurtherReference || null,
        tags: answerDetails?.tags || [],
        answerText: answerDetails?.answerText || '',
        whyItMatters: answerDetails?.whyItMatters || '',
        impact: answerDetails?.impact || ''
      })
    })
  })
  
  return answersArray
}

/**
 * Main function to recommend blog posts based on quiz answers
 * @param {Array} userAnswers - Array of user's selected answers
 * @param {Object} processedAnswers - Processed quiz results
 * @param {number} maxRecommendations - Maximum number of recommendations (default: 5)
 * @param {Object} quizData - Full quiz data from Strapi with answer details
 * @returns {Promise<Array>} Array of recommended blog posts
 */
export const recommendBlogPosts = async (userAnswers, processedAnswers, maxRecommendations = 5, quizData = null) => {
  try {
    // Handle userAnswers as either JSON string or parsed object
    const userAnswersObj = typeof userAnswers === 'string' 
      ? JSON.parse(userAnswers) 
      : userAnswers
    
    // Convert object format to array format expected by the rest of the functions
    const userAnswersArray = convertAnswersToArray(userAnswersObj, quizData)
    console.info('userAnswersArray:', userAnswersArray)
    console.log('Starting blog post recommendations for', userAnswersArray.length, 'user answers')
    
    // Phase 1: Extract direct mappings from forFurtherReference
    const directMappings = extractDirectMappings(userAnswersArray)
    console.log('Direct mappings found:', directMappings.length)
    
    // Phase 2: Identify topics without direct mappings and search for them
    const missingTopics = identifyMissingTopics(userAnswersArray, directMappings)
    const excludeIds = directMappings.map(post => post.documentId).filter(Boolean)
    const searchResults = await searchForGaps(missingTopics, excludeIds)
    console.log('Search results for gaps:', searchResults.length)
    
    // Phase 3: Combine and prioritize recommendations
    const allRecommendations = [...directMappings, ...searchResults]
    const prioritized = scoreAndPrioritize(allRecommendations, userAnswersArray)
    
    // Phase 4: Limit to maximum recommendations
    const finalRecommendations = prioritized.slice(0, maxRecommendations)
    console.log('Final recommendations:', finalRecommendations.length)
    
    return finalRecommendations
  } catch (error) {
    console.error('Error generating blog post recommendations:', error)
    return []
  }
}

/**
 * Extract direct blog post mappings from quiz answers with forFurtherReference data
 * @param {Array} userAnswers - Array of user's selected answers
 * @returns {Array} Array of blog posts from direct mappings
 */
export const extractDirectMappings = (userAnswers) => {
  const directPosts = []
  
  userAnswers.forEach(answer => {
    if (answer.forFurtherReference && answer.forFurtherReference.Title) {
      const post = {
        Title: answer.forFurtherReference.Title,
        tags: answer.forFurtherReference.tags || [],
        source: 'direct_mapping',
        answerId: answer.id,
        // Note: Direct mappings may not have full post data like documentId, slug, etc.
        // These would need to be resolved via Strapi search if needed
      }
      directPosts.push(post)
      console.log('Direct mapping extracted:', post.Title)
    }
  })
  
  return directPosts
}

/**
 * Identify topics that don't have direct mappings and need to be searched
 * @param {Array} userAnswers - Array of user's selected answers
 * @param {Array} directMappings - Already found direct mappings
 * @returns {Array} Array of topic terms to search for
 */
const identifyMissingTopics = (userAnswers, directMappings) => {
  const directTopics = new Set()
  const allAnswerTopics = new Set()
  
  // Collect topics from direct mappings
  directMappings.forEach(post => {
    post.tags?.forEach(tag => directTopics.add(tag.Name || tag.name))
  })
  
  // Collect potential topics from all answers (could be derived from answer text, tags, etc.)
  userAnswers.forEach(answer => {
    // This is a simplified approach - in practice, you might want to:
    // 1. Extract keywords from answer text
    // 2. Use predefined topic mappings
    // 3. Analyze question context for topic extraction
    if (answer.tags) {
      answer.tags.forEach(tag => allAnswerTopics.add(tag.Name || tag.name))
    }
  })
  
  // Find topics that don't have direct mappings
  const missingTopics = [...allAnswerTopics].filter(topic => !directTopics.has(topic))
  console.log('Missing topics needing search:', missingTopics)
  
  return missingTopics
}

/**
 * Search for blog posts to fill topic gaps using Meilisearch
 * @param {Array} missingTopics - Topics without direct mappings
 * @param {Array} excludeIds - Post IDs to exclude from search results
 * @returns {Promise<Array>} Array of blog posts from search results
 */
export const searchForGaps = async (missingTopics, excludeIds = []) => {
  if (missingTopics.length === 0) {
    console.log('No missing topics to search for')
    return []
  }
  
  try {
    const searchResults = []
    const { meilisearch } = useAppConfig()
    
    // Search for each missing topic
    for (const topic of missingTopics) {
      console.log('Searching for topic:', topic)
      
      const searchResponse = await $fetch(`${meilisearch.host}/indexes/post/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          q: topic,
          limit: 2, // Limit per topic to prevent over-representation
          attributesToRetrieve: [
            'documentId',
            'Title', 
            'slug',
            'Snippet',
            'tags',
            'category',
            'publishDate'
          ]
        }
      })
      
      if (searchResponse.hits) {
        searchResponse.hits.forEach(hit => {
          // Exclude posts already included in direct mappings
          if (!excludeIds.includes(hit.documentId)) {
            searchResults.push({
              ...hit,
              source: 'search_gap_fill',
              searchTopic: topic
            })
          }
        })
      }
    }
    
    console.log('Search gap fill results:', searchResults.length)
    return searchResults
    
  } catch (error) {
    console.error('Error searching for gap topics:', error)
    return []
  }
}

/**
 * Score and prioritize recommendations based on user answers and post relevance
 * @param {Array} recommendations - Combined recommendations from direct mappings and search
 * @param {Array} userAnswers - User's quiz answers for scoring context
 * @returns {Array} Prioritized and scored recommendations
 */
export const scoreAndPrioritize = (recommendations, userAnswers) => {
  const scoredRecommendations = recommendations.map(post => {
    let score = 0
    
    // Higher score for direct mappings (more relevant)
    if (post.source === 'direct_mapping') {
      score += 100
    } else if (post.source === 'search_gap_fill') {
      score += 50
    }
    
    // Score based on tag relevance
    const userTopics = new Set()
    userAnswers.forEach(answer => {
      if (answer.forFurtherReference?.tags) {
        answer.forFurtherReference.tags.forEach(tag => 
          userTopics.add(tag.Name || tag.name)
        )
      }
    })
    
    if (post.tags) {
      post.tags.forEach(tag => {
        const tagName = tag.Name || tag.name
        if (userTopics.has(tagName)) {
          score += 25
        }
      })
    }
    
    // Boost score for high-importance answers (could be based on question weight)
    if (post.answerId) {
      const relatedAnswer = userAnswers.find(a => a.id === post.answerId)
      if (relatedAnswer?.weight || relatedAnswer?.importance) {
        score += (relatedAnswer.weight || relatedAnswer.importance) * 10
      }
    }
    
    return { ...post, score }
  })
  
  // Sort by score (highest first) and deduplicate by title
  const deduped = deduplicateByTitle(scoredRecommendations)
  const sorted = deduped.sort((a, b) => b.score - a.score)
  
  console.log('Scored and prioritized recommendations:', sorted.map(p => ({ title: p.Title, score: p.score })))
  return sorted
}

/**
 * Remove duplicate recommendations based on title
 * @param {Array} recommendations - Array of recommendations
 * @returns {Array} Deduplicated recommendations
 */
const deduplicateByTitle = (recommendations) => {
  const seen = new Set()
  return recommendations.filter(post => {
    if (seen.has(post.Title)) {
      return false
    }
    seen.add(post.Title)
    return true
  })
}

/**
 * Store recommendations in KV storage with quiz-specific namespace
 * @param {string} kvKey - Key for KV storage (should include quiz hash/identifier)
 * @param {Array} recommendations - Recommendations to store
 * @returns {Promise<boolean>} Success status
 */
export const storeRecommendations = async (kvKey, recommendations) => {
  try {
    const kvNamespace = `quizRecommendations:${kvKey}`
    await hubKV().set(kvNamespace, {
      recommendations,
      generatedAt: new Date().toISOString(),
      version: '1.0'
    })
    
    console.log('Recommendations stored in KV:', kvNamespace)
    return true
  } catch (error) {
    console.error('Error storing recommendations in KV:', error)
    return false
  }
}

/**
 * Retrieve stored recommendations from KV storage
 * @param {string} kvKey - Key for KV storage
 * @returns {Promise<Array|null>} Stored recommendations or null if not found
 */
export const getStoredRecommendations = async (kvKey) => {
  try {
    const kvNamespace = `quizRecommendations:${kvKey}`
    const stored = await hubKV().get(kvNamespace)
    
    if (stored && stored.recommendations) {
      console.log('Retrieved stored recommendations:', stored.recommendations.length)
      return stored.recommendations
    }
    
    return null
  } catch (error) {
    console.error('Error retrieving stored recommendations:', error)
    return null
  }
}