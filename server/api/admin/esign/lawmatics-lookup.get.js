// Admin: search Lawmatics matters by name
// and return template-ready variables.

import {
  searchMatters,
  buildTemplateVarsFromMatter,
} from '../../../utils/esign/lawmatics'

export default defineEventHandler(
  async (event) => {
    const query = getQuery(event)

    if (!query.q && !query.id) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Provide ?q=name or ?id=matterId',
      })
    }

    // Direct lookup by matter ID
    if (query.id) {
      const vars
        = await buildTemplateVarsFromMatter(
          query.id,
        )

      if (!vars) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Matter not found',
        })
      }

      return { vars }
    }

    // Search by name
    const results
      = await searchMatters(query.q)

    const matters = results.map(m => ({
      id: m.id,
      name: [
        m.attributes?.first_name,
        m.attributes?.last_name,
      ].filter(Boolean).join(' '),
      caseTitle: m.attributes?.case_title,
      status: m.attributes?.status,
      email: m.attributes?.email,
      practiceArea:
        m.attributes?.practice_area?.name,
    }))

    return { matters }
  },
)
