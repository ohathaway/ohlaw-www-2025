// Revised quizStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import qs from 'qs'

export const useQuizStore = defineStore('quiz', () => {
  // State
  const quiz = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const quizSubmissions = ref([])
  const isSubmitting = ref(false)
  const submissionError = ref(null)
  const started = ref(false)
  const completed = ref(false)
  const contactSubmitted = ref(false)
  const basicContactSubmitted = ref(false)
  const enhancedContactSubmitted = ref(false)
  const contactEnhanced = ref(false)
  const currentQuestionIndex = ref(0)
  const userAnswers = ref({})
  const quizResult = ref(null)
  const startTime = ref(null)

  // Getters
  const isQuizLoaded = computed(() => !!quiz.value)

  const progressPercent = computed(() => {
    if (!quiz.value || !quiz.value.questions.length) return 0
    return Math.round(((currentQuestionIndex.value + 1) / quiz.value.questions.length) * 100)
  })

  const currentQuestion = computed(() => {
    if (!quiz.value || !quiz.value.questions.length) return null
    return quiz.value.questions[currentQuestionIndex.value]
  })

  const minimumResultAnswers = computed(() => {
    if (!quiz.value || !quiz.value.questions.length) return []
    const answers = quiz.value.questions.reduce((allAnswers, question) => {
      if (question.answers && Array.isArray(question.answers)) {
        return [...allAnswers, ...question.answers]
      }
      return allAnswers
    }, []).filter((answer) => {
      return answer.minimumResultScore > 0
    })
    return answers
  })

  const maximumResultAnswers = computed(() => {
    if (!quiz.value || !quiz.value.questions.length) return []
    const answers = quiz.value.questions.reduce((allAnswers, question) => {
      if (question.answers && Array.isArray(question.answers)) {
        return [...allAnswers, ...question.answers]
      }
      return allAnswers
    }, []).filter((answer) => {
      return answer.maximumResultScore > 0
    })
    return answers
  })

  const userAnswersFlat = computed(() => {
    return Object.values(userAnswers.value).flat()
  })

  // Actions
  /**
   * Load a quiz by slug
   * @param {string} slug - The slug of the quiz to load
   * @returns {Promise<Object>} - The loaded quiz
   */
  const loadQuiz = async (slug) => {
    loading.value = true
    error.value = null

    try {
      // Use REST api to fetch the quiz
      const getQuizQS = getQuizBySlugREST(slug)
      const getQuizQuery = qs.stringify(getQuizQS, { encodeValuesOnly: true })
      const { strapiUrl } = useAppConfig()
      const restResponse = await $fetch(`${strapiUrl}/api/quizzes?${getQuizQuery}`)

      // Check if quiz exists and is active
      const quizData = restResponse.data?.[0]

      if (!quizData) {
        throw new Error('Quiz not found')
      }

      if (!quizData.isActive) {
        throw new Error('This quiz is currently unavailable')
      }

      // Process and store quiz data
      quiz.value = {
        id: quizData.documentId,
        title: quizData.title,
        slug: quizData.slug,
        description: quizData.description,
        version: quizData.version,
        questions: processQuestions(quizData.questions),
        resultCategories: processResultCategories(quizData.resultCategories),
        defaultCTA: quizData.defaultCTA,
        leadMagnet: quizData.leadMagnet?.url || null,
        collectContactInfo: quizData.collectContactInfo,
        contactFormFields: quizData.contactFormFields || {},
        successMessage: quizData.successMessage,
      }

      loading.value = false
      return quiz.value
    }
    catch (err) {
      console.error('Error loading quiz:', err)
      error.value = err.message || 'Failed to load quiz'
      loading.value = false
      throw err
    }
  }

  // Helper functions for processing quiz data
  const processQuestions = (questions) => {
    if (!questions) return []

    return [...questions]
      .sort((a, b) => a.id - b.id)
      .map(q => ({
        questionId: q.questionId,
        questionText: q.questionText,
        description: q.description,
        type: q.type,
        required: q.required,
        order: q.order,
        media: q.media?.url,
        answers: processAnswers(q.answers),
      }))
  }

  const processAnswers = (answers) => {
    if (!answers) return []

    return answers.map(a => ({
      answerId: a.answerId,
      answerText: a.answerText,
      value: a.value,
      isCorrect: a.isCorrect,
      media: a.media?.url,
      branchToQuestion: a.branchToQuestion,
      maximumResultScore: a.maximumResultScore,
      minimumResultScore: a.minimumResultScore,
    }))
  }

  const processResultCategories = (resultCategories) => {
    if (!resultCategories) return []

    return resultCategories.map(rc => ({
      title: rc.title,
      description: rc.description,
      media: rc.media?.url,
      minScore: rc.minScore,
      maxScore: rc.maxScore,
      criteria: rc.criteria,
      ctaText: rc.ctaText,
      ctaLink: rc.ctaLink,
    }))
  }

  // Actions
  // Quiz flow methods
  const startQuiz = () => {
    started.value = true
    currentQuestionIndex.value = 0
    userAnswers.value = {}
    quizResult.value = null
    startTime.value = new Date()
  }

  const handleAnswer = (questionId, answer) => {
    // Store answer
    userAnswers.value[questionId] = answer

    // Check for branching logic (for future implementation)
    const currentAnswerObj = currentQuestion.value.answers.find(a =>
      a.answerId === (Array.isArray(answer) ? answer[0] : answer),
    )

    // If there's branching logic and it's enabled, use it
    if (currentAnswerObj?.branchToQuestion) {
      const branchToIndex = quiz.value.questions.findIndex(
        q => q.order === currentAnswerObj.branchToQuestion,
      )

      if (branchToIndex !== -1) {
        currentQuestionIndex.value = branchToIndex
        return
      }
    }

    // Otherwise, go to next question
    if (currentQuestionIndex.value < quiz.value.questions.length - 1) {
      currentQuestionIndex.value++
    }
    else {
      calculateResult()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex.value > 0) currentQuestionIndex.value--
  }

  const calculateScoreBoundaries = (overrides) => {
    // Get all non-null minimumResultScore values
    const minScores = overrides
      .filter(override => override.minimumResultScore !== null)
      .map(override => override.minimumResultScore)

    // Get all non-null maximumResultScore values
    const maxScores = overrides
      .filter(override => override.maximumResultScore !== null)
      .map(override => override.maximumResultScore)

    // Find highest minimum (or null if none exist)
    const minScore = minScores.length ? Math.max(...minScores) : null

    // Find lowest maximum (or null if none exist)
    const maxScore = maxScores.length ? Math.min(...maxScores) : null

    return { minScore, maxScore }
  }

  const checkResultOverride = (userAnswers) => {
    // list all user answers that appear in the minimumResultScore property
    const minOverrides = minimumResultAnswers.value.filter((mrAnswer) => {
      return userAnswersFlat.value.includes(mrAnswer.answerId)
    })

    // list all user answers that appear in the maximumResultScore property
    const maxOverrides = maximumResultAnswers.value.filter((mrAnswer) => {
      return userAnswersFlat.value.includes(mrAnswer.answerId)
    })

    // merge the two together
    const allOverrides = minOverrides.concat(maxOverrides)

    return allOverrides
  }

  const determineResultCategory = (rawScore,
    resultCategories,
    overrides,
    userAnswers) => {
    // First, calculate score boundaries from overrides
    const {
      minScore: overrideMin,
      maxScore: overrideMax,
    } = calculateScoreBoundaries(
      overrides.filter(override => userAnswers.includes(override.answerId)),
    )

    // Find the default category based on raw score
    const defaultCategory = resultCategories.find((category) => {
      const meetsMinRequirement = category.minScore === null
        || rawScore >= category.minScore
      const meetsMaxRequirement = category.maxScore === null
        || rawScore <= category.maxScore
      return meetsMinRequirement && meetsMaxRequirement
    })

    // If no overrides apply, return the default category
    if (overrideMin === null && overrideMax === null) {
      return defaultCategory
    }

    // Apply overrides to find the correct category
    // If an override sets a minimum score, we need a category where minScore <= overrideMin
    // If an override sets a maximum score, we need a category where maxScore >= overrideMax
    return resultCategories.find((category) => {
      // Check if this category satisfies the override minimum (if one exists)
      const satisfiesOverrideMin = overrideMin === null
        || (category.minScore !== null && category.minScore <= overrideMin)

      // Check if this category satisfies the override maximum (if one exists)
      const satisfiesOverrideMax = overrideMax === null
        || (category.maxScore !== null && category.maxScore >= overrideMax)

      return satisfiesOverrideMin && satisfiesOverrideMax
    }) || defaultCategory // Fallback to default if no category matches overrides
  }

  // wrapper function for calculating the quiz results
  const calculateResult = () => {
    // Check for Overrides
    const overrides = checkResultOverride(userAnswers.value)

    // Simple scoring for now - sum the answer values
    let totalScore = 0

    Object.entries(userAnswers.value).forEach(([questionId, answer]) => {
      const question = quiz.value.questions.find(q => q.questionId === questionId)

      if (question) {
        if (Array.isArray(answer)) {
          // Multiple choice question
          answer.forEach((a) => {
            const answerObj = question.answers.find(ans => ans.answerId === a)
            if (answerObj) totalScore += answerObj.value
          })
        }
        else {
          // Single choice question
          const answerObj = question.answers.find(ans => ans.answerId === answer)
          if (answerObj) totalScore += answerObj.value
        }
      }
    })

    // Find matching result category
    const resultCategory = determineResultCategory(totalScore,
      quiz.value.resultCategories,
      overrides,
      userAnswersFlat.value)
    // Set result
    quizResult.value = {
      score: totalScore,
      category: resultCategory,
    }

    // Mark quiz as completed
    completed.value = true
  }

  /**
   * Submit quiz results to Strapi
   * @param {Object} submissionData - The quiz submission data
   * @returns {Promise<Object>} - The submission response
   */
  const submitQuizResults = async (submissionData) => {
    isSubmitting.value = true
    submissionError.value = null

    try {
      // Use REST api to submit the mutation
      const { strapiUrl } = useAppConfig()
      const response = await $fetch(`${strapiUrl}/api/quiz-submissions`, {
        method: 'post',
        body: {
          data: submissionData,
        },
      })

      // Store the submission locally
      // const submission = response.data.createQuizSubmission.data
      // quizSubmissions.value.push(submission)

      isSubmitting.value = false
      // return submission
      return
    }
    catch (error) {
      console.error('Error submitting quiz results:', error)
      submissionError.value = 'Failed to submit quiz results. Please try again.'
      isSubmitting.value = false
      throw error
    }
  }

  const handleContactSubmit = async (contactInfo) => {
    try {
      // Stash answers in KV
      const kvKey = `quizAnswers:${startTime.value}`
      await $fetch('/api/quizzes/store-answers', {
        method: 'post',
        body: {
          kvKey,
          data: {
            quiz: quiz.value.id,
            quizVersion: quiz.value.version,
            answers: userAnswers.value,
            score: quizResult.value.score,
            resultCategory: quizResult.value.category?.title,
            contactInfo,
            startedAt: startTime.value,
            submittedToCRM: false,
            userAgent: navigator.userAgent,
          }
        }
      })

      // Submit to Mailer Lite
      await $fetch('/api/subscribe', { method: 'post', body: contactInfo })

      // Submit to CRM if enhancedMarketingConsent is true
      if (contactInfo.enhancedMarketingConsent) {
        await submitToCRM(contactInfo, {
          quiz: quiz.value.title,
          score: quizResult.value.score,
          result: quizResult.value.category?.title,
          startedAt: startTime.value,
          completedAt: new Date(),
        })

        contactSubmitted.value = true

        // generate and deliver enhanced report
        await $fetch('/api/quizzes/generate-report', {
          method: 'post',
          body: {
            user: contactInfo,
            quizResults: {
              quizId: quiz.value.id,
              slug: quiz.value.slug,
              pathwayName: quizResult.value.category.title,
              pathwaySummary: JSON.stringify(quizResult.value.category.description),
              userAnswers: JSON.stringify(userAnswers.value),
              totalScore: quizResult.value.score,
              version: quiz.value.version,
            },
          },
        })
      }
    }
    catch (err) {
      console.error('Error submitting quiz results:', err)
      // Show error message
    }
  }

  const handleContactSkip = async () => {
    try {
      // Submit to Strapi without contact info
      await quizStore.submitQuizResults({
        quiz: quiz.value.id,
        quizVersion: quiz.value.version,
        answers: userAnswers.value,
        score: quizResult.value.score,
        resultCategory: quizResult.value.category?.title,
        contactInfo: null,
        startedAt: startTime.value,
        submittedAt: new Date(),
        submittedToCRM: false,
        userAgent: navigator.userAgent,
      })

      contactSubmitted.value = true
    }
    catch (err) {
      console.error('Error submitting quiz results:', err)
      // Show error message
    }
  }

  const resetQuiz = () => {
    started.value = false
    completed.value = false
    contactSubmitted.value = false
    currentQuestionIndex.value = 0
    userAnswers.value = {}
    quizResult.value = null
  }

  /**
   * Submit quiz results and contact info to CRM
   * @param {Object} contactInfo - The user's contact information
   * @param {Object} quizData - Information about the quiz and results
   * @returns {Promise<boolean>} - Whether the submission was successful
   */
  const submitToCRM = async (contactInfo, quizData) => {
    if (!contactInfo || !contactInfo.email) {
      return false
    }

    try {
      // Adapt this to your specific CRM API
      const { public: { lawmatics: { quizFormUrl } } } = useRuntimeConfig()
      const crmResponse = await $fetch(quizFormUrl, {
        method: 'post',
        body: {
          email: contactInfo.email,
          first_name: contactInfo.firstName,
          last_name: contactInfo.lastName || '',
          phone: contactInfo.phone || '',
          general_field_cd24: quizData.quiz,
          general_field_4215: JSON.stringify(quizData.answers),
          general_field_a3fa: JSON.stringify(quizData.result),
        },
      })

      return crmResponse.data?.success || false
    }
    catch (error) {
      console.error('Error submitting to CRM:', error)
      return false
    }
  }

  /**
   * Update a quiz submission with CRM submission status
   * @param {string} submissionId - The ID of the quiz submission
   * @param {string} crmSubmissionId - The ID from the CRM system
   * @returns {Promise<boolean>} - Whether the update was successful
   */
  const updateCrmSubmissionStatus = async (submissionId, crmSubmissionId) => {
    try {
      // Use your API client to update the submission
      // This would use a Strapi update mutation

      // Update local state
      const submissionIndex = quizSubmissions.value.findIndex(s => s.id === submissionId)
      if (submissionIndex !== -1) {
        quizSubmissions.value[submissionIndex].attributes.submittedToCRM = true
        quizSubmissions.value[submissionIndex].attributes.crmSubmissionId = crmSubmissionId
      }

      return true
    }
    catch (error) {
      console.error('Error updating CRM submission status:', error)
      return false
    }
  }

  /**
   * Get analytics for a specific quiz
   * @param {string} quizId - The ID of the quiz
   * @returns {Promise<Object>} - Analytics data
   */
  const getQuizAnalytics = async (quizId) => {
    // This would be implemented later when you add analytics
    // Would fetch submission data and calculate metrics
    return {
      completionRate: 0,
      averageScore: 0,
      resultDistribution: {},
      leadConversionRate: 0,
    }
  }

  // Reset state
  const resetQuizState = () => {
    quiz.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    completed,
    contactSubmitted,
    basicContactSubmitted,
    enhancedContactSubmitted,
    contactEnhanced,
    currentQuestionIndex,
    error,
    isSubmitting,
    loading,
    quiz,
    quizResult,
    quizSubmissions,
    started,
    startTime,
    submissionError,
    userAnswers,

    // Getters
    currentQuestion,
    isQuizLoaded,
    progressPercent,
    maximumResultAnswers,
    minimumResultAnswers,

    // Actions
    getQuizAnalytics,
    handleAnswer,
    handleContactSubmit,
    handleContactSkip,
    handlePrevious,
    loadQuiz,
    resetQuiz,
    resetQuizState,
    startQuiz,
    submitQuizResults,
    submitToCRM,
    updateCrmSubmissionStatus,
  }
})
