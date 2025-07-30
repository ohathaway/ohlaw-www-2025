// utils/quizQueries.js
import qs from 'qs'

/**
 * QS object to get a quiz by its slug
 */
export const getQuizBySlugREST = (slug) => {
  return {
    filters: {
      slug: {
        $eq: slug, // This will be replaced with your actual slug value
      },
    },
    populate: {
      leadMagnet: {
        fields: [
          'documentId', 'name', 'alternativeText', 'caption', 'width', 'height',
          'formats', 'hash', 'ext', 'mime', 'size', 'url', 'previewUrl',
          'provider', 'provider_metadata',
        ],
      },
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
      'defaultCTA', 'collectContactInfo', 'successMessage', 'documentId',
      'createdAt', 'updatedAt', 'publishedAt', 'isActive', 'version',
      'description', 'slug', 'title', 'contactFormFields',
    ],
  }
}

/**
 * REST mutation to submit quiz results
 */
export const submitQuizResults = (results) => {
  // console.debug('constructing quiz submission from:', results)
  try {
    const {
      answers,
      quiz,
      quizVersion,
      score,
      resultCategory,
      contactInfo,
      submittedToCRM,
      userAgent,
      startedAt,
    } = results

    const params = {
      data: { results },
    }
    return qs.stringify(params, { encode: false })
  }
  catch (error) {
    console.error('failed to compile result mutation for REST:', error)
    throw error
  }
}

/**
 * REST query to get all active quizzes
 */
export const getActiveQuizzesREST = () => {
  return qs.stringify({
    filters: {
      isActive: {
        $eq: true,
      },
    },
    fields: [
      'title',
      'slug',
      'description',
    ],
  }, { encode: false })
}

/**
 * REST query to get quiz submissions
 */
export const getQuizSubmissionsREST = (quizId, limit = 25) => {
  const params = {
    sort: ['submittedAt:desc'],
    fields: [
      'quizVersion',
      'score',
      'resultCategory',
      'submittedAt',
      'submittedToCRM',
    ],
    pagination: {
      pageSize: limit,
      page: 1,
    },
  }

  if (quizId) {
    params.filters = {
      quiz: {
        documentId: {
          $eq: quizId,
        },
      },
    }
  }

  return qs.stringify(params, { encode: false })
}

/**
 * REST query for AI quiz data by slug
 */
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
 * REST function to update a quiz submission
 * @param {string} submissionId - The ID of the submission to update
 * @param {Object} data - The data to update
 * @returns {Object} - The data object for the REST API call
 */
export const updateQuizSubmissionREST = (submissionId, data) => {
  return {
    data,
  }
}
