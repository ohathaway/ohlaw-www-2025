// Temporary debug endpoint to isolate the
// production 500 error on POST requests.

export default defineEventHandler(
  async (event) => {
    try {
      console.log('DEBUG: handler reached')

      const body = await readBody(event)
      console.log('DEBUG: body parsed, keys:',
        Object.keys(body ?? {}))

      const hasFile = !!body?.fileBase64
      const fileSize = body?.fileBase64?.length ?? 0

      console.log('DEBUG: hasFile:', hasFile,
        'fileSize:', fileSize)

      return {
        ok: true,
        bodyKeys: Object.keys(body ?? {}),
        hasFile,
        fileSize,
      }
    }
    catch (err) {
      console.error('DEBUG ERROR:', err.message)
      return {
        ok: false,
        error: err.message,
        stack: err.stack?.split('\n').slice(0, 5),
      }
    }
  },
)
