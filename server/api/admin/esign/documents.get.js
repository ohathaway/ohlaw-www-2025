// Admin: list e-sign documents with optional
// status filter.

import { listDocuments }
  from '../../../utils/esign/db'

export default defineEventHandler(
  async (event) => {
    const query = getQuery(event)

    const documents = await listDocuments({
      status: query.status ?? undefined,
      limit: parseInt(query.limit, 10) || 50,
    })

    return { documents }
  },
)
