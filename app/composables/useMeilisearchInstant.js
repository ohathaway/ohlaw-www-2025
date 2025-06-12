import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'

export const useMeilisearchInstant = () => {
  const { meilisearch } = useAppConfig()

  return instantMeiliSearch(
    meilisearch.host,
    meilisearch.searchApiKey
  ).searchClient
}