// REST queries for glossary terms
import qs from 'qs'

// Format tags to match the categories format in the glossary component
export const formatTagsToCategories = (tags) => {
  if (!tags || !tags.data || !tags.data.length) return []

  return tags.data.map(tag => ({
    id: tag.id,
    name: tag.attributes.name,
    slug: tag.attributes.slug,
  }))
}

// Format posts to match the relatedArticles format in the glossary component
export const formatPostsToRelatedArticles = (posts) => {
  if (!posts || !posts.data || !posts.data.length) return []

  return posts.data.map(post => ({
    id: post.id,
    title: post.attributes.Title,
    slug: post.attributes.slug,
  }))
}

// REST queries for glossary terms

export const allTermsQueryREST = () => {
  return qs.stringify({
    sort: ['term:asc'],
    populate: {
      tags: {
        fields: [
          'name',
          'slug',
        ],
      },
    },
    fields: [
      'term',
      'slug',
      'definition',
    ],
  }, { encode: false })
}

export const singleTermQueryREST = (slug) => {
  return qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      tags: {
        fields: [
          'name',
          'slug',
        ],
      },
      posts: {
        fields: [
          'Title',
          'slug',
        ],
      },
    },
    fields: [
      'term',
      'slug',
      'definition',
      'sources',
    ],
  }, { encode: false })
}
