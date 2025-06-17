// utils/quizQueries.js

/**
 * GraphQL query to get a quiz by slug
 */
export const getQuizBySlug = gql`
  query getQuizBySlug($slug: String!) {
    quizzes(filters: { slug: { eq: $slug } }) {
      defaultCTA
      collectContactInfo
      contactFormFields
      successMessage
      documentId
      createdAt
      updatedAt
      publishedAt
      leadMagnet {
        documentId
        name
        alternativeText
        caption
        width
        height
        formats
        hash
        ext
        mime
        size
        url
        previewUrl
        provider
        provider_metadata
      }
      questions {
        questionText
        description
        type
        questionId
        required
        order
        media {
          name
          alternativeText
          caption
          width
          height
          formats
          hash
          ext
          mime
          size
          url
          previewUrl
          provider
          provider_metadata
          createdAt
          updatedAt
          publishedAt
        }
        answers {
          answerText
          value
          answerId
          isCorrect
          branchToQuestion
          maximumResultScore
          minimumResultScore
          media {
            name
            alternativeText
            caption
            width
            height
            formats
            hash
            ext
            mime
            size
            url
            previewUrl
            provider
            provider_metadata
            createdAt
            updatedAt
            publishedAt
          }
        }
      }
      isActive
      version
      description
      slug
      title
      resultCategories {
        title
        description
        minScore
        maxScore
        criteria
        ctaText
        ctaLink
        media {
          name
          alternativeText
          caption
          width
          height
          formats
          hash
          ext
          mime
          size
          url
          previewUrl
          provider
          provider_metadata
          createdAt
          updatedAt
          publishedAt
        }
      }
    }
  }
`

/**
 * QS object to get a quiz by its slug
 */
export const getQuizBySlugREST = slug => {
  return {
    filters: {
      slug: {
        $eq: slug // This will be replaced with your actual slug value
      }
    },
    populate: {
      leadMagnet: {
        fields: [
          'documentId', 'name', 'alternativeText', 'caption', 'width', 'height',
          'formats', 'hash', 'ext', 'mime', 'size', 'url', 'previewUrl',
          'provider', 'provider_metadata'
        ]
      },
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
      'defaultCTA', 'collectContactInfo', 'successMessage', 'documentId',
      'createdAt', 'updatedAt', 'publishedAt', 'isActive', 'version',
      'description', 'slug', 'title', 'contactFormFields'
    ]
  }
}

/**
 * GraphQL mutation to submit quiz results
 */
export const submitQuizResults = results => {
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
      startedAt
    } = results

    const params = {
      data: { results }
    }
    return qs.stringify(params, { encode: false })

    /*
    return gql`
      mutation submitQuizResults(
        createQuizSubmission(
          data: {
            answers: ${answers}
            quiz: ${quiz}
            quizVersion: ${quizVersion}
            score: ${score}
            resultCategory: ${resultCategory}
            contactInfo: ${contactInfo}
            submittedToCRM: ${submittedToCRM}
            userAgent: ${userAgent}
            startedAt: ${startedAt}
          }
        ) {
          publishedAt
          documentId
        }
      }
    `
    */
  } catch (error) {
    console.error('failed to compile result mutation for graphql:', error)
    throw error
  }
}


/**
 * GraphQL query to get all active quizzes
 * Useful for displaying available quizzes to users
 */
export const getActiveQuizzes = gql`
  query getActiveQuizzes {
    quizzes(filters: { isActive: { eq: true } }) {
      data {
        id
        attributes {
          title
          slug
          description
        }
      }
    }
  }
`

/**
 * GraphQL query to get quiz submissions
 * Useful for analytics or admin dashboard
 */
export const getQuizSubmissions = gql`
  query getQuizSubmissions($quizId: ID, $limit: Int) {
    quizSubmissions(
      filters: { quiz: { id: { eq: $quizId } } }
      pagination: { limit: $limit }
      sort: "submittedAt:desc"
    ) {
      data {
        id
        attributes {
          quizVersion
          score
          resultCategory
          submittedAt
          submittedToCRM
        }
      }
    }
  }
`

/**
 * GraphQL mutation to update a quiz submission
 * Useful for updating CRM status after submission
 */
export const updateQuizSubmission = gql`
  mutation updateQuizSubmission($id: ID!, $data: QuizSubmissionInput!) {
    updateQuizSubmission(id: $id, data: $data) {
      data {
        id
        attributes {
          submittedToCRM
          crmSubmissionId
        }
      }
    }
  }
`