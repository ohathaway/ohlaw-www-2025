import { Meilisearch } from 'meilisearch'

export const useMeilisearch = () => {
  const { meilisearch } = useAppConfig()
  const { public: config } = useRuntimeConfig()

  const search = new Meilisearch({
    host: meilisearch.host,
    apiKey: config.searchApiKey
  })
  return search
}