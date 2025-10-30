export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { kvKey, data } = body

    if (!kvKey || !data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing kvKey or data in request body'
      })
    }

    // Store the quiz answers in KV
    await hubKV().set(kvKey, data)

    return { success: true }
  } catch (error) {
    console.error('Error storing quiz answers:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to store quiz answers'
    })
  }
})