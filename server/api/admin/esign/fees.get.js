// Admin: list all fee schedules.
// Seeds defaults if table is empty.

import {
  getAllFees,
  seedDefaultFees,
} from '../../../utils/esign/fees'

export default defineEventHandler(async () => {
  let fees = await getAllFees()

  if (!fees.length) {
    fees = await seedDefaultFees()
  }

  return { fees }
})
