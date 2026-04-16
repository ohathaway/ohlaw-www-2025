export default defineEventHandler(async () => {
  // eslint-disable-next-line no-undef
  const ai = hubAI() // access AI bindings
  return await ai.run('@cf/meta/llama-3.1-8b-instruct-fast', {
    prompt: 'Who is the author of Nuxt?',
  })
})
