import { Meilisearch } from 'meilisearch'

export const useMeilisearch = () => {
  const { meilisearch } = useAppConfig()

  const search = new Meilisearch({
    host: meilisearch.host,
    apiKey: meilisearch.searchApiKey
  })
  return search
}