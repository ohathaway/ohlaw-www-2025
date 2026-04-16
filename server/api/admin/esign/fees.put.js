// Admin: update a fee schedule.

import { upsertFee }
  from '../../../utils/esign/fees'

export default defineEventHandler(
  async (event) => {
    const body = await readBody(event)

    if (
      !body.id
      || !body.label
      || body.filingFee == null
      || body.backgroundCheck == null
    ) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'id, label, filingFee, and '
          + 'backgroundCheck are required',
      })
    }

    const fee = await upsertFee({
      id: body.id,
      label: body.label,
      filingFee: body.filingFee,
      backgroundCheck: body.backgroundCheck,
    })

    return { fee }
  },
)
